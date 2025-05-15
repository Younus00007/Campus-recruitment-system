import React, { useEffect, useState } from "react";
import axios from "axios";
import '../Styles/Profile.css'

const Profile = () => {
    const [profile, setProfile] = useState({ name: "", email: "", role: "" });
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token"); // Ensure the token is stored in localStorage or another location
                if (!token) {
                    console.error("Token not found");
                    return;
                }
    
                const response = await axios.get("http://localhost:3030/api/users/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProfile(response.data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };
        fetchProfile();
    }, []);
    

    const handleUpdate = async () => {
        const token = localStorage.getItem("token"); // Fetch token from local storage
        if (!token) {
            setError("Authentication token missing. Please log in.");
            return;
        }

        try {
            await axios.put(
                "http://localhost:3030/api/users/me",
                profile,
                { headers: { Authorization: `Bearer ${token}` } } // Include the token in headers
            );
            setSuccessMessage("Profile updated successfully!");
            setError("");
        } catch (error) {
            console.error("Error updating profile:", error);
            setError(
                error.response?.data?.message || "Failed to update profile. Please try again."
            );
        }
    };

    return (
        <div className="profile-container">
            <h2>My Profile</h2>
            {error && <p className="error">{error}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Name"
                />
            </div>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="Email"
                />
            </div>
            <div>
                <label>Role:</label>
                <input
                    type="text"
                    value={profile.role}
                    readOnly // Make this field read-only as it usually shouldn't be updated
                />
            </div>
            <button onClick={handleUpdate}>Update Profile</button>
        </div>
    );
};

export default Profile;
