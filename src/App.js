import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "./App.css";
import { Home } from "./Pages/Home";
import { Menu } from "./Pages/Menu";
import { Navbar } from "./Components/Navbar";
import Login from "./Components/Login";
import Register from "./Components/Register";
import { Order } from "./Pages/Order";
import Payment from "./Pages/Payment";
import OrderConfirmation from "./Pages/OrderConfirmation";
import Admin from "./Pages/Admin"; // Import the Admin page
import { Gallery } from "./Pages/Gallery";

const PrivateRoute = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? element : <Navigate to="/Login" />;
};

// Use AdminPrivateRoute for admin access control
const AdminPrivateRoute = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole"); // Assuming you store user role in localStorage
  return isAuthenticated && userRole === "admin" ? (
    element
  ) : (
    <Navigate to="/" />
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [logoutMessage, setLogoutMessage] = useState("");
  const navigate = useNavigate(); // Get the navigate function from useNavigate

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole"); // Clear user role on logout
    setIsAuthenticated(false);
    setLogoutMessage("Logged out successfully!");
    navigate("/"); // Navigate to the Home page immediately after logout
  };

  return (
    <>
      <Navbar onLogout={handleLogout} />
      {logoutMessage && <p>{logoutMessage}</p>}
      <Routes>
        <Route
          path="/"
          element={<Home onLogin={() => setIsAuthenticated(true)} />}
        />
        <Route path="/Menu" element={<PrivateRoute element={<Menu />} />} />
        <Route
          path="/Gallery"
          element={<PrivateRoute element={<Gallery />} />}
        />
        <Route
          path="/Payment/:order_id"
          element={<PrivateRoute element={<Payment />} />}
        />
        <Route
          path="/Login"
          element={
            isAuthenticated ? (
              <Navigate to="/" />
            ) : (
              <Login onLogin={() => setIsAuthenticated(true)} />
            )
          }
        />
        <Route path="/Register" element={<Register />} />
        <Route
          path="/order-confirmation"
          element={<PrivateRoute element={<OrderConfirmation />} />}
        />
        {/* Admin Route with role check */}
        <Route
          path="/admin"
          element={<AdminPrivateRoute element={<Admin />} />}
        />
        {/* Add other routes as needed */}
      </Routes>
    </>
  );
}

export default App;
