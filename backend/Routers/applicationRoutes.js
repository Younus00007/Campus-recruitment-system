const express = require('express');
const Application = require('../Models/Application');
const Job = require('../Models/Job');
const CandidateDetails = require('../Models/CandidateDetails'); // Import CandidateDetails model
const router = express.Router();
const authMiddleware = require('./authMiddleware');
const multer = require('multer');
const path= require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Save files in the '../Upload/uploads/' directory
        cb(null, path.join(__dirname, '..', 'Upload', 'uploads')); // Directory to save uploaded files
    },
    filename: function (req, file, cb) {
        // Generate a unique file name using the original name + timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Add file extension
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Maximum file size (10MB)
    fileFilter: function (req, file, cb) {
        const filetypes = /pdf|doc|docx/; // Allowed file types (pdf, doc, docx)
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only PDF, DOC, and DOCX files are allowed.'));
    }
});

// Route to submit a job application
// applicationRoute.js (POST route)
router.post('/', authMiddleware, upload.single('resume'), async (req, res) => {
    const { jobId, coverLetter } = req.body;
    const userId = req.user.id; // Get user ID from token

    try {
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(400).json({ message: 'Job not found' });
        }

        const candidateDetails = await CandidateDetails.findById(userId); // Find candidate details
        if (!candidateDetails) {
            return res.status(400).json({ message: 'Candidate details not found' });
        }

        const resume = req.file ? path.join('uploads', req.file.filename) : null; // Save file path relative to the public directory

        const application = new Application({
            job: jobId,
            role: userId, // Assign the userId to the role field
            resume: resume, // Store resume file path
            coverLetter,
            status: 'pending', // Default status
        });

        await application.save(); // Save the application

        res.status(201).json({ message: 'Application submitted successfully', application });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
});


// Route to fetch applications for jobs posted by the recruiter
router.get('/recruiter', authMiddleware, async (req, res) => {
    const recruiterId = req.user.id; // Extract recruiter ID from token

    try {
        // Find jobs posted by the recruiter
        const jobs = await Job.find({ recruiter: recruiterId });

        if (!jobs.length) {
            return res.status(404).json({ message: 'No jobs found for this recruiter' });
        }

        // Extract job IDs
        const jobIds = jobs.map((job) => job._id);

        // Find applications for these jobs and populate job and role details
        const applications = await Application.find({ job: { $in: jobIds } })
        .populate('job', 'title')  // Populate job title only
        .populate('role', 'fullName regNo personalDetails.email')  // Fetch fullName, regNo, and email
        .exec();
    
        if (!applications.length) {
            return res.status(404).json({ message: 'No applications found for your jobs' });
        }

        res.status(200).json(applications);
    } catch (error) {
        console.error('Error fetching recruiter applications:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to fetch applications for the logged-in candidate
router.get('/', authMiddleware, async (req, res) => {
    const candidateId = req.user.id; // Extract candidate ID from token

    try {
        const applications = await Application.find({ role: candidateId }) // Match candidate ID
        .populate('job', 'title')  // Populate job title only
        .populate('role', 'fullName regNo personalDetails.email')  // Fetch fullName, regNo, and email
        .exec();
    

        if (!applications.length) {
            return res.status(404).json({ message: 'No applications found' });
        }

        res.status(200).json(applications);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to fetch applications for a specific job by jobId
router.get('/:jobId', authMiddleware, async (req, res) => {
    const { jobId } = req.params;

    try {
        const applications = await Application.find({ job: jobId })
            .populate('job', 'title location') // Populate job info
            .populate('role', 'fullName email') // Populate user info (role)
            .exec();

        if (!applications.length) {
            return res.status(404).json({ message: 'No applications found for this job' });
        }

        res.status(200).json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to update the status of an application
router.patch('/:applicationId/status', authMiddleware, async (req, res) => {
    const { applicationId } = req.params;
    const { status } = req.body; // Get the new status from the request

    // Validate status value
    if (!['pending', 'accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
    }

    try {
        // Find the application by ID and update its status
        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        application.status = status; // Update status
        await application.save(); // Save changes

        res.status(200).json({ message: 'Application status updated successfully', application });
    } catch (error) {
        console.error('Error updating application status:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/recruiter/applications',  async (req, res) => {
    try {
        const applications = await Application.find()
            .populate({
                path: 'candidateId',
                select: 'fullName personalDetails.resume personalDetails.email',
            })
            .populate({
                path: 'jobId',
                select: 'title location',
            });

        if (!applications.length) {
            return res.status(404).json({ message: 'No applications found.' });
        }

        res.json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
