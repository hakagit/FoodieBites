import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "./App.css";
import { Home } from "./Pages/Home";
import { Menu } from "./Pages/Menu";
import { Navbar } from "./Components/Navbar";
import Login from "./Components/Login";
import Register from "./Components/Register";
import { Order } from "./Pages/Order";
import { Footer } from "./Components/Footer";
import Payment from "./Pages/Payment";
import OrderConfirmation from "./Pages/OrderConfirmation";

const PrivateRoute = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? element : <Navigate to="/Login" />;
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
    setIsAuthenticated(false);
    setLogoutMessage("Logged out successfully!");

    // Navigate to the Home page immediately after logout
    navigate("/");
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
        <Route path="/Order" element={<PrivateRoute element={<Order />} />} />
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
      </Routes>
    </>
  );
}

export default App;
