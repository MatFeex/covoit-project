import {Navigate} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth";
import React from "react";
import * as BEApi from "../../api/RESTApi";

function Logout() {
  const { user, token, logout } = useAuth();

  user
    ? BEApi.APIlogout(token.token)
        .then((resp) => {
          console.log(resp);
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
