import React, { useState } from "react";
import "./ProfilePage.css";

const ProfilePage = () => {
  // Load current user from localStorage (so inputs start filled)
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  })();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [profilePic, setProfilePic] = useState(null);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    // only append fields that are non-empty to avoid accidental wipes
    if (name.trim()) formData.append("name", name.trim());
    if (email.trim()) formData.append("email", email.trim());
    if (address.trim()) formData.append("address", address.trim());
    if (profilePic) formData.append("profilePic", profilePic);

    const res = await fetch("http://localhost:5000/api/auth/profile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data)); // update stored user
      alert("Profile updated!");
      console.log(data);
      window.location.href = "/kart"; // redirect  
    } else {
      alert(data.message || "Update failed");
    } 
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePic(e.target.files[0])}
              className="form-file"
            />
          </div>

          <button type="submit" className="profile-btn">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
