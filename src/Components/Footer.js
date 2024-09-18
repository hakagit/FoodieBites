import React from "react";
import "./Footer.css";
export const Footer = () => {
  return (
    <div>
      <footer className="footer">
        <div className="social">
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
        <ul className="list">
          <li>
            <a href="#">About Us</a>
          </li>
          <li>
            <a href="#">Contact</a>
          </li>
          <li>
            <a href="#">Privacy Policy</a>
          </li>
        </ul>
        <p className="copyright">@ Foodies & Bites | All Rights Reserved</p>
      </footer>
    </div>
  );
};
