import "./signin.scss";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { signinEPF } from "../../api/RESTApi";
import React from 'react';
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Signin() {
  // { "first_name": "John", "last_name": "Doe", "email": "john.doe@email.fr", "password": "admin123" }

  const [fname, setFName] = useState<string>("");
  const [lname, setLName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password1, setPassword1] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [redirect, setRedirect] = useState(false);
  
  const { login } = useAuth();

  return (
    <div className="Accueil">
      <div className="container col-xs-10 col-sm-9 col-md-8 col-lg-7 col-xl-6">
        <h2 className="my-4">Inscription à EPF Co'Drive</h2>
        <form
          className="card shadow"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();

            if(password1 == password2) {
              signinEPF(lname, fname, email, password1).then((resp) => {
                console.log(resp);
                // login(resp);
                // setRedirect(true);
              })
            }

          }}
        >
        {redirect && <Navigate to="/" />}
          <div className="card-body">
            <div className="form-label-group mb-3">
              <label htmlFor="login">Nom :</label>
              <input
                id="login"
                className="form-control"
                type="text"
                required
                onChange={(e) => setLName(e.target.value)}
              />
            </div>
            <div className="form-label-group mb-3">
              <label htmlFor="login">Prénom :</label>
              <input id="login" className="form-control" type="text" required 
                onChange={(e) => setFName(e.target.value)}/>
            </div>
            <div className="form-label-group mb-3">
              <label htmlFor="login">Addresse email :</label>
              <input id="login" className="form-control" type="text" required 
                onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className="form-group mb-3">
              <label htmlFor="password">Mot de passe :</label>
              <input
                id="password"
                className="form-control"
                required
                type="password"
                onChange={(e) => setPassword1(e.target.value)}
              />
              <label htmlFor="password">Vérifier votre mot de passe :</label>
              <input
                id="password"
                className="form-control"
                required
                type="password"
                onChange={(e) => setPassword2(e.target.value)}
              />
            </div>
            {password1 != password2 ? (<p className="alert alert-danger">Les mots de passe renseignés sont différents</p>) : (<></>)}
            <div>
              <input
                className="btn btn-outline-primary"
                type="submit"
                value="S'inscrire"
              />
            </div>
            <div className="text-end mt-2">
              <Link to="/login">
                Déjà un compte EPF Co-Drive ? Connectez-vous 
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signin;
