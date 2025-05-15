import React from "react";
import "../Styles/Home.css";

const Home = () => {
    return (
        <div className="home-container">
            {/* Hero Section */}
          

            {/* Features Section */}
            <div className="features-section">
                <h2>Why Choose Us?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <h3>Connect with Recruiters</h3>
                        <p>Bridge the gap between students and top recruiters seamlessly.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Explore Opportunities</h3>
                        <p>Find job openings tailored to your skills and interests.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Effortless Applications</h3>
                        <p>Apply for jobs with a simple, user-friendly process.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Explore Opportunities</h3>
                        <p>Find job openings tailored to your skills and interests.</p>
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="testimonials-section">
                <h2>What Our Users Say</h2>
                <div className="testimonials-grid">
                    <div className="testimonial-card">
                        <p>
                            "Campus Recruitment System made it so easy for me to connect with
                            recruiters. Highly recommended!"
                        </p>
                        <h4>- Student A</h4>
                    </div>
                    <div className="testimonial-card">
                        <p>
                            "The platform's simplicity and efficiency have been a game-changer
                            for our hiring process."
                        </p>
                        <h4>- Recruiter B</h4>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="home-footer">
                <p>&copy; 2024 Campus Recruitment System. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
