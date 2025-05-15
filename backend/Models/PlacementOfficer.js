const mongoose = require('mongoose');


const placementOfficerSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        department: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('PlacementOfficer', placementOfficerSchema);
