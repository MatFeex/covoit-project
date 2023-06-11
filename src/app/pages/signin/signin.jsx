import "./signin.scss";
import React, {useState} from "react";
import {Link, Navigate} from "react-router-dom";
import {signinEPF} from "../../api/RESTApi";
import {useAuth} from "../../hooks/useAuth";
import useInfo from "../../hooks/useInfo";

function Signin() {
	// { "first_name": "John", "last_name": "Doe", "email": "john.doe@email.fr", "password": "admin123" }

	const { setOpenError, setTextError } = useInfo();
	const [fname, setFName] = useState("");
	const [lname, setLName] = useState("");
	const [email, setEmail] = useState("");
	const [password1, setPassword1] = useState("");
	const [password2, setPassword2] = useState("");

	const [redirect, setRedirect] = useState(false);
	const [errorInfo, setErrorInfo] = useState(null);
	const [loading, setLoading] = useState(false);

	const { login } = useAuth();

	const correctInputs = () => {
		return fname.trim() !== "" && lname.trim() !== "" && email.trim() !== "" && password1.trim() !== "";
	};

	return (
		<div className="Accueil">
			<div className="container col-xs-10 col-sm-9 col-md-8 col-lg-7 col-xl-6">
				<h2 className="my-4">Inscription à EPF Co'Drive</h2>
				<form
					className="card shadow"
					noValidate
					onSubmit={(e) => {
						e.preventDefault();
						setLoading(true);

						if (!correctInputs()) {
							setErrorInfo("Les champs ne doivent pas être nuls !");
							setLoading(false);
							return;
						}

						if (password1 !== password2) {
							setErrorInfo("Les mots de passe entrés sont différents");
							setLoading(false);
							return;
						}

						if (password1 === password2) {
							signinEPF(lname, fname, email, password1)
								.then((resp) => {
									console.log(resp);
									login(resp);
									setLoading(false);
									setRedirect(true);
								})
								.catch(() => {
									setTextError('This email alredy exists, please login.');
									setOpenError(true);
									setLoading(false);
								});
						}
					}}
				>
					{redirect && <Navigate to="/" />}
					<div className="card-body">
						<div className="form-label-group mb-3">
							<label htmlFor="login">Nom :</label>
							<input id="login" className="form-control" type="text" required onChange={(e) => setLName(e.target.value)} />
						</div>
						<div className="form-label-group mb-3">
							<label htmlFor="login">Prénom :</label>
							<input id="login" className="form-control" type="text" required onChange={(e) => setFName(e.target.value)} />
						</div>
						<div className="form-label-group mb-3">
							<label htmlFor="login">Addresse email :</label>
							<input id="login" className="form-control" type="text" required onChange={(e) => setEmail(e.target.value)} />
						</div>
						<div className="form-group mb-3">
							<label htmlFor="password">Mot de passe :</label>
							<input id="password" className="form-control" type="password" required onChange={(e) => setPassword1(e.target.value)} />
							<label htmlFor="password">Vérifier votre mot de passe :</label>
							<input id="password" className="form-control" type="password" required onChange={(e) => setPassword2(e.target.value)} />
						</div>
						{errorInfo && <p className="alert alert-danger">{errorInfo}</p>}
						<div className="d-flex align-items-center">
							<input className="btn btn-outline-primary" type="submit" value="S'inscrire" />
							{loading && <div className="spinner-border text-primary ms-4" role="status"></div>}
						</div>
						<div className="text-end mt-2">
							<Link to="/login">Déjà un compte EPF Co-Drive ? Connectez-vous</Link>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Signin;
