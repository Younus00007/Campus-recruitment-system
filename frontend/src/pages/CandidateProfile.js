import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/CandidateProfile.css";

const CandidateProfile = () => {
    const [candidate, setCandidate] = useState(null);
    const [formData, setFormData] = useState({
        fullName: "",
        regNo: "",
        dob: "",
        role: "",
        yearOfPassing: "",
        cgpa: "",
        personalDetails: {
            image: "",
            email: "",
            address: "",
            phone: "",
            password: "",
            resume: ""
        },
        skills: [],
        certifications: [],
        projects: [],
        achievements: [],
        experience: []
    });
    const [image, setImage] = useState(null);
    const [resume, setResume] = useState(null);
    
    useEffect(() => {
        const fetchCandidate = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/candidates/me"); // Use your actual API URL
                // Ensure the correct endpoint
                setCandidate(response.data);
                setFormData(response.data);
            } catch (error) {
                console.error("Error fetching candidate details:", error);
            }
        };
    
        fetchCandidate(); // Call the function
    }, []);
    
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e, type) => {
        if (type === "image") setImage(e.target.files[0]);
        if (type === "resume") setResume(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/candidates/${candidate._id}`, formData);
            if (image) await handleFileUpload(image, "upload");
            if (resume) await handleFileUpload(resume, "upload-resume");
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const handleFileUpload = async (file, endpoint) => {
        const fileData = new FormData();
        fileData.append("file", file);
        fileData.append("candidateId", candidate._id);
        await axios.post(`/api/candidates/${endpoint}`, fileData);
    };

    return (
        <div className="add-candidate-container">
            <h2>Update Candidate Profile</h2>
            <form onSubmit={handleSubmit} className="add-candidate-form">
                <label>Full Name</label>
                <input type="text" name="fullName" value={formData.fullName || ""} onChange={handleChange} required />
                
                <label>Registration Number</label>
                <input type="text" name="regNo" value={formData.regNo || ""} onChange={handleChange} required />
                
                <label>Date of Birth</label>
                <input type="date" name="dob" value={formData.dob || ""} onChange={handleChange} required />
                
                <label>Role</label>
                <input type="text" name="role" value={formData.role || ""} onChange={handleChange} required />
                
                <label>Year of Passing</label>
                <input type="number" name="yearOfPassing" value={formData.yearOfPassing || ""} onChange={handleChange} required />
                
                <label>CGPA</label>
                <input type="number" step="0.01" name="cgpa" value={formData.cgpa || ""} onChange={handleChange} required />
                
                <label>Email</label>
                <input type="email" name="personalDetails.email" value={formData.personalDetails.email || ""} onChange={handleChange} required />
                
                <label>Address</label>
                <input type="text" name="personalDetails.address" value={formData.personalDetails.address || ""} onChange={handleChange} required />
                
                <label>Phone</label>
                <input type="text" name="personalDetails.phone" value={formData.personalDetails.phone || ""} onChange={handleChange} required />
                
                <label>Password</label>
                <input type="password" name="personalDetails.password" value={formData.personalDetails.password || ""} onChange={handleChange} required />
                
                <label>Skills</label>
                <input type="text" name="skills" value={formData.skills.join(", ") || ""} onChange={(e) => setFormData({ ...formData, skills: e.target.value.split(", ") })} placeholder="Skills (comma separated)" required />
                
                <label>Upload Image</label>
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "image")} />
                
                <label>Upload Resume</label>
                <input type="file" accept="application/pdf" onChange={(e) => handleFileChange(e, "resume")} />
                
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
};

export default CandidateProfile;
