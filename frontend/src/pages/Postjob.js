import React, { useState } from "react";
import axios from "axios";
import "../Styles/Postjob.css";

const PostJob = () => {
    const [jobDetails, setJobDetails] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setJobDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Authentication token missing. Please log in.");
                return;
            }

            await axios.post(
                "http://localhost:3030/api/jobs/post-job",
                jobDetails,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSuccess("Job posted successfully!");
            setJobDetails({
                title: "",
                description: "",
                requirements: "",
                salary: "",
                location: "",
            });
        } catch (error) {
            console.error("Error posting job:", error.message);
            setError(error.response?.data?.message || "Failed to post job.");
        }
    };

    return (
        <div className="post-job-container">
            <h2>Post a Job</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <form onSubmit={handleSubmit} className="post-job-form">
                <input
                    type="text"
                    name="title"
                    value={jobDetails.title}
                    onChange={handleInputChange}
                    placeholder="Job Title"
                    required
                />
                <textarea
                    name="description"
                    value={jobDetails.description}
                    onChange={handleInputChange}
                    placeholder="Job Description"
                    required
                ></textarea>
                <input
                    type="text"
                    name="requirements"
                    value={jobDetails.requirements}
                    onChange={handleInputChange}
                    placeholder="Job Requirements"
                    required
                />
                <input
                    type="number"
                    name="salary"
                    value={jobDetails.salary}
                    onChange={handleInputChange}
                    placeholder="Salary"
                    required
                />
                <input
                    type="text"
                    name="location"
                    value={jobDetails.location}
                    onChange={handleInputChange}
                    placeholder="Location"
                    required
                />
                <button type="submit" className="post-job-button">Post Job</button>
            </form>
        </div>
    );
};

export default PostJob;
