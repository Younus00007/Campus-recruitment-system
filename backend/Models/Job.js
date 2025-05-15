const mongoose = require('mongoose');

const JobSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        requirements: [{
            type: String,
        }],
        salary: {
            type: Number,
        },
        location: {
            type: String,
        },
        recruiter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', 
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Job', JobSchema);
