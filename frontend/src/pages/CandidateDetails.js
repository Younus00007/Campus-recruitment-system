import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/CandidateDetails.css";

const CandidateDetails = () => {
    const { id } = useParams();
    const [candidate, setCandidate] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCandidateDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3030/api/candidatedetails/${id}`);
                setCandidate(response.data);
            } catch (err) {
                setError("Failed to fetch candidate details. Please try again.");
                console.error("Error fetching details:", err);
            }
        };

        fetchCandidateDetails();
    }, [id]);

    // Function to handle resume download
    const handleDownloadResume = (resumePath, candidateName) => {
        if (resumePath) {
            // Ensure correct URL without "Upload/"
            const correctedPath = resumePath.replace(/\\/g, "/").replace("Upload/", ""); 
            const url = `http://localhost:3030/${correctedPath}`;
            window.open(url, "_blank"); // Open in a new tab
        } else {
            alert("Resume not available for download.");
        }
    };
    

    if (error) {
        return <p className="error">{error}</p>;
    }

    if (!candidate) {
        return <p className="loading">Loading candidate details...</p>;
    }

    return (
        <div className="candidate-container">
            <h1 className="candidate-title">
                {candidate.fullName ? candidate.fullName : "Candidate Name Unavailable"}
            </h1>
            <div className="candidates-card">
                {/* Display candidate image */}
                {candidate.personalDetails.image && (
                    <div className="candidate-image-container">
                       <img
    src={`http://localhost:3030/${candidate.personalDetails.image.replace(/\\/g, "/").replace("Upload/", "")}`}
    alt={`${candidate.fullName}'s profile`}
    className="candidate-image"
/>
                    </div>
                )}

                <div className="candidate-info">
                    <p><strong>Registration Number:</strong> {candidate.regNo}</p>
                    <p><strong>Date of Birth:</strong> {new Date(candidate.dob).toLocaleDateString()}</p>
                    <p><strong>Year of Passing:</strong> {candidate.yearOfPassing}</p>
                    <p><strong>CGPA:</strong> {candidate.cgpa}</p>
                </div>

                <h2 className="section-title">Personal Details</h2>
                <div className="candidate-info">
                    <p><strong>Phone:</strong> {candidate.personalDetails.phone}</p>
                    <p><strong>Address:</strong> {candidate.personalDetails.address}</p>
                    <p><strong>Email:</strong> {candidate.personalDetails.email}</p>
                </div>

                {/* Resume Link */}
              {/* Resume Section */}
<h2 className="section-title">Resume</h2>
<div className="resume-container">
    {candidate.personalDetails.resume ? (
        <button
            className="download-resume-button"
            onClick={() => handleDownloadResume(candidate.personalDetails.resume, candidate.fullName)}
        >
            Download Resume 📄
        </button>
    ) : (
        <p className="no-resume">No resume available</p>
    )}
</div>

                <h2 className="section-title">Skills</h2>
                <ul className="candidate-list">
                    {candidate.skills.map((skill, index) => (
                        <li key={index}>{skill}</li>
                    ))}
                </ul>

                <h2 className="section-title">Certifications</h2>
                <ul className="candidate-list">
                    {candidate.certifications.map((cert, index) => (
                        <li key={index}>
                            {cert.title} - {cert.issuedBy} ({new Date(cert.date).toLocaleDateString()})
                        </li>
                    ))}
                </ul>

                <div className="button-group">
                    <button onClick={() => navigate("/candidate-list")} className="btn back-btn">
                        Back to List
                    </button>
                    <button onClick={() => navigate(`/edit/${id}`)} className="btn edit-btn">
                        Edit Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CandidateDetails;