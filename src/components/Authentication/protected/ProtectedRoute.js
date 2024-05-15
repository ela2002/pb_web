import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../AppContext/AppContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/signin" />;
  }

  return children;
};

export default ProtectedRoute;
