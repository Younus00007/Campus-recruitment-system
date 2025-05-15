import React from "react";
import { Link, useNavigate } from "react-router-dom";
import '../Styles/Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/home"); // Navigate to the login page
    };

    return (
        <div className="navbar">
            <ul>
                <li><Link to="/home">Home</Link></li>
                {token && userRole === "candidate" && (
                    <>
                        <li>
                            <Link to="/dashboard/candidate">Dashboard</Link>
                        </li>
                      
                        <li>
                            <Link to="/jobs">Jobs</Link>
                        </li>
                       
                        <li>
                            <Link to="/candidate-Profile">Candidate Profile Update</Link>
                            
                        </li>
                    </>
                )}
                {token && userRole === "recruiter" && (
                    <>
                        <li>
                            <Link to="/dashboard/recruiter">Dashboard</Link>
                        </li>
                        <li>
                            <Link to="/profile">Profile</Link>
                        </li>
                        <li>
                            <Link to="/postjobs">Post Jobs</Link>
                        </li>
                        <li>
                            <Link to="/candidate-List-Rec">Candidate List</Link>
                            
                        </li>
                      
                    </>
                )}
                {token && userRole === "admin" && (
                    <>
                        <li>
                            <Link to="/dashboard/admin">Dashboard</Link>
                        </li>
                        <li>
                            <Link to="/profile">Profile</Link>
                        </li>
                       
                        <li>
                            <Link to="/candidate-List">Candidate List</Link>
                        </li>
                        <li>
                            <Link to="/add-candidate">Add Candidate List</Link>
                        </li>
                    </>
                )}
                {!token && (
                    <>
                  
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                          <li>
                        <Link to ='/candidate-Login'>Candidate Login</Link>
                    </li>
                        <li>
                            <Link to="/register">Register</Link>
                        </li>
                    </>
                )}
            </ul>
            {token && (
                <button className="logout1-btn" onClick={handleLogout}>
                    Logout
                </button>
            )}
        </div>
    );
};
export default Navbar;
