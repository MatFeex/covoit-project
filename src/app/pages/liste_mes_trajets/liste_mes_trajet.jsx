import "./liste_trajet.scss";
import { Link, Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getUserCourses, noteSomeone } from "../../api/RESTApi";
import PaginationList from "../../component/PaginationList";
import { getReadableDate, getReadableTime } from "../../utils/utils";
import { flecheTrajet } from "../../../assets/allAssets";
import { canAcces } from "../../context/AuthContext";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "@mui/material";
import useInfo from "../../hooks/useInfo";

function ListMesTrajets() {
  if (!canAcces()) return <Navigate to={"/login"} />;

  const { token } = useAuth();

  const { setOpenError, setTextError, setOpenSuccess, setTextSuccess } =
    useInfo();

  const [coursesAsDriver, setCoursesAsDriver] = useState([]);
  const [coursesAsPassenger, setCoursesAsPassenger] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUserCourses("driver", token.token).then((resp) => {
      setCoursesAsDriver(resp);
    });
    getUserCourses("passenger", token.token).then((resp) => {
      setCoursesAsPassenger(resp);
    });
  }, []);

  const saveNoteToDriver = (courseId, userId) => {
    const note = parseInt(document.getElementById("note-avis").value);
    const comm = document.getElementById("comm-avis").value;

    if (isNaN(note)) {
      setTextError("La note entrée est invalide");
      setOpenError(true);
      setLoading(false);
      return;
    }

    if (note > 5 || note < 0) {
      setTextError("La note entrée n'est pas entre 0 et 5");
      setOpenError(true);
      setLoading(false);
      return;
    }

    noteSomeone(note, comm, token.token, courseId, userId).then((resp) => {
      console.log(resp);
	  setTextSuccess("Avis ajouté !");
	  setOpenSuccess(true);
    });
    setLoading(false);
  };

  return (
    <div>
      <div className="container col-xs-10 col-sm-9 col-md-8 col-lg-7 col-xl-6">
        <div className="d-flex align-items-center">
          <h2 className="my-4">Liste de mes courses</h2>
          {loading && (
            <div
              className="spinner-border text-primary ms-4"
              role="status"
            ></div>
          )}
        </div>
        <div className="container d-flex">
          <div className="d-flex flex-row">
            <div className="container listcourses m-2 flex-grow mb-5">
              {coursesAsDriver.length !== 0 ? (
                <div>
                  <p className="fw-semibold">Je suis conducteur</p>
                  <PaginationList
                    items={coursesAsDriver}
                    exp={(course) => (
                      <div key={course.id} className="trajet mb-3">
                        <div className="card shadow card-course">
                          <Link
                            to={`/course/${course.id}`}
                            className="text-decoration-none link-dark"
                          >
                            <div className="card-body placeholder-glow">
                              <h5 className="card-title fw-semibold">
                                Trajet du {getReadableDate(course.date)}
                              </h5>
                              <div className="d-flex">
                                <div className="d-bloc justify-content-start align-items-center mb-2">
                                  <div>
                                    {course.start},{" "}
                                    {getReadableTime(course.date)}
                                  </div>
                                  <div className="m-2 d-flex align-items-end">
                                    <div className="me-2">{flecheTrajet()}</div>
                                    <div>{course.end}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    )}
                  />
                </div>
              ) : (
                <p>Aucun trajet en tant que conducteur.</p>
              )}
            </div>
            <div className="container listcourses m-2 flex-grow mb-5">
              {coursesAsPassenger.length !== 0 ? (
                <div>
                  <p className="fw-semibold">Je suis passager</p>
                  <PaginationList
                    items={coursesAsPassenger}
                    exp={(course) => (
                      <div key={course.id} className="trajet mb-3">
                        <div className="card shadow card-course">
                          <Link
                            to={`/course/${course.id}`}
                            className="text-decoration-none link-dark"
                          >
                            <div className="card-body placeholder-glow">
                              <h5 className="card-title fw-semibold">
                                Trajet du {getReadableDate(course.date)}
                              </h5>
                              <div className="d-flex">
                                <div className="d-bloc justify-content-start align-items-center mb-2">
                                  <div>
                                    {course.start},{" "}
                                    {getReadableTime(course.date)}
                                  </div>
                                  <div className="m-2 d-flex align-items-end">
                                    <div className="me-2">{flecheTrajet()}</div>
                                    <div>{course.end}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                          <button
                            type="button"
                            className="btn btn-outline-primary mx-3 mb-3"
                            data-bs-toggle="modal"
                            data-bs-target="#modal-note-cond"
                          >
                            Noter le conducteur
                          </button>

                          <div
                            className="modal fade"
                            id="modal-note-cond"
                            tabIndex="-1"
                            aria-labelledby="modalMDP"
                            aria-hidden="true"
                          >
                            <div className="modal-dialog">
                              <div className="modal-content">
                                <div className="modal-body">
                                  <h4>Noter le conducteur de la course :</h4>
                                  <div className="form-group mb-3">
                                    <label htmlFor="password">Note :</label>
                                    <input
                                      id="note-avis"
                                      class="form-control"
                                      type="text"
                                      required
                                    />
                                    <small class="form-text text-muted">
                                      Veuillez entrer une note entre 0 et 10
                                    </small>

                                    <StyledRating
                                      name="highlight-selected-only"
                                      defaultValue={2}
                                      IconContainerComponent={IconContainer}
                                      getLabelText={(value) =>
                                        customIcons[value].label
                                      }
                                      highlightSelectedOnly
                                    />
                                  </div>
                                  <div className="form-group mb-3">
                                    <label htmlFor="password">
                                      Commentaire :
                                    </label>
                                    <textarea
                                      id="comm-avis"
                                      class="form-control"
                                      type="text"
                                      required
                                    />
                                    <small class="form-text text-muted">
                                      Veuillez écrire votre commentaire
                                    </small>
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
                                    onClick={() => {
                                      setLoading(true);
                                      saveNoteToDriver(course.id, course.user);
                                    }}
                                  >
                                    Enregistrer les modifications
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  />
                </div>
              ) : (
                <p>Aucun trajet en tant que passager.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ListMesTrajets;
