import React, { useState, useEffect } from "react";
import { Navigate } from "react-router";
import { Link } from "react-router-dom";
import {
  checkValidity,
  getConnectedUser,
  getNotesWithUser,
  getUser,
  updateUserInfo,
  updateUserPassword,
} from "../../api/RESTApi";
import { useAuth } from "../../hooks/useAuth";
import useInfo from "../../hooks/useInfo";
import "./modif_profil.scss";

export default function ModifProfil() {
  const { user } = useAuth();

  const {
    setOpenBackdrop,
    setOpenError,
    setTextError,
    setOpenSuccess,
    setTextSuccess,
  } = useInfo();

  const [conUser, setConUser] = useState();

  const [loading, setLoading] = useState(false);

  const [newFName, setNewFName] = useState("");
  const [newLName, setNewLName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const [passwordValidation, setPasswordValidation] = useState("");

  if (!user || !checkValidity(user)) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    getConnectedUser(user.token).then((resp) => {
      console.log(resp);
      setConUser(resp);
    });
  }, []);

  const saveInfoChanges = () => {
    if (passwordValidation === "") {
      setTextError("Le mot de passe entré est nul");
      setOpenError(true);
      setLoading(false);
      return;
    }
    if(newFName.trim() === "" && newLName.trim() === "" && newEmail.trim() === "") {
      setTextError("Veuillez remplir au moins un des champs");
      setOpenError(true);
      setLoading(false);
      return;
    }
    updateUserInfo(
      newFName ? newFName : conUser.first_name,
      newLName ? newLName : conUser.last_name,
      newEmail ? newEmail : conUser.email,
      passwordValidation,
      user.token
    ).then((resp) => {
      setLoading(false);
      setTextSuccess("Changements effectués !");
      setOpenSuccess(true);
      getConnectedUser(user.token).then((resp) => {
        console.log(resp);
        setConUser(resp);
      });
    });
  };

  const savePasswordChange = () => {
    if (newPassword1 != newPassword2) {
      setTextError("Les mots de passe entrés sont différents");
      setOpenError(true);
      setLoading(false);
      return;
    }

    if (oldPassword != "" && newPassword1 != "" && newPassword2 != "") {
      console.log(oldPassword);
      console.log(newPassword1);

      updateUserPassword(conUser.email, oldPassword, newPassword1, user.token)
        .then((resp) => {
          if (resp) {
            setTextSuccess("Mot de passe modifié avec succès !");
            setOpenSuccess(true);
          } else {
            setTextError("Mot de passe incorrect");
            setOpenError(true);
          }
          setLoading(false);
          console.log(resp);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    } else {
      setTextError("Veuillez remplir tout les champs");
      setOpenError(true);
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="container col-xs-10 col-sm-9 col-md-8 col-lg-7 col-xl-6">
        <div className="d-flex align-items-center">
          <h2 className="my-4">Modification de votre profil</h2>
          {loading && (
            <div
              className="spinner-border text-primary ms-4"
              role="status"
            ></div>
          )}
        </div>
        <div className="card shadow">
          <div className="card-body">
            <h4 className="card-title">Informations générales</h4>
            {conUser ? (
              <div className="d-block">
                <div className="my-2">Prénom : {conUser.first_name}</div>
                <div className="my-2">Nom : {conUser.last_name}</div>
                <div className="my-2">Adresse email : {conUser.email}</div>
              </div>
            ) : (
              <div className="d-block placeholder-glow">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item placeholder col-5 my-2"></li>
                  <li className="list-group-item placeholder col-3 my-2"></li>
                  <li className="list-group-item placeholder col-4 my-2"></li>
                </ul>
              </div>
            )}

            <div>
              <div className="mt-2">
                <a
                  className="btn btn-outline-primary"
                  data-bs-toggle="collapse"
                  href="#collapseInfos"
                  role="button"
                  aria-expanded="false"
                  aria-controls="collapseInfos"
                >
                  Modifier mes informations
                </a>
              </div>
              <div className="collapse mt-3" id="collapseInfos">
                <form
                  className="card"
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    setLoading(true);

                    console.log("Submit des changements");
                  }}
                >
                  <div className="card-body">
                    <div className="form-label-group mb-3">
                      <label htmlFor="login">Prénom :</label>
                      <input
                        id="login"
                        className="form-control required"
                        type="text"
                        required
                        onChange={(e) => setNewFName(e.target.value)}
                      />
                    </div>
                    <div className="form-label-group mb-3">
                      <label htmlFor="login">Nom :</label>
                      <input
                        id="login"
                        className="form-control required"
                        type="text"
                        onChange={(e) => setNewLName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-label-group mb-3">
                      <label htmlFor="login">Addresse email :</label>
                      <input
                        id="login"
                        className="form-control required"
                        type="text"
                        required
                        onChange={(e) => setNewEmail(e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    >
                      Enregistrer les modifications
                    </button>

                    <div
                      className="modal fade"
                      id="exampleModal"
                      tabIndex="-1"
                      aria-labelledby="modalMDP"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-body">
                            <h4>
                              Pour enregistrer les modifications, veuillez
                              entrer votre mot de passe :
                            </h4>
                            <div className="form-group mb-3">
                              <label htmlFor="password">Mot de passe :</label>
                              <input
                                id="password"
                                className="form-control"
                                type="password"
                                required
                                onChange={(e) =>
                                  setPasswordValidation(e.target.value)
                                }
                              />
                            </div>
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              data-bs-dismiss="modal"
                            >
                              Annuler
                            </button>
                            <button
                              type="button"
                              className="btn btn-primary"
                              data-bs-dismiss="modal"
                              onClick={(event) => {
                                setLoading(true);
                                saveInfoChanges(event);
                                document
                                  .getElementById("collapseInfos")
                                  .classList.remove("show");
                              }}
                            >
                              Enregistrer les modifications
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="card  mt-3 shadow">
          <div className="card-body">
            <h4 className="card-title">Mot de passe</h4>
            <div className="my-2">Vous pouvez changer votre mot de passe.</div>
            <div>
              <div className="mt-2">
                <a
                  className="btn btn-outline-primary"
                  data-bs-toggle="collapse"
                  href="#collapseMDP"
                  role="button"
                  aria-expanded="false"
                  aria-controls="collapseMDP"
                >
                  Modifier mon mot de passe
                </a>
              </div>
              <div className="collapse mt-3" id="collapseMDP">
                <div className="card" noValidate>
                  <div className="card-body">
                    <div className="form-label-group mb-3">
                      <label htmlFor="login">Ancien mot de passe :</label>
                      <input
                        id="login"
                        className="form-control"
                        type="password"
                        required
                        onChange={(e) => setOldPassword(e.target.value)}
                      />
                    </div>
                    <div className="form-label-group mb-3">
                      <label htmlFor="login">Nouveau mot de passe :</label>
                      <input
                        id="login"
                        className="form-control"
                        type="password"
                        required
                        onChange={(e) => setNewPassword1(e.target.value)}
                      />
                    </div>
                    <div className="form-label-group mb-3">
                      <label htmlFor="login">
                        Confirmez le nouveau mot de passe :
                      </label>
                      <input
                        id="login"
                        className="form-control"
                        type="password"
                        required
                        onChange={(e) => setNewPassword2(e.target.value)}
                      />
                    </div>
                    <div className="d-flex align-items-center">
                      <input
                        className="btn btn-outline-primary"
                        value="Enregistrer les modifications"
                        onClick={() => {
                          setLoading(true);
                          savePasswordChange();
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
