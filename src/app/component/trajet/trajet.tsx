import "./trajet.scss";
import React from "react";

// export interface Trajet {
//   start: string;
//   end: string;
//   date: string;
//   id: string;

//   // Ajoutez d'autres propriétés du trajet ici si nécessaire
// }

export const trajetDefini = (
  start: string = "start",
  end: string = "end",
  date: string = "date",
  id: string = "000"
) => {
  return (
    <div key={id} className="trajet p-2">
      <div className="card mb-3 shadow">
        <div className="card-body placeholder-glow">
          <h5 className="card-title">Trajet {id}</h5>

          <div className="d-flex flex-column card-text">
            <p>Départ : {start}</p>
            <p>Destination : {end}</p>
            <p>Date : {date}</p>
          </div>

          <button className="btn btn-outline-primary" type="button">
            Détails
          </button>
        </div>
      </div>
    </div>
  );
}

export function trajetPlaceholder() {
  return (
    <div key={1} className="trajet p-2">
      <div className="card mb-3 shadow">
        <div className="card-body placeholder-glow">
          <h5 className="card-title placeholder col-3">Titre</h5>
          <div className="d-flex flex-column card-text">
            <p className="placeholder col-7">depart</p>
            <p className="placeholder col-6">destination</p>
            <p className="placeholder col-4">date</p>
          </div>
          <button
            className="btn btn-outline-primary placeholder col-1"
            type="button"
          ></button>
        </div>
      </div>
    </div>
  );
}
