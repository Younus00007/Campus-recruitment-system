import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";


const CandidateRec = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch candidates from the API
    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const response = await axios.get("http://localhost:3030/api/candidatedetails");
                setCandidates(response.data);
            } catch (err) {
                setError("Failed to fetch candidates. Please try again.");
                console.error("Error fetching candidates:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCandidates();
    }, []);

    // Render loading state
    if (loading) {
        return <p>Loading candidates...</p>;
    }
    // Render error state
    if (error) {
        return <p className="error">{error}</p>;
    }

    // Render candidate list
    return (
        <div className="candidate-list-Rec">
            <h1>Candidate List</h1>
          
            <div className="grid-container">
                {candidates.length > 0 ? (
                    candidates.map((candidate) => (
                        <div key={candidate._id} className="candidate-card">
                            {candidate.image && (
                                <img
                                    src={`http://localhost:3030/${candidate.image}`}
                                    alt={`${candidate.fullName}'s profile`}
                                    className="candidate-image"
                                />
                            )}
                            <h3>{candidate.fullName}</h3>
                            <p><strong>Reg No:</strong> {candidate.regNo}</p>
                            <p><strong>CGPA:</strong> {candidate.cgpa}</p>
                            <div className="button-group">
                                <Link to={`/candidatesfrorec/${candidate._id}`} className="details-button">
                                    View Details
                                </Link>
                                
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No candidates available.</p>
                )}
            </div>
        </div>
    );
};

export default CandidateRec;
