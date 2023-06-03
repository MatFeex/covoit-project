import "./liste_trajet.scss";
import { Link, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { checkValidity, getCourses } from "../../api/RESTApi";
import { useAuth } from "../../hooks/useAuth";
import { getReadableDate, getReadableTime } from "../../utils/utils";
import { flecheTrajet, separateurTrajet } from "../../../assets/allAssets";

function ListeTrajet() {
  const { user } = useAuth();

  if (!user || !checkValidity(user)) {
    return <Navigate to="/login" />;
  }

  const [courses, setCourses] = useState<any[]>([]);
  const [displayedCourses, setDisplayedCourses] = useState<any[]>([]);

  const [depart, setDepart] = useState<string>("");
  const [arrivee, setArrivee] = useState<string>("");
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    getCourses().then((resp: any) => {
      setCourses(resp);
      sortCourses(resp);
      setDisplayedCourses(resp);
    });
  }, []);

  async function recherche() {
    let toReturn: any[] = [];
    let date2 = new Date(date);
    let dateSet = [date2.getFullYear(), date2.getMonth(), date2.getDate()];

    courses.map((item) => {
      let date1 = new Date(item.date);
      if (
        item.start.toLowerCase().includes(depart.toLowerCase()) &&
        item.end.toLowerCase().includes(arrivee.toLowerCase()) &&
        date1.getFullYear() === dateSet[0] &&
        date1.getMonth() === dateSet[1] &&
        date1.getDate() === dateSet[2]
      ) {
        toReturn.push(item);
      }
    });
    sortCourses(toReturn);
    setDisplayedCourses(toReturn);
  }

  function sortCourses(courses: any[], order: string = "croissant") {
    courses.sort((a: any, b: any) => {
      let date1 = new Date(a.date);
      let date2 = new Date(b.date);

      if (date1 < date2) {
        return -1;
      } else if (date1 > date2) {
        return 1;
      } else {
        return 0;
      }
    });

    if (order === "decroissant") {
      courses.reverse();
    }

    setDisplayedCourses(courses);
  }

  return (
    <div className="Accueil bg-light">
      <div className="container col-xs-10 col-sm-9 col-md-8 col-lg-7 col-xl-6">
        <div className="container">
          <h2 className="p-3 fw-semibold pt-4">Liste des trajets</h2>
        </div>
        <div className="container d-flex">
          <div className="container m-2 w-50 d-none d-md-block">
            <div className="d-block">
              <form className="card card-body mb-4">
                <label className="col-form-label">
                  <h4>Affiner la recherche :</h4>
                </label>
                <div className="form-label-group mb-3">
                  <label htmlFor="depart">Ville de départ :</label>
                  <input
                    id="depart"
                    className="form-control"
                    type="text"
                    // value=""
                    onChange={(e) => setDepart(e.target.value)}
                    // aria-describedby="emailHelp"
                  ></input>
                </div>
                <div className="form-label-group mb-3">
                  <label htmlFor="arrivéé">Ville de départ :</label>
                  <input
                    id="arrivee"
                    className="form-control"
                    type="text"
                    onChange={(e) => setArrivee(e.target.value)}
                  ></input>
                </div>
                <div className="form-label-group mb-3">
                  <label htmlFor="arrivéé">Date :</label>
                  <input
                    id="arrivee"
                    className="form-control"
                    type="date"
                    onChange={(e) => {
                      setDate(e.target.value);
                      console.log(e.target.value);
                    }}
                  ></input>
                </div>
                <a
                  className="btn btn-outline-primary"
                  onClick={() => {
                    recherche();
                  }}
                >
                  Appliquer
                </a>
                {/* <a
                  className="btn btn-outline-primary mt-3"
                  onClick={() => {
                    recherche();
                  }}
                >
                  Annuler
                </a> */}
              </form>
              <div className="card card-body">
                <label className="col-form-label" htmlFor="sortselect">
                  <h4>Trier par :</h4>
                </label>
                <select
                  id="sortselect"
                  className="form-select"
                  onChange={(e) => {
                    console.log(`changement de valeur ${e.target.value}`);
                    sortCourses([...displayedCourses], e.target.value);
                  }}
                >
                  <option value="croissant">Date croissante</option>
                  <option value="decroissant">Date décroissante</option>
                </select>
              </div>
            </div>
          </div>

          <div className="container listcourses m-2 flex-grow mb-5">
            {courses ? (
              <div>
                {displayedCourses.length == 0 && (
                  <h4 className="m-3">Aucune course trouvée</h4>
                )}
                {displayedCourses.map((course) => {
                  {
                    let test = new Date(course.date);
                  }
                  return (
                    <div key={course.id} className="trajet mb-3">
                      <Link
                        to={`/course/${course.id}`}
                        className="text-decoration-none link-dark"
                      >
                        <div className="card shadow card-course">
                          <div className="card-body placeholder-glow">
                            <h5 className="card-title fw-semibold">
                              Trajet du {getReadableDate(course.date)}
                            </h5>
                            <div className="d-flex">
                              <div className="d-bloc justify-content-start align-items-center mb-2">
                                <div>
                                  {course.start}, {getReadableTime(course.date)}
                                </div>
                                <div className="m-2 d-flex align-items-end">
                                  <div className="me-2">{flecheTrajet()}</div>
                                  <div>{course.end}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>Chargement des trajets...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default ListeTrajet;
