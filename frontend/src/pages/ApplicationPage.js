import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../Styles/ApplicationPage.css'

const ApplicationPage = () => {
    const location = useLocation();
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState('');
    const [resume, setResume] = useState(null); // Update state to handle file
    const [coverLetter, setCoverLetter] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Fetch available jobs
        const fetchJobs = async () => {
            try {
                const response = await axios.get('http://localhost:3030/api/jobs');
                setJobs(response.data);

                // Preselect the job if jobId is passed in state
                if (location.state?.jobId) {
                    setSelectedJob(location.state.jobId);
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
                setMessage('Failed to fetch jobs. Please try again.');
            }
        };
        fetchJobs();
    }, [location.state]);

    const handleFileChange = (e) => {
        // Update resume state with selected file
        setResume(e.target.files[0]);
    };

    const handleApplicationSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); // Fetch the token to authenticate

        if (!selectedJob) {
            setMessage('Please select a job to apply for.');
            return;
        }

        if (!resume) {
            setMessage('Please upload your resume.');
            return;
        }

        try {
            // Prepare FormData to send the resume and other details
            const formData = new FormData();
            formData.append('jobId', selectedJob);
            formData.append('resume', resume); // Append the file
            formData.append('coverLetter', coverLetter);

            const response = await axios.post(
                'http://localhost:3030/api/applications',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );

            setMessage(response.data.message);
        } catch (error) {
            console.log(error.message);
            setMessage(error.response?.data?.message || 'Failed to submit application.');
        }
    };

    return (
        <div className="application-container">
            <h2>Apply for a Job</h2>
            {message && <div className="alert">{message}</div>}
            <form onSubmit={handleApplicationSubmit}>
                <div>
                    <label>Choose Job:</label>
                    <select
                        value={selectedJob}
                        onChange={(e) => setSelectedJob(e.target.value)}
                        required
                    >
                        <option value="">Select a job</option>
                        {jobs.map((job) => (
                            <option key={job._id} value={job._id}>
                                {job.title} - {job.location || 'Location not specified'}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Resume:</label>
                    <input
                        type="file"
                        onChange={handleFileChange} // Handle file input
                        accept=".pdf,.doc,.docx" // Accept only specific file types
                        required
                    />
                </div>
                <div>
                    <label>Cover Letter:</label>
                    <textarea
                        placeholder="Write your cover letter"
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                    ></textarea>
                </div>
                <button type="submit">Submit Application</button>
            </form>
        </div>
    );
};

export default ApplicationPage;
