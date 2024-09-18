import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import "../Pages/Admin";

const Login = ({ onSwitchToRegister, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });

      // Extract token, user ID, and role from the response data
      console.log("Response from API", response.data);

      const { token, userId, userRole } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userRole", userRole); // Store user role

      // Redirect based on user role
      if (userRole === "admin") {
        navigate("/admin"); // Redirect to admin page
      } else {
        navigate("/Menu"); // Redirect to menu for non-admin users
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Login</h2>
          {error && <p className="error-message">{error}</p>}
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
          <input type="submit" className="button" value="Login" />
          <div className="signup">
            <span>
              Don't have an account?{" "}
              <span
                onClick={onSwitchToRegister} // Switch to Register
                style={{ cursor: "pointer", color: "#50c878" }} // Changed color for better visibility
              >
                Register here
              </span>
            </span>
          </div>
        </form>
        <div className="centered-button-container">
          <button onClick={onClose} className="hide-button">
            Hide
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
