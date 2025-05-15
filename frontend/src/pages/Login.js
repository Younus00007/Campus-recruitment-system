import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../Styles/Login.css';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3030/api/users/login", { email, password });

            if (response.status === 200) {
                const { token, user } = response.data;

                // Store the token and user details in localStorage
                console.log("Token received:", token);
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("role", user.role);

                // Navigate based on the user's role
                switch (user.role) {
                    case "recruiter":
                        navigate("/dashboard/recruiter");
                        break;
                    case "candidate":
                        // Additional logic for role change (if required)
                        alert("Welcome, Candidate! Please complete your profile.");
                        navigate("/dashboard/candidate");
                        break;
                    case "admin":
                        navigate("/dashboard/admin");
                        break;
                    case "new_candidate":
                        alert("Welcome, New Candidate! Please verify your account.");
                        navigate("/dashboard/new-candidate");
                        break;
                    default:
                        console.error("Unknown user role:", user.role);
                        alert("Invalid role. Please contact support.");
                        break;
                }
            } else {
                console.error("Unexpected response status:", response.status);
            }
        } catch (error) {
            // Handle errors gracefully
            console.log(error.message);
            console.error("Error logging in:", error.response?.data?.message || error.message);
            alert(error.response?.data?.message || "An error occurred during login. Please try again.");
        }
    };

    return (<div className="for-all">
        <div className="login-container">
            <div className="login-form">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            required
                        />
                    </div>
                    <button type="submit" className="login-btn">Login</button>
                </form>
                <div className="signup-link">
                    <p>Don't have an account? <a href="/register">Sign up</a></p>
                </div>
            </div>
        </div></div>
    );
};

export default Login;
