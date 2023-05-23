import "./login.scss";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import * as BEApi from "../../utils/RESTApi";
import { useAuth } from "../../hooks/useAuth";
import React from "react";

function Login() {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  const [redirect, setRedirect] = useState(false);

  const { login } = useAuth();

  return (
    <div className="Accueil">
      <div className="container w-25">
        <h2 className="my-4">Connexion à EPF Co'Drive</h2>
        <form
          className="card shadow"
          noValidate
          onSubmit={(e) => {
            e.preventDefault(); // evite d'ajouter un "?" dans l'url
            BEApi.getToken(email, password)
              .then((resp) => {
                login(resp);
                setRedirect(true);
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        >
          {redirect ? <Navigate to="/" /> : <></>}
          <div className="card-body">
            <div className="form-label-group mb-3">
              <label htmlFor="login">Adresse email :</label>
              <input
                id="login"
                className="form-control"
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="password">Mot de passe :</label>
              <input
                id="password"
                className="form-control"
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
              />
            </div>
            <div className="text-right">
              <input
                className="btn btn-outline-primary"
                type="submit"
                value="Se connecter"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
