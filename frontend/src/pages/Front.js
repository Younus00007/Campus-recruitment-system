import React from "react";
import "../Styles/Front.css";

const Home = () => {
    return (
        <div className="home-container">
            <h1 className="home-title">Welcome to Campus Recruitment</h1>
            <p className="home-description">
                Explore job opportunities and connect with top recruiters!
            </p>
            <div className="home-buttons">
                <a className="home-btn" href="/register">Get Started</a>
                <a className="home-btn login-btn" href="/login">Login</a>
                <a className="home-btn login-btn" href="/candidate-Login">Candidate Login</a>
            </div>
        </div>
    );
};

export default Home;
