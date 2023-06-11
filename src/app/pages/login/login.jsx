import "./login.scss";
import {useState} from "react";
import {Link, Navigate} from "react-router-dom";
import * as BEApi from "../../api/RESTApi";
import {useAuth} from "../../hooks/useAuth";


function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorInfo, setErrorInfo] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const correctInputs = () => {
    return email.trim() !== "" && password.trim() !== "";
  };

  return (
    <div className="Accueil">
      <div className="container col-xs-10 col-sm-9 col-md-8 col-lg-7 col-xl-6">
        <h2 className="my-4">Connexion à EPF Co'Drive</h2>
        <form
          className="card shadow"
          noValidate
          onSubmit={(e) => {
            e.preventDefault(); // evite d'ajouter un "?" dans l'url

            setLoading(true);

            if(!correctInputs()) {
              setErrorInfo("Veuillez compléter les champs \"Adresse email\" et \"Mot de passe\".");
              setLoading(false);
              return;
            }

            BEApi.getToken(email, password)
              .then((resp) => {

                if(!resp) {
                  console.log(resp);
                  setErrorInfo("Adresse email ou mot de passe incorrect");
                  setLoading(false);
                  return
                }

                console.log(resp);
                login(resp);
                setLoading(false);
                setRedirect(true);
              })
          }}
        >
          {redirect && <Navigate to="/" />}
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
            {errorInfo && <p className="alert alert-danger">{errorInfo}</p>}
            <div className="d-flex align-items-center">
              <input
                className="btn btn-outline-primary"
                type="submit"
                value="Se connecter"
              />
              {loading && (
                <div
                  className="spinner-border text-primary ms-4"
                  role="status"
                ></div>
              )}
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
