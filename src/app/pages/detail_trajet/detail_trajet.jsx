import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router";
import { separateurTrajet } from "../../../assets/allAssets";
import { checkValidity, getCourse, getUser } from "../../api/RESTApi";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import imageMaps from "../../../assets/maps.png";
import { getReadableDate, getReadableTime } from "../../utils/utils";

export default function Detail_Trajet() {
  const [trajet, setTrajet] = useState("");
  const [pilot, setPilot] = useState("");
  const { id } = useParams();
  const { user } = useAuth();

  if (!user || !checkValidity(user)) {
    return <Navigate to="/login" />;
  }

  if (!id) {
    return <Navigate to="/error" />;
  }

  useEffect(() => {
    getCourse(id, user.token)
      .then((resp) => {
        setTrajet(resp);
        getUser(resp.user, user.token)
          .then((resp) => {
            setPilot(resp.user);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="AjoutTrajet">
      {pilot ? ( // pas placeholder
        <div className="container w-50">
          <h2 className="mt-4">
            Trajet du {getReadableDate(trajet.date.split("T")[0])}
          </h2>
          <div className="card shadow">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <div className="d-flex justify-content-center align-items-center">
                  <div className="m-2 d-block">
                    <div className="fw-semibold">Départ</div>
                    <div className="fw-semibold mt-3">Arrivée</div>
                  </div>
                  <div className="m-2">{separateurTrajet()}</div>
                  <div className="m-2 d-block">
                    <div>{trajet.start}</div>
                    <div className="mt-3">{trajet.end}</div>
                  </div>
                </div>
                <div className="card my-2">
                  <img src={imageMaps}></img>
                </div>
                <div className="d-bloc">
                  <div>
                    Heure de départ :{" "}
                    {getReadableTime(trajet.date)}
                  </div>
                  <div>
                    Heure estimée d'arrivée :{" "}
                    <i>temps estimée calculée par api maps</i>
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                Nombre de passagers : {trajet.passenger_count}
              </li>
              <li className="list-group-item d-bloc">
                <div>Détail du véhicule :</div>
                <div className="mx-4">Marque : {trajet.vehicle_brand}</div>
                <div className="mx-4">Modèle : {trajet.vehicle_model}</div>
              </li>
              <li className="list-group-item">
                Status de la course : {trajet.status}
              </li>
              <li className="list-group-item">
                Proposé le {getReadableDate(trajet.creation_date.split("T")[0])}{" "}
                par{" "}
                <Link to={`/profil/${pilot.id}`}>
                  {pilot.first_name} {pilot.last_name}
                </Link>
              </li>
            </ul>
            <div className="card-body text-center">
              <a className="btn btn-outline-primary m-2">
                Choisir cette course
              </a>
            </div>
          </div>
        </div>
      ) : (
        // placeholder
        <div className="container w-50 placeholder-glow">
          <h2 className="my-4 placeholder col-5"></h2>
          <div className="card shadow">
            <ul className="list-group list-group-flush">
              <li className="list-group-item placeholder col-5 m-2"></li>
              <li className="list-group-item placeholder col-3 m-2"></li>
              <li className="list-group-item placeholder col-4 m-2"></li>
              <li className="list-group-item placeholder col-3 m-2"></li>
            </ul>
            <div className="card-body text-center">
              <a className="btn btn-outline-primary m-2 placeholder col-2"></a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}