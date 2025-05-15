import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../Styles/CandidateLogin.css'; // Import the CSS file

const CandidateLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
    
        try {
            // ✅ Make sure `response` is defined inside the try block
            const response = await axios.post('http://localhost:3030/api/candidatelogin/login', { email, password });
    
            setSuccess('Login successful! Redirecting...');
            
            // ✅ Ensure `response.data` exists before using it
            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('role', response.data.role || "candidate"); // Store role safely
    
                // Redirect logic
                setTimeout(() => {
                    navigate("/dashboard/candidate");
                }, 2000);
            } else {
                setError("Invalid response from server.");
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong!');
        }
    };
    

    return (
        <div className="login-container">
            <div className='login-form'>
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Candidate Login</h2>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}

                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="input-field"
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="input-field"
                    />
                </div>

                <button type="submit" className="login-btn">
                    Login
                </button>

                <div className="signup-link">
                    Don't have an account? <a href="/signup">Sign Up</a>
                </div>
            </form>
        </div>
        </div>
    );
};

export default CandidateLogin;
