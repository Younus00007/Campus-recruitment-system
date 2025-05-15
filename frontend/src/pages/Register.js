import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/Register.css'; // Ensure this file contains the CSS provided earlier

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'candidate',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3030/api/users/register', formData);
            setSuccess('Registration successful! You can now log in.');
            setError('');
            setFormData({ name: '', email: '', password: '', role: 'candidate' });
            setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            setSuccess('');
        }
    };

    return (
        <div className="register-container">
            <h2 className="register-heading">Register</h2>
            {error && <div className="register-alert alert-error">{error}</div>}
            {success && <div className="register-alert alert-success">{success}</div>}
            <form onSubmit={handleRegister} className="register-form">
                <div className="register-group">
                    <label className="register-label">Name:</label>
                    <input
                        type="text"
                        name="name"
                        className="register-input"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="register-group">
                    <label className="register-label">Email:</label>
                    <input
                        type="email"
                        name="email"
                        className="register-input"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="register-group">
                    <label className="register-label">Password:</label>
                    <input
                        type="password"
                        name="password"
                        className="register-input"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="register-group">
                    <label className="register-label">Role:</label>
                    <select
                        name="role"
                        className="register-select"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="candidate">Candidate</option>
                        <option value="recruiter">Recruiter</option>
                        <option value="admin">Admin</option>
                        <option value="new_candidate">New Candidate</option>
                    </select>
                </div>
                <button type="submit" className="register-button">Register</button>
            </form>
        </div>
    );
};

export default Register;
