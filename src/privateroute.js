import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useAuth } from "../src/AppContext/AppContext";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { user } = useAuth();

  return (
    <Route
      {...rest}
      element={user ? <Component /> : <Navigate to="/signin" replace />}
    />
  );
};

export default PrivateRoute;
