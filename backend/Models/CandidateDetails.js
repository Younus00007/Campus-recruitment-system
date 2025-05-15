const mongoose = require('mongoose');

const CandidateDetailsSchema = mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        regNo: {
            type: String,
            required: true,
            unique: true,
        },
        dob: {
            type: Date,
            required: true,
        },
        role: {
            type: String,
            required: true,
        },
        yearOfPassing: {
            type: Number,
            required: true,
        },
        cgpa: {
            type: Number,
            required: true,
            min: 0,
            max: 10,
        },
        personalDetails: {
            image: {
                type: String, 
                required: false, 
            },
            email: { type: String, required: true },
            address: { type: String, required: true },
            phone: { type: String, required: true },
            password: {
                type: String,
                required: true,
            },
            resume: {
                type: String, 
                required: false, 
            },
        },
        skills: {
            type: [String],
            enum: [
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
            ],
            required: true,
        },
        certifications: [
            {
                title: { type: String },
                issuedBy: { type: String },
                date: { type: Date },
            },
        ],
        projects: [
            {
                title: { type: String },
                description: { type: String },
                technologies: [{ type: String }],
                skillsused: {
                    type: [String],
                    enum: [
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
                    ],
                },
            },
        ],
        achievements: [
            {
                title: { type: String },
                description: { type: String },
                date: { type: Date },
            },
        ],
        experience: [
            {
                companyName: { type: String },
                role: { type: String },
                startDate: { type: Date },
                endDate: { type: Date },
                description: { type: String },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('CandidateDetails', CandidateDetailsSchema);