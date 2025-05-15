const express = require('express');
const Job = require('../Models/Job');
const User = require('../Models/User');
const authMiddleware = require('../Routers/authMiddleware'); // Add middleware for auth
const router = express.Router();

// Route to post a job
router.post('/post-job', authMiddleware, async (req, res) => {
    const { title, description, requirements, salary, location } = req.body;

    try {
        // Ensure the logged-in user is a recruiter
        if (req.user.role !== 'recruiter') {
            return res.status(403).json({ message: 'Only recruiters can post jobs.' });
        }

        // Create and save the job
        const job = new Job({
            title,
            description,
            requirements,
            salary,
            location,
            recruiter: req.user.id, // Automatically associate job with the logged-in recruiter
        });

        await job.save();

        res.status(201).json({ message: 'Job posted successfully', job });
    } catch (error) {
        console.error('Error posting job:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to get all jobs
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find().populate('recruiter', 'name company');
        res.status(200).json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
