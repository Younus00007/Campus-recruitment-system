import React, { useEffect, useState } from "react";
import axios from "axios";
import '../Styles/CandidateDashboard.css';

const CandidateDashboard = () => {
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState("");

    const fetchApplications = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("No token found. Please log in.");
            console.log("Token not found in localStorage");
            return;
        }

        try {
            console.log("Fetching applications...");
            const response = await axios.get("http://localhost:3030/api/applications", {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Applications fetched:", response.data);
            setApplications(response.data);
        } catch (err) {
            console.error("Error fetching applications:", err);
            if (err.response) {
                console.error("Error response data:", err.response.data);
                console.error("Error response status:", err.response.status);
                setError(err.response?.data?.message || "Failed to fetch applications");
            } else {
                setError("An unknown error occurred. Please try again.");
            }
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    return (
        <div>
            <h1>Candidate Dashboard</h1>
            {error && <p className="error">{error}</p>}
            {applications.length > 0 ? (
                <ul className="applications-list">
    {applications.map((app) => (
        <li className="application-box" key={app._id}>
            <h3>{app.job.title}</h3>
            <p className={`status ${app.status.toLowerCase()}`}>{app.status}</p>
        </li>
    ))}
</ul>


           
            ) : (
                <p>No applications found.</p>
            )}
        </div>
    );
};

export default CandidateDashboard;
