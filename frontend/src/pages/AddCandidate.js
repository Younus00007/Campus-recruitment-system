import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/Addcandidate.css";
import { Eye, EyeOff } from "lucide-react";

const AddCandidate = () => {
    const navigate = useNavigate();
    const [candidate, setCandidate] = useState({
        fullName: "",
        regNo: "",
        password: "",
        dob: "",
        role: "",
        yearOfPassing: "",
        cgpa: "",
        personalDetails: {
            phone: "",
            address: "",
            email: "",
            image: "",
            resume: null, // Add resume field
        },
        skills: [],
        certifications: [{ title: "", issuedBy: "", date: "" }],
        projects: [{ title: "", description: "", technologies: [], skillsused: [] }],
        achievements: [{ title: "", description: "", date: "" }],
        experience: [{ companyName: "", role: "", startDate: "", endDate: "", description: "" }],
    });
    const [showPassword, setShowPassword] = useState(false); // State for password visibility
    const [allSkills, setAllSkills] = useState([]);
    const [filteredSkills, setFilteredSkills] = useState([]);
    const [skillInput, setSkillInput] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [previewImage, setPreviewImage] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [resumeFile, setResumeFile] = useState(null); // State for resume file

    // Fetch skills from the backend
    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await axios.get("http://localhost:3030/api/candidatedetails/skills");
                setAllSkills(response.data);
            } catch (err) {
                console.error("Error fetching skills:", err);
                setError("Failed to load skills. Please try again.");
            }
        };

        fetchSkills();
    }, []);

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCandidate((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleNestedInputChange = (e, field) => {
        const { name, value } = e.target;
        setCandidate((prev) => ({
            ...prev,
            [field]: {
                ...prev[field],
                [name]: value,
            },
        }));
    };

    const handleArrayChange = (e, field, index) => {
        const { name, value } = e.target;
        setCandidate((prev) => ({
            ...prev,
            [field]: prev[field].map((item, i) =>
                i === index ? { ...item, [name]: value } : item
            ),
        }));
    };

    const addArrayItem = (field) => {
        const newItem = field === "projects"
            ? { title: "", description: "", technologies: [], skillsused: [] }
            : field === "certifications"
                ? { title: "", issuedBy: "", date: "" }
                : field === "achievements"
                    ? { title: "", description: "", date: "" }
                    : { companyName: "", role: "", startDate: "", endDate: "", description: "" };
        setCandidate((prev) => ({
            ...prev,
            [field]: [...prev[field], newItem],
        }));
    };

    const removeArrayItem = (field, index) => {
        setCandidate((prev) => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index),
        }));
    };

    const handleSkillInputChange = (e) => {
        const value = e.target.value;
        setSkillInput(value);

        const matches = allSkills.filter((skill) =>
            skill.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredSkills(matches);
    };

    const handleSkillSelect = (skill) => {
        if (!candidate.skills.includes(skill)) {
            setCandidate((prev) => ({
                ...prev,
                skills: [...prev.skills, skill],
            }));
        }
        setSkillInput("");
        setFilteredSkills([]);
    };

    const handleSkillRemove = (skillToRemove) => {
        setCandidate((prev) => ({
            ...prev,
            skills: prev.skills.filter((skill) => skill !== skillToRemove),
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setPreviewImage(previewUrl);
            setError("");
        }
    };

    const handleResumeChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setResumeFile(file);
            setError("");
        }
    };

    const uploadFile = async () => {
        if (!imageFile) {
            setError("Please select an image before uploading.");
            return;
        }

        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("candidateId", candidate._id); // Ensure candidate._id is passed

        try {
            const response = await axios.post(
                "http://localhost:3030/api/candidatedetails/upload",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log("Upload Success:", response.data);

            // Update state with uploaded image path
            setCandidate((prev) => ({
                ...prev,
                personalDetails: {
                    ...prev.personalDetails,
                    image: response.data.filePath,
                },
            }));

            setPreviewImage(response.data.filePath);
            setSuccess("Image uploaded successfully.");
            setError("");
        } catch (error) {
            console.error("Upload Error:", error.response?.data || error.message);
            setError("Image uploaded successfully.");
        }
    };

    const uploadResume = async () => {
        if (!resumeFile) {
            setError("Please select a resume file before uploading.");
            return;
        }

        const formData = new FormData();
        formData.append("resume", resumeFile);
        formData.append("candidateId", candidate._id); // Ensure candidate._id is passed

        try {
            const response = await axios.post(
                "http://localhost:3030/api/candidatedetails/upload-resume",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log("Resume Upload Success:", response.data);

            setSuccess("Resume uploaded successfully.");
            setError("");
        } catch (error) {
            console.error("Resume Uploaded Successfully:", error.response?.data || error.message);
            setError("Resume Uploaded Successfully.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
    
        try {
            // Step 1: Create the candidate
            const response = await axios.post("http://localhost:3030/api/candidatedetails", candidate);
            const candidateId = response.data.candidate._id; // Get the candidate ID from the response
    
            // Step 2: Upload the image (if selected)
            if (imageFile) {
                const imageFormData = new FormData();
                imageFormData.append("file", imageFile);
                imageFormData.append("candidateId", candidateId);
    
                await axios.post(
                    "http://localhost:3030/api/candidatedetails/upload",
                    imageFormData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
            }
    
            // Step 3: Upload the resume (if selected)
            if (resumeFile) {
                const resumeFormData = new FormData();
                resumeFormData.append("resume", resumeFile);
                resumeFormData.append("candidateId", candidateId);
    
                await axios.post(
                    "http://localhost:3030/api/candidatedetails/upload-resume",
                    resumeFormData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
            }
    
            // Success message and navigation
            setSuccess("Candidate added successfully.");
            setTimeout(() => navigate("/candidate-List"), 2000);
        } catch (err) {
            console.error("Error adding candidate:", err.message);
            setError("Failed to add candidate. Please check the form and try again.");
        }
    };

    return (
        <div className="add-candidate-container">
            <h2>Add Candidate</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <form onSubmit={handleSubmit} className="add-candidate-form">
                {/* Existing form fields */}
                <label>Full Name:<input type="text" name="fullName" value={candidate.fullName} onChange={handleInputChange} required /></label>
                <label>Registration Number:<input type="text" name="regNo" value={candidate.regNo} onChange={handleInputChange} required /></label>
                <label>Role:<input type="text" name="role" value={candidate.role} onChange={handleInputChange} required /></label>
                <label>Password:</label>
                <div className="password-field">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={candidate.personalDetails.password || ""}
                        onChange={(e) => handleNestedInputChange(e, "personalDetails")}
                        required
                    />
                    <span className="eye-icon" onClick={togglePasswordVisibility}>
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </span>
                </div>
                <label>Date of Birth:<input type="date" name="dob" value={candidate.dob} onChange={handleInputChange} required /></label>
                <label>Year of Passing:<input type="number" name="yearOfPassing" value={candidate.yearOfPassing} onChange={handleInputChange} required /></label>
                <label>CGPA:<input type="number" name="cgpa" value={candidate.cgpa} onChange={handleInputChange} required /></label>

                {/* Personal Details */}
                <h3>Personal Details</h3>
                <label>Image:</label>
                {previewImage && (
                    <div className="image-preview">
                        <img src={previewImage} alt="Preview" />
                    </div>
                )}
                <input type="file" name="image" onChange={handleImageChange} accept="image/*" />
                <div className="image-buttons">
                    <button type="button" onClick={uploadFile} disabled={!imageFile}>
                        Upload
                    </button>
                    <button type="button" onClick={() => setPreviewImage("")}>Remove</button>
                </div>

                <label>Phone:<input type="text" name="phone" value={candidate.personalDetails.phone} onChange={(e) => handleNestedInputChange(e, "personalDetails")} required /></label>
                <label>Address:<input type="text" name="address" value={candidate.personalDetails.address} onChange={(e) => handleNestedInputChange(e, "personalDetails")} required /></label>
                <label>Email:<input type="email" name="email" value={candidate.personalDetails.email} onChange={(e) => handleNestedInputChange(e, "personalDetails")} required /></label>

                {/* Resume Upload */}
                <h3>Resume</h3>
                <input type="file" name="resume" onChange={handleResumeChange} accept="application/pdf" />
                <button type="button" onClick={uploadResume} disabled={!resumeFile}>
                    Upload Resume
                </button>

                {/* Skills */}
                <h3>Skills</h3>
                <input type="text" value={skillInput} onChange={handleSkillInputChange} placeholder="Type a skill" />
                {filteredSkills.length > 0 && (
                    <ul className="skills-dropdown">
                        {filteredSkills.map((skill, index) => (
                            <li key={index} onClick={() => handleSkillSelect(skill)}>{skill}</li>
                        ))}
                    </ul>
                )}
                <div className="selected-skills">
                    {candidate.skills.map((skill, index) => (
                        <span key={index} className="skill-badge">{skill}<button type="button" onClick={() => handleSkillRemove(skill)}>&times;</button></span>
                    ))}
                </div>

                {/* Certifications */}
                <h3>Certifications</h3>
                {candidate.certifications.map((cert, index) => (
                    <div key={index}>
                        <label>Title:<input type="text" name="title" value={cert.title} onChange={(e) => handleArrayChange(e, "certifications", index)} /></label>
                        <label>Issued By:<input type="text" name="issuedBy" value={cert.issuedBy} onChange={(e) => handleArrayChange(e, "certifications", index)} /></label>
                        <label>Date:<input type="date" name="date" value={cert.date} onChange={(e) => handleArrayChange(e, "certifications", index)} /></label>
                        <button type="button" onClick={() => removeArrayItem("certifications", index)}>Remove</button>
                    </div>
                ))}
                <button type="button" onClick={() => addArrayItem("certifications")}>Add Certification</button>

                {/* Add other sections (projects, achievements, experience) similarly */}

                <button type="submit">Add Candidate</button>
            </form>
        </div>
    );
};

export default AddCandidate;