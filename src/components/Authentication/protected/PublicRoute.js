import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../AppContext/AppContext";

const PublicRoute = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PublicRoute;
