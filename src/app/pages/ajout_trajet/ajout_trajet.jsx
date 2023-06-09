import "./ajout_trajet.scss";
import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Navigate, redirect } from "react-router-dom";
import { addCourse, checkValidity } from "../../api/RESTApi";

export default function AjoutTrajet() {
  const { user } = useAuth();

  if (!user || !checkValidity(user)) {
    return <Navigate to="/login" />;
  }

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [seats, setSeats] = useState("");
  const [date, setDate] = useState(new Date());

  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);

  function setDay(e) {
    let dateSplitted = e.split("-");
    date.setFullYear(parseInt(dateSplitted[0]));
    date.setMonth(parseInt(dateSplitted[1]));
    date.setDate(parseInt(dateSplitted[2]));
  }

  function setTime(e) {
    let dateSplitted = e.split(":");
    date.setHours(parseInt(dateSplitted[0]));
    date.setMinutes(parseInt(dateSplitted[1]));
  }

  return (
    <div className="AjoutTrajet">
      <div className="container col-xs-10 col-sm-9 col-md-8 col-lg-7 col-xl-6">
        <h2 className="my-4">Ajouter un nouveau trajet :</h2>
        <form
          className="card shadow"
          onSubmit={(e) => {
            e.preventDefault()
            // console.log(`${start} ${end} ${brand} ${model} ${seats} ${date.toISOString()},${user.token}`);

            setLoading(true);

            addCourse(start, end, brand, model, seats, date.toISOString(), "En attente de passagers", user.token).then((resp) => {
              console.log(resp);
              setLoading(false);
              redirect(true);
            });
          }}
        >
          <div className="card-body">
            <h4>Détail de la course :</h4>
            <div className="form-label mb-3">
              <label htmlFor="start">Lieu de départ :</label>
              <input
                type="text"
                className="form-control"
                id="start"
                required
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
            <div className="form-label mb-3">
              <label htmlFor="end">Destination :</label>
              <input
                type="text"
                className="form-control"
                id="end"
                required
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
            <div className="d-flex flex-row mb-3">
              <div className="form-label flex-fill">
                <label htmlFor="date">Date :</label>
                <input
                  type="date"
                  className="form-control"
                  id="date"
                  required
                  onChange={(e) => setDay(e.target.value)}
                />
              </div>
              <div className="form-label flex-fill ms-3">
                <label htmlFor="heure">Heure du départ :</label>
                <input
                  type="time"
                  className="form-control"
                  id="heure"
                  required
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>
            <h4>Détail du véhicule :</h4>
            <div className="form-label mb-3">
              <label htmlFor="brand">Marque de la voiture :</label>
              <input
                type="text"
                className="form-control"
                id="brand"
                required
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
            <div className="form-label mb-3">
              <label htmlFor="model">Modèle de la voiture :</label>
              <input
                type="text"
                className="form-control"
                id="model"
                required
                onChange={(e) => setModel(e.target.value)}
              />
            </div>
            <div className="form-label mb-3">
              <label htmlFor="passenger">Nombre de passagers :</label>
              <input
                type="text"
                className="form-control"
                id="passenger"
                required
                onChange={(e) => setSeats(e.target.value)}
              />
            </div>
            <div className="d-flex align-items-center">
              <input
                className="btn btn-outline-primary"
                type="submit"
                value="Ajouter"
              />
              {loading && (
                <div
                  className="spinner-border text-primary ms-4"
                  role="status"
                ></div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
