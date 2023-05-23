import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import React from "react";
import * as BEApi from "../../utils/RESTApi";

function Logout() {
  const { user, logout } = useAuth();

  user
    ? BEApi.APIlogout(user.token)
        .then((resp) => {
          logout();
        })
        .catch((error) => {
          console.log(error);
          logout();
        })
    : null;
    return <Navigate to="/" />;
}

export default Logout;
