const express = require("express");
const router = express.Router();
const CandidateDetails = require("../Models/CandidateDetails");
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const uploadDirectory = path.join(__dirname, 'Upload/uploads');
// Ensure the upload directory exists
if (!fs.existsSync(uploadDirectory)) {
    console.log("Creating upload directory:", uploadDirectory);
    fs.mkdirSync(uploadDirectory, { recursive: true });
} else {
    console.log("Upload directory already exists:", uploadDirectory);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '..', 'Upload', 'uploads');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${file.originalname.split(".")[0]}_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage: storage,
});
// Create a new candidate
router.post("/", async (req, res) => {
    try {
        const candidate = new CandidateDetails(req.body);
        await candidate.save();
        res.status(201).json({ message: "Candidate details created successfully", candidate });
    } catch (error) {
        console.log(error.message)
        console.error("Error creating candidate details:", error);
        res.status(400).json({ message: error.message });
    }
});
router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            console.error("No file found in request");
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Store image path relative to the 'uploads' folder
        const imagePath = `uploads/${req.file.filename}`; 

        const { candidateId } = req.body;
        if (!candidateId) {
            return res.status(400).json({ message: "Candidate ID is required" });
        }

        const candidate = await CandidateDetails.findByIdAndUpdate(
            candidateId,
            { "personalDetails.image": imagePath },
            { new: true, runValidators: true }
        );

        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        res.status(201).json({
            message: "File uploaded and candidate updated successfully",
            file: req.file,
            candidate,
        });
    } catch (error) {
        console.error("Error during file upload:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});

// Resume upload route
router.post("/upload-resume", upload.single("resume"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const { candidateId } = req.body;
        if (!candidateId) {
            return res.status(400).json({ message: "Candidate ID is required" });
        }

        // Store resume path relative to the 'uploads' folder
        const resumePath = `uploads/${req.file.filename}`;
        const candidate = await CandidateDetails.findByIdAndUpdate(
            candidateId,
            { "personalDetails.resume": resumePath },
            { new: true, runValidators: true }
        );

        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        res.status(201).json({
            message: "Resume uploaded successfully",
            candidate,
        });
    } catch (error) {
        console.error("Error during resume upload:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});

router.get('/uploads/:filename', (req, res) => {
    const filePath = path.join(__dirname, '..', 'Upload', 'uploads', req.params.filename);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ message: "File not found" });
    }
});


router.get("/skills", (req, res) => {
    const skills = [
        "Full Stack Development",
        "Front-End Development",
        "Back-End Development",
        "Machine Learning",
        "Data Science",
        "DevOps",
        "Cloud Computing",
        "Cybersecurity",
        "Artificial Intelligence",
        "Generative AI",
        "Blockchain",
        "Internet of Things (IoT)",
        "Game Development",
        "Mobile App Development",
        "AR/VR Development",
        "Data Analysis",
        "Big Data",
        "UI/UX Design",
        "Embedded Systems",
        "Networking",
        "Quality Assurance",
        "Software Testing",
    ];
    res.json(skills);
});
// Fetch all candidates
router.get("/", async (req, res) => {
    try {
        const candidates = await CandidateDetails.find(); // Fetch all candidate details from the database
        res.status(200).json(candidates); // Return the candidate list as a JSON response
    } catch (error) {
        console.error("Error fetching candidates:", error);
        res.status(500).json({ message: "Failed to fetch candidates", error });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const candidate = await CandidateDetails.findById(req.params.id);
        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }
        res.status(200).json(candidate);
    } catch (error) {
        console.error("Error fetching candidate details:", error);
        res.status(500).json({ message: "Failed to fetch candidate details" });
    }
});
router.get('/uploads/:filename', (req, res) => {
    const filePath = path.join(__dirname, '..', 'Upload', 'uploads', req.params.filename);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ message: "File not found" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const candidateId = req.params.id;
        const updateData = req.body;

        // Fetch the existing candidate details
        const existingCandidate = await CandidateDetails.findById(candidateId);
        if (!existingCandidate) {
            return res.status(404).json({ message: "Candidate not found." });
        }

        // Merge existing personalDetails with new updates
        if (updateData.personalDetails) {
            updateData.personalDetails = {
                ...existingCandidate.personalDetails.toObject(),
                ...updateData.personalDetails,
            };
        }

        const updatedCandidate = await CandidateDetails.findByIdAndUpdate(
            candidateId,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            message: "Candidate details updated successfully.",
            data: updatedCandidate,
        });
    } catch (error) {
        res.status(400).json({ message: "Error updating candidate details.", error });
    }
});


// Delete a candidate by ID
router.delete("/:id", async (req, res) => {
    try {
        const candidate = await CandidateDetails.findByIdAndDelete(req.params.id);
        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }
        res.status(200).json({ message: "Candidate details deleted successfully" });
    } catch (error) {
        console.error("Error deleting candidate details:", error);
        res.status(500).json({ message: "Failed to delete candidate details" });
    }
});


module.exports = router;
