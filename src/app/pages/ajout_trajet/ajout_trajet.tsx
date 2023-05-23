import "./ajout_trajet.scss";
import React from 'react';

export default function AjoutTrajet() {
  return (
    <div className="AjoutTrajet">
      <div className="container w-50">
        <h2 className="my-4">Ajouter un nouveau trajet :</h2>
        <form className="card shadow">
          <div className="card-body">
            <h4>Détail de la course :</h4>
            <div className="form-label-group mb-3">
              <label htmlFor="start">Lieu de départ :</label>
              <input type="text" className="form-control" id="start" required />
            </div>
            <div className="form-label-group mb-3">
              <label htmlFor="end">Lieu d'arrivée :</label>
              <input type="text" className="form-control" id="end" required />
            </div>
            <div className="form-label-group mb-3">
              <label htmlFor="date">Date :</label>
              <input type="date" className="form-control" id="date" />
            </div>
            <h4>Détail de la course :</h4>
            <div className="form-label-group mb-3">
              <label htmlFor="start">Modèle de la voiture :</label>
              <input type="text" className="form-control" id="start" required />
            </div>
            <div className="form-label-group mb-3">
              <label htmlFor="end">Marque de la voiture :</label>
              <input type="text" className="form-control" id="end" required />
            </div>
            <input
              className="btn btn-outline-primary my-2"
              type="submit"
              value="Ajouter"
            />
          </div>
        </form>
      </div>
    </div>
  );
}