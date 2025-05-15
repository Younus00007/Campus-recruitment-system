import React from "react";
import { Navigate } from "react-router-dom";
import "../pages/Login"
import "../pages/CandidateLogin"

const ProtectedRoute = ({ children }) => {
    // Get the token from localStorage
    const token = localStorage.getItem("token");
    console.log('Token in ProtectedRoute:', token); // Log the token for debugging

    // If the token doesn't exist, redirect to the login page
    if (!token) {
        return <Navigate to="/login" />;
    }

    // If token exists, render the protected component
    return children;
};

export default ProtectedRoute;
