import React, { useState } from "react";
import "./Home.css";
import Register from "../Components/Register";
import Login from "../Components/Login";
import { useNavigate } from "react-router-dom";

export const Home = ({ onLogin }) => {
  const [isLoginVisible, setIsLoginVisible] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const navigate = useNavigate();

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
    setIsLoginVisible(true);
  };

  const switchToRegister = () => {
    setIsLoginVisible(false);
  };

  const switchToLogin = () => {
    setIsLoginVisible(true);
  };

  const closeForm = () => {
    setIsFormVisible(false); // Hide the form
    setIsLoginVisible(true); // Ensure login view is reset
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the token
    localStorage.removeItem("userId"); // Clear userId
    onLogin(false); // Update parent state to reflect logged out
    navigate("/"); // Redirect to home
  };

  return (
    <div className={isFormVisible ? "blur" : ""}>
      <section className="home" id="home">
        <div className="home-content">
          <h1>
            Welcome To <span>Foodies&Bites</span>
          </h1>
          <h3 className="text-animation">
            Specialties <span></span>
          </h3>
          <p>
            Join us at Foodies and Bites, where every bite tells a story and
            every meal is a celebration of flavors. We can't wait to serve you!
          </p>
          <div className="social-icons">
            <a href="#">
              <i className="bx bxl-instagram-alt"></i>
            </a>
            <a href="#">
              <i className="bx bxl-facebook-square"></i>
            </a>
            <a href="#">
              <i className="bx bxl-twitter"></i>
            </a>
          </div>
        </div>
        <div>
          <button onClick={toggleFormVisibility} className="btn">
            {isFormVisible ? "Hide" : "Join"}
          </button>
          {isFormVisible && (
            <>
              {isLoginVisible ? (
                <Login
                  onSwitchToRegister={switchToRegister}
                  onClose={closeForm} // Pass closeForm to Login
                  onLoginSuccess={handleLogout} // Pass handleLogout as the login success handler
                />
              ) : (
                <Register onClose={closeForm} />
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};
