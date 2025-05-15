import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../Styles/JobList.css';

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get("http://localhost:3030/api/jobs");
                setJobs(response.data);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };
        fetchJobs();
    }, []);

    const handleApply = (jobId) => {
        // Navigate to the ApplicationPage with the jobId as state
        navigate('/apply', { state: { jobId } });
    };

    return (
        <div className="job-list-container">
            <h2>Available Jobs</h2>
            <ul className="job-list">
                {jobs.map((job) => (
                    <li key={job._id} className="job-card">
                        <h3>{job.title}</h3>
                        <p>{job.description}</p>
                        <button onClick={() => handleApply(job._id)}>Apply</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default JobList;
