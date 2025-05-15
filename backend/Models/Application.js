const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "CandidateDetails" }, // Ensure it references CandidateDetails
    resume: String,
    coverLetter: String,
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" }
});

module.exports = mongoose.model("Application", applicationSchema);
