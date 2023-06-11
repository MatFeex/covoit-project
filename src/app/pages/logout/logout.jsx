import {Navigate} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth";
import React from "react";

function Logout() {
  const { user, logout } = useAuth();
  user && logout();
  return <Navigate to="/" />;
}

export default Logout;
