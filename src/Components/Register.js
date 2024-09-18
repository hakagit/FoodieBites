import React, { useState } from "react";
import axios from "axios";
import "./Register.css";

const Register = ({ onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!name || !email || !password || !confirmPassword || !role) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // POST request to register user
      const response = await axios.post("http://localhost:8000/api/register", {
        name,
        email,
        password,
        role,
      });

      // Store token if registration is successful
      const { token } = response.data;
      localStorage.setItem("token", token);
      setSuccess("Registration successful! You can now log in.");
      setError("");

      // Clear the form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setRole("");
    } catch (err) {
      console.error(
        "Registration error:",
        err.response ? err.response.data : err.message
      );

      // Check for specific validation error messages from the API
      if (err.response && err.response.data.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat();
        setError(errorMessages.join(", "));
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="register-container">
        <button className="close-button" onClick={onClose}>
          × {/* Close button to hide the modal */}
        </button>
        <form className="register-form" onSubmit={handleRegister}>
          <h2>Create Your Account</h2>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="styled-select"
          >
            <option value="">Select Role</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
          <input type="submit" className="button" value="Register" />
        </form>
      </div>
    </div>
  );
};

export default Register;
