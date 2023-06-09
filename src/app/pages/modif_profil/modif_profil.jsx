import React, { useState, useEffect } from "react";
import { Navigate } from "react-router";
import { Link } from "react-router-dom";
import {
  checkValidity,
  getConnectedUser,
  getNotesWithUser,
  getUser,
} from "../../api/RESTApi";
import { useAuth } from "../../hooks/useAuth";
import "./modif_profil.scss";

export default function ModifProfil() {
  const { user } = useAuth();

  const [conUser, setConUser] = useState();

  if (!user || !checkValidity(user)) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    getConnectedUser(user.token).then((resp) => {
      console.log(resp);
      setConUser(resp);
    });
  }, []);

  const saveInfoChanges = (e) => {
    console.log(e);
  };

  return (
    <div>
      <div className="container col-xs-10 col-sm-9 col-md-8 col-lg-7 col-xl-6">
        <h2 className="my-4">Modification de votre profil</h2>
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
                      <label htmlFor="login">Nom :</label>
                      <input
                        id="login"
                        className="form-control required"
                        type="text"
                        // onChange={(e) => setLName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-label-group mb-3">
                      <label htmlFor="login">Prénom :</label>
                      <input
                        id="login"
                        className="form-control required"
                        type="text"
                        required
                        // onChange={(e) => setFName(e.target.value)}
                      />
                    </div>
                    <div className="form-label-group mb-3">
                      <label htmlFor="login">Addresse email :</label>
                      <input
                        id="login"
                        className="form-control required"
                        type="text"
                        required
                        // onChange={(e) => setEmail(e.target.value)}
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
                                // onChange={(e) => setPassword1(e.target.value)}
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
                                saveInfoChanges(event);
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
              <div className="collapse mt-2" id="collapseMDP">
                <form className=" card" noValidate>
                  <div className="card-body">
                    <div className="form-label-group mb-3">
                      <label htmlFor="login">Ancien mot de passe :</label>
                      <input
                        id="login"
                        className="form-control"
                        type="text"
                        required
                        // onChange={(e) => setLName(e.target.value)}
                      />
                    </div>
                    <div className="form-label-group mb-3">
                      <label htmlFor="login">Nouveau mot de passe :</label>
                      <input
                        id="login"
                        className="form-control"
                        type="text"
                        required
                        // onChange={(e) => setFName(e.target.value)}
                      />
                    </div>
                    <div className="form-label-group mb-3">
                      <label htmlFor="login">
                        Confirmez le nouveau mot de passe :
                      </label>
                      <input
                        id="login"
                        className="form-control"
                        type="text"
                        required
                        // onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="d-flex align-items-center">
                      <input
                        className="btn btn-outline-primary"
                        type="submit"
                        value="Enregistrer les modifications"
                      />
                      {/* {loading && (
                          <div
                            className="spinner-border text-primary ms-4"
                            role="status"
                          ></div>
                        )} */}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
