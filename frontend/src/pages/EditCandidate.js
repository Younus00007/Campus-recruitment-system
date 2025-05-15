import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";


const EditCandidate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState({
    fullName: "",
    regNo: "",
    dob: "",
    yearOfPassing: "",
    cgpa: "",
    personalDetails: {
      phone: "",
      address: "",
      email: "",
    },
    skills: [],
    certifications: [],
  });

  const [newCertification, setNewCertification] = useState({
    title: "",
    issuedBy: "",
    date: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCandidateDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3030/api/candidatedetails/${id}`);
        setCandidate(response.data);
      } catch (err) {
        setError("Failed to fetch candidate details.");
        console.error("Error fetching candidate details:", err);
      }
    };

    fetchCandidateDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCandidate({ ...candidate, [name]: value });
  };

  const handlePersonalDetailsChange = (e) => {
    const { name, value } = e.target;
    setCandidate({
      ...candidate,
      personalDetails: {
        ...candidate.personalDetails,
        [name]: value,
      },
    });
  };

  const handleSkillChange = (e, index) => {
    const updatedSkills = [...candidate.skills];
    updatedSkills[index] = e.target.value;
    setCandidate({ ...candidate, skills: updatedSkills });
  };

  const addSkill = () => {
    setCandidate({ ...candidate, skills: [...candidate.skills, ""] });
  };

  const removeSkill = (index) => {
    const updatedSkills = candidate.skills.filter((_, i) => i !== index);
    setCandidate({ ...candidate, skills: updatedSkills });
  };

  const handleAddCertification = () => {
    setCandidate({
      ...candidate,
      certifications: [...candidate.certifications, newCertification],
    });
    setNewCertification({ title: "", issuedBy: "", date: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3030/api/candidatedetails/${id}`, candidate);
      alert("Candidate details updated successfully!");
      navigate(`/candidate/${id}`);
    } catch (err) {
      setError("Failed to update candidate details.");
      console.error("Error updating candidate details:", err);
    }
  };

  return (
    <div className="edit-candidate">
      <h1>Edit Candidate Details</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input type="text" name="fullName" value={candidate.fullName} onChange={handleInputChange} required />

        <label>Registration Number</label>
        <input type="text" name="regNo" value={candidate.regNo} onChange={handleInputChange} required />

        <label>Date of Birth</label>
        <input type="date" name="dob" value={candidate.dob.split("T")[0]} onChange={handleInputChange} required />

        <label>Year of Passing</label>
        <input type="number" name="yearOfPassing" value={candidate.yearOfPassing} onChange={handleInputChange} required />

        <label>CGPA</label>
        <input type="number" step="0.01" name="cgpa" value={candidate.cgpa} onChange={handleInputChange} required />

        <h3>Personal Details</h3>
        <label>Phone</label>
        <input type="text" name="phone" value={candidate.personalDetails.phone} onChange={handlePersonalDetailsChange} required />

        <label>Address</label>
        <textarea name="address" value={candidate.personalDetails.address} onChange={handlePersonalDetailsChange} required />

        <label>Email</label>
        <input type="email" name="email" value={candidate.personalDetails.email} onChange={handlePersonalDetailsChange} required />

        <h3>Skills</h3>
        {candidate.skills.map((skill, index) => (
          <div key={index} className="skill-input">
            <input type="text" value={skill} onChange={(e) => handleSkillChange(e, index)} />
            <button type="button" onClick={() => removeSkill(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addSkill}>
          Add Skill
        </button>

        <h3>Certifications</h3>
        {candidate.certifications.map((cert, index) => (
          <div key={index}>
            <p>
              <strong>{cert.title}</strong> - {cert.issuedBy} ({new Date(cert.date).toLocaleDateString()})
            </p>
          </div>
        ))}
        <div className="add-certification">
          <input
            type="text"
            placeholder="Title"
            value={newCertification.title}
            onChange={(e) => setNewCertification({ ...newCertification, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Issued By"
            value={newCertification.issuedBy}
            onChange={(e) => setNewCertification({ ...newCertification, issuedBy: e.target.value })}
          />
          <input
            type="date"
            value={newCertification.date}
            onChange={(e) => setNewCertification({ ...newCertification, date: e.target.value })}
          />
          <button type="button" onClick={handleAddCertification}>
            Add Certification
          </button>
        </div>

        <button type="submit" className="submit-button">
          Save Changes
        </button>
        <button type="button" className="back-button" onClick={() => navigate(`/candidate/${id}`)}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditCandidate;
