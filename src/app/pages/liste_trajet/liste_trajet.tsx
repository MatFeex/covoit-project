import "./liste_trajet.scss";
import Navbar from "../../component/navbar/navbar";
import Footer from "../../component/footer/footer";
import { trajetDefini, trajetPlaceholder } from "../../component/trajet/trajet";

import React, { useState, useEffect } from "react";
import { fetchData } from "../../api/api";

function ListeTrajet() {
  const [data, setData] = useState<any[]>([]);
  // let trajets: any[] = [];

  useEffect(() => {
    fetchData().then((resp) => {
      setData(resp);
    });
  }, []);

  return (
    <div className="AjoutTrajet">
      <div className="container w-50">
        <h2 className="my-4">Liste des trajets :</h2>
        <div className="d-flex flex-column">
          {data ? (
            <div>
              {data.map((item) => {
                return (
                  <div key={item.id} className="trajet p-2">
                    <div className="card mb-3 shadow">
                      <div className="card-body placeholder-glow">
                        <h5 className="card-title">Trajet {item.id}</h5>

                        <div className="d-flex flex-column card-text">
                          <p>Départ : {item.start}</p>
                          <p>Destination : {item.end}</p>
                          <p>Date : {item.date}</p>
                        </div>

                        <button
                          className="btn btn-outline-primary"
                          type="button"
                        >
                          Détails
                        </button>
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
