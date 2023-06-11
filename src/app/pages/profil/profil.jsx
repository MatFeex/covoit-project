import React, { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { checkValidity, getNotesWithUser, getUser } from "../../api/RESTApi";
import { useAuth } from "../../hooks/useAuth";
import { getReadableDate } from "../../utils/utils";
import "./profil.scss";

export default function Profil() {
  const { id } = useParams();
  const { user } = useAuth();
  const location = useLocation();

  if (!user || !checkValidity(user)) {
    return <Navigate to="/login" />;
  }

  const [notesGot, setNotesGot] = useState();
  // const [notesGiven, setNotesGiven] = useState<any[]>([]);
  const [duser, setDUser] = useState("");
  const [profilError, setProfilError] = useState(false);

  useEffect(() => {
    // console.log(id);

    if (id) {
      getNotesWithUser(user.token, id).then((resp) => {
        setNotesGot(resp);
      });
      getUser(id, user.token).then((resp) => {
        if (resp) {
          setDUser(resp.user);
          // console.log(resp.user);
        } else {
          setProfilError(true);
        }
      });
    }
  }, [location]);

  return (
    <div className="Accueil">
      <div className="container col-xs-10 col-sm-9 col-md-8 col-lg-7 col-xl-6">
        {profilError ? (
          <div>
            <h2 className="my-4">Erreur :</h2>
            <div className="alert alert-danger mt-4" role="alert">
              Le profil demandé est introuvable
            </div>
          </div>
        ) : (
          <div>
            <h2 className="my-4">
              Profil de {duser.first_name} {duser.last_name}
            </h2>
            <div className="d-bloc">
              <div>
                {notesGot ? (
                  <div className="accordion mt-4" id="accordionAvis">
                    <div className="accordion-item">
                      <h2 className="accordion-header">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseAvis"
                          aria-expanded="true"
                          aria-controls="collapseAvis"
                        >
                          {(
                            notesGot.reduce((moy, note) => {
                              console.log(note.note);
                              return moy + note.note;
                            }, 0) / notesGot.length
                          ).toFixed(1)}{" "}
                          / 10 - {notesGot.length} avis
                        </button>
                      </h2>
                      <div
                        id="collapseAvis"
                        className="accordion-collapse collapse in"
                        data-bs-parent="#accordionAvis"
                      >
                        <div className="d-bloc">
                          {notesGot &&
                            notesGot.map((note) => {
                              return (
                                <div className="m-3 p-2 rounded bg-light">
                                  <div className="fw-semibold">
                                    <Link to={`/profil/${note.rater.id}`}>
                                      {note.rater.first_name}{" "}
                                      {note.rater.last_name}
                                    </Link>{" "}
                                    - {note.note}/10
                                  </div>
                                  <div className="">
                                    {note.comment ? (
                                      note.comment
                                    ) : (
                                      <i>Pas d'avis laissé</i>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="accordion mt-4 bg-white">
                    <div className="accordion-item">
                      <h2 className="accordion-header">
                        <div className="accordion-button collapsed">
                          Aucun avis
                        </div>
                      </h2>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-3">
                A rejoint l'application le {getReadableDate(duser.date_joined)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
