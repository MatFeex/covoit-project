import "./liste_trajet.scss";
import { Link, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { getCourses } from "../../api/RESTApi";
import { useAuth } from "../../hooks/useAuth";
import { getReadableDate, getReadableTime } from "../../utils/utils";
import { flecheTrajet, separateurTrajet } from "../../../assets/allAssets";

function ListeTrajet() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  const [courses, setCourses] = useState<any[]>([]);
  const [displayedCourses, setDisplayedCourses] = useState<any[]>([]);

  useEffect(() => {
    getCourses().then((resp: any) => {
      setCourses(resp);
      sortCourses(resp);
      setDisplayedCourses(resp);
    });
  }, []);

  function recherche(text: string) {
    let toReturn: any[] = [];
    courses.map((item) => {
      if (
        item.start.toLowerCase().includes(text.toLowerCase()) ||
        item.end.toLowerCase().includes(text.toLowerCase())
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
    <div className="AjoutTrajet">
      <div className="container">
        {/* <h2 className="my-4">Liste des trajets :</h2> */}

        <div className="card shadow mt-3 mb-2 mx-2">
          <div className="card-body d-flex align-items-center justify-content-between">
            <div className="mx-4">
              <h3>Liste des trajets</h3>
            </div>
            <div>
              <label className="col-form-label">Affiner la recherche : </label>
              <input
                className="form-control"
                type="text"
                // value=""
                onChange={(e) => recherche(e.target.value)}
              ></input>
            </div>
            <div className="mx-4">
              <label className="col-form-label">Trier par :</label>
              <select
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

        <div className="container-sm d-bloc col-md-8 col-lg-6 col-sm-10">
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
                  <div key={course.id} className="trajet p-2">
                    <Link
                      to={`/course/${course.id}`}
                      className="text-decoration-none link-dark"
                    >
                      <div className="card mt-2 shadow card-course">
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
  );
}
export default ListeTrajet;
