// PrivateRoute.js
import React from "react";
import { Route, Navigate } from "react-router-dom";

const PrivateRoute = ({ component: Component, requiredRole, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem("token"); // Check if the user is logged in
  const userRole = localStorage.getItem("userRole"); // Get the user's role from localStorage

  return (
    <Route
      {...rest}
      element={
        isAuthenticated && (!requiredRole || userRole === requiredRole) ? (
          <Component {...rest} />
        ) : (
          <Navigate to="/" replace /> // Redirect to home if not authenticated or if role doesn't match
        )
      }
    />
  );
};

export default PrivateRoute;
