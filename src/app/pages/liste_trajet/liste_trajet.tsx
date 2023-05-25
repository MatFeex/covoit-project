import "./liste_trajet.scss";
import { Link, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { getCourses } from "../../api/RESTApi";
import { useAuth } from "../../hooks/useAuth";

function ListeTrajet() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  const [courses, setCourses] = useState<any[]>([]);
  const [displayedCourses, setDisplayedCourses] = useState<any[]>([]);

  useEffect(() => {
    getCourses().then((resp: any) => {
      console.log(resp);
      setCourses(resp);
      setDisplayedCourses(resp);
    });
  }, []);

  function recherche(text: string) {
    let toReturn: any[] = [];
    courses.map((item) => {
      if (item.start.toLowerCase().includes(text.toLowerCase()) || item.end.toLowerCase().includes(text.toLowerCase())) {
        toReturn.push(item);
      }
    });
    setDisplayedCourses(toReturn);
  }

  return (
    <div className="AjoutTrajet">
      <div className="container-fluid w-50">
        {/* <h2 className="my-4">Liste des trajets :</h2> */}

        <div className="card shadow-sm mt-3 mb-2 mx-2">
          <div className="card-body d-flex align-items-center justify-content-between">
            <div className="mx-4">
              <h3>Liste des trajets</h3>
            </div>
            <div>
              <label className="col-form-label">Affiner la recherche : </label>
              <input
                className="form-control"
                type="text"
                value=""
                onChange={(e) => recherche(e.target.value)}
              ></input>
            </div>
            <div className="mx-4">
              <label className="col-form-label">Trier par :</label>
              <select className="form-select">
                <option>Date croissante</option>
                <option>Date décroissante</option>
              </select>
            </div>
          </div>
        </div>

        <div className="container d-bloc w-75">
          {displayedCourses ? (
            <div>
              {displayedCourses.length == 0 && <h4 className="m-3">Aucune course trouvée</h4>}
              {displayedCourses.map((course) => {               
                return (
                  <div key={course.id} className="trajet p-2">
                    <div className="card mt-2 shadow-sm">
                      <div className="card-body placeholder-glow">
                        <h5 className="card-title">Trajet {course.id}</h5>

                        <div className="d-flex flex-column card-text">
                          <p>Départ : {course.start}</p>
                          <p>Destination : {course.end}</p>
                          <p>Date : {getReadableDate(course.date.split("T")[0])}</p>
                        </div>

                        <Link
                          className="btn btn-outline-primary"
                          type="button"
                          to={`/course/${course.id}`}
                        >
                          Détails
                        </Link>
                      </div>
                    </div>
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

function getReadableDate(date: string) {
  // Diviser la date en parties (jour, mois, année)
  let parties = date.split("-");
  let jour = parties[2];
  let mois = parties[1];
  let annee = parties[0];

  // Créer un objet Date avec les valeurs extraites
  let dateF = new Date(parseInt(annee), parseInt(mois) - 1, parseInt(jour)); // Le mois doit être décalé de 1 (0 pour janvier, 1 pour février, etc.)

  // Obtenir le nom du mois à partir de l'objet Date
  let options: object = { month: "long" };
  let nomMois = dateF.toLocaleDateString("fr-FR", options);

  // Construire la date finale au format "jj mois aaaa"
  return `${jour} ${nomMois} ${annee}`;
}