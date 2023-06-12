import "./liste_trajet.scss";
import { Link, Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getCourses } from "../../api/RESTApi";
import PaginationList from "../../component/PaginationList";
import { getReadableDate, getReadableTime } from "../../utils/utils";
import { flecheTrajet } from "../../../assets/allAssets";
import { canAcces } from "../../context/AuthContext";

function ListeTrajet() {
  if (!canAcces()) return <Navigate to={"/login"} />;

  const [courses, setCourses] = useState([]);
  const [displayedCourses, setDisplayedCourses] = useState([]);

  const [depart, setDepart] = useState("");
  const [arrivee, setArrivee] = useState("");
  const [date, setDate] = useState("");
  const [sort, setSort] = useState("croissant");

  useEffect(() => {
    getCourses().then((resp) => {
      setCourses(resp);
      sortCourses(resp);
      setDisplayedCourses(resp);
    });
  }, []);

  async function recherche() {
    let toReturn = [];
    let date2 = new Date(date);
    let dateSet = [date2.getFullYear(), date2.getMonth(), date2.getDate()];

    console.log(date === "");

    courses.map((item) => {
      let date1 = new Date(item.date);
      console.log(depart);
      console.log(arrivee);
      console.log(date);
      if (
        item.start.toLowerCase().includes(depart.toLowerCase()) &&
        item.end.toLowerCase().includes(arrivee.toLowerCase())
      ) {
        if (date !== "") {
          // date entrée

          if (
            date1.getFullYear() === dateSet[0] &&
            date1.getMonth() === dateSet[1] &&
            date1.getDate() === dateSet[2]
          ) {
            toReturn.push(item);
          }
        } else {
          // date non entrée
          toReturn.push(item);
        }
      }
    });
    sortCourses(toReturn);
  }

  function sortCourses(coursesToSort) {

    const order = sortselect.value;
    console.log(`sorting des courses avec ${order}`);

    coursesToSort.sort((a, b) => {
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
      coursesToSort.reverse();
    }

    setDisplayedCourses(coursesToSort);
  }

  const resetFiltre = () => {
    document.getElementById("date-course").value = "";
    document.getElementById("arrivee").value = "";
    document.getElementById("depart").value = "";

    setDate("");
    setDepart("");
    setArrivee("");

    sortCourses(courses);
  };

  return (
    <div className="container col-xs-12 col-sm-11 col-md-10 col-lg-8 col-xl-6">
      <h2 className="m-4 fw-semibold">Liste des trajets</h2>
      <div className="container d-flex">
        <div className="m-2 col-xs-4">
          <div className="d-block">
            <form className="card shadow card-body mb-4">
              <label className="col-form-label">
                <h4>Affiner la recherche :</h4>
              </label>
              <div className="form-label-group mb-3">
                <label htmlFor="depart">Départ :</label>
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
                <label htmlFor="arrivee">Arrivée :</label>
                <input
                  id="arrivee"
                  className="form-control"
                  type="text"
                  onChange={(e) => setArrivee(e.target.value)}
                ></input>
              </div>
              <div className="form-label-group mb-3">
                <label htmlFor="date-course">Date :</label>
                <input
                  id="date-course"
                  className="form-control"
                  type="date"
                  onChange={(e) => {
                    setDate(e.target.value);
                    console.log(e.target.value);
                  }}
                ></input>
              </div>
              <div className="form-label-group mb-4">
              <label className="col-form-label" htmlFor="sortselect">
                <h4>Trier par :</h4>
              </label>
              <select
                id="sortselect"
                className="form-select"
                onChange={(e) => {
                  setSort(e.target.value);
                }}
              >
                <option value="croissant">Date croissante</option>
                <option value="decroissant">Date décroissante</option>
              </select>
            </div>
            <div className="border-bottom mb-4"></div>
              <a
                className="btn btn-outline-primary"
                onClick={() => recherche()}
              >
                Appliquer
              </a>
              <a
                className="text-end mt-2 link-reset"
                onClick={() => resetFiltre()}
              >
                Annuler
              </a>
            </form>
          </div>
        </div>

        <div className="listcourses flex-fill m-2 mb-5 col-xs-8">
          {courses ? (
            <div>
              {displayedCourses.length === 0 ? (
                <h4 className="m-3">Aucune course trouvée</h4>
              ) : (
                <PaginationList
                  items={displayedCourses}
                  exp={(course) => (
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
                  )}
                />
              )}
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
