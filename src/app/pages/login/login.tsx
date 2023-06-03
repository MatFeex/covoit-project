import "./login.scss";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import * as BEApi from "../../api/RESTApi";
import { useAuth } from "../../hooks/useAuth";
import React from "react";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  const [badLogin, setBadLogin] = useState<boolean>(false);
  const [redirect, setRedirect] = useState(false);

  const { login } = useAuth();

  return (
    <div className="Accueil">
      <div className="container col-xs-10 col-sm-9 col-md-8 col-lg-7 col-xl-6">
        <h2 className="my-4">Connexion à EPF Co'Drive</h2>
        <form
          className="card shadow"
          noValidate
          onSubmit={(e) => {
            e.preventDefault(); // evite d'ajouter un "?" dans l'url
            BEApi.getToken(email, password)
              .then((resp) => {
                console.log(resp);
                login(resp);
                setRedirect(true);
              })
              .catch((err) => {
                console.log(err);
                setBadLogin(true);
              });
          }}
        >
          {redirect && <Navigate to="/" />}
          <div className="card-body">
          {badLogin && <p className="alert alert-danger">Email ou mot de passe incorrect</p>}
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
            <div className="text-end mt-2">
              <Link to="/signin">
                Pas de compte ? Inscrivez-vous à EPF Co-Drive
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
