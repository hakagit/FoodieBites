// Main.js
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App"; // Import your App component

function Main() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default Main;
