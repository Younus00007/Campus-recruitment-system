const express = require('express');
const jwt = require('jsonwebtoken');
const CandidateDetails = require('../Models/CandidateDetails'); // Import the CandidateDetails model
const router = express.Router();
const JWT_SECRET = "qBtxN5yLXV4vFJdfl8Ml9y2XKaQJQOZY91wMl/H6YcM=";

// Login route for CandidateDetails
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log("Login request received:", { email, password }); // Debug log

    try {
        // Find candidate by email
        const candidate = await CandidateDetails.findOne({ "personalDetails.email": email });

        if (!candidate) {
            console.log("Candidate not found for email:", email); // Debug log
            return res.status(404).json({ message: "Candidate not found" });
        }

        // Verify password
        console.log("Candidate found:", candidate.fullName); // Debug log
        if (candidate.personalDetails.password !== password) {
            console.log("Invalid password for email:", email); // Debug log
            return res.status(400).json({ message: "Invalid password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: candidate._id, role: "candidate" }, JWT_SECRET, { expiresIn: '1h' });

        console.log("Login successful for:", email); // Debug log
        res.status(200).json({
            message: "Login successful",
            token,
            candidate: {
                id: candidate._id,
                fullName: candidate.fullName,
                email: candidate.personalDetails.email,
                regNo: candidate.regNo,
            }
        });
    } catch (error) {
        console.error("Error during login:", error.message); // Debug log
        res.status(500).json({ message: "Server error" });
    }
});
module.exports = router;
