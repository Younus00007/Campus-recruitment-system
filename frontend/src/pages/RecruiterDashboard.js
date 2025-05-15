import React, { useEffect, useState } from "react";
import axios from "axios";
import '../Styles/RecruiterDashboard.css';

const RecruiterDashboard = () => {
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    // Fetch applications when the component mounts
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Authentication token missing. Please log in.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get("http://localhost:3030/api/applications/recruiter", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("Applications response:", response.data);

                if (response.data) {
                    setApplications(response.data);
                } else {
                    setError("No applications found.");
                }
            } catch (error) {
                console.error("Error fetching applications:", error.message);
                setError(error.response?.data?.message || "Failed to fetch applications.");
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    // Update application status
    const updateStatus = async (applicationId, newStatus) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Authentication token missing. Please log in.");
                return;
            }

            await axios.patch(
                `http://localhost:3030/api/applications/${applicationId}/status`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Update status locally
            setApplications((prevApplications) =>
                prevApplications.map((app) =>
                    app._id === applicationId ? { ...app, status: newStatus } : app
                )
            );
        } catch (error) {
            console.error("Error updating status:", error);
            setError(error.response?.data?.message || "Failed to update status.");
        }
    };

    return (
        <div className="dashboard-container">
            <h2>Recruiter Dashboard</h2>

            {error && <p className="error">{error}</p>}
            {loading && <p>Loading applications...</p>}

            {!loading && applications.length > 0 ? (
                <ul className="application-list">
                    {applications.map((application) => (
                        <li key={application._id} className="application-card">
                            {/* Display Candidate Full Name & Registration Number */}
                            <h3>{application.role?.fullName || "No Name Available"}</h3>
                            <p><strong>Reg No:</strong> {application.role?.regNo || "N/A"}</p>

                            {/* Display Candidate Email */}
                            <p><strong>Email:</strong> {application.role?.personalDetails?.email || "No email available"}</p>

                            {/* Display Job Title */}
                            <p><strong>Job Applied:</strong> {application.job?.title || "No job title"}</p>

                            {/* Display Cover Letter & Status */}
                            <p><strong>Cover Letter:</strong> {application.coverLetter}</p>
                            <p><strong>Status:</strong> {application.status}</p>

                            {/* Resume Link */}
                            {application.resume ? (
    <div className="resume-section">
        <h4>Resume:</h4>
        <a
            href={`http://localhost:3030/${application.resume.replace(/\\/g, "/")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="resume-link"
        >
            View Resume 📄
        </a>
    </div>
) : (
    <p className="no-resume">No resume available</p>
)}


                            {/* Actions to update status */}
                            <div className="status-actions">
                                <button onClick={() => updateStatus(application._id, "accepted")} disabled={application.status === "accepted"}>
                                    Accept
                                </button>
                                <button onClick={() => updateStatus(application._id, "rejected")} disabled={application.status === "rejected"}>
                                    Reject
                                </button>
                                <button onClick={() => updateStatus(application._id, "pending")} disabled={application.status === "pending"}>
                                    Reset to Pending
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                !loading && <p>No applications found.</p>
            )}
        </div>
    );
};

export default RecruiterDashboard;
