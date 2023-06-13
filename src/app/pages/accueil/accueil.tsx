import "./accueil.scss";

import { addIcon, searchIcon, voiture } from "../../../assets/allAssets";
import { Link } from "react-router-dom";
import React from "react";
import { useAuth } from "../../hooks/useAuth";

export default function Accueil() {
  const { token } = useAuth();

  return (
    <div className="Accueil">
      <div className="container-fluid light-bg m-0">
        <div className="container col-xs-12 col-sm-12 col-md-11 col-lg-9 col-xl-7 py-4">
          <h3 className="pb-4 fw-semibold">
            Un vaste choix de trajets pour se rendre à l'EPF !
          </h3>
          <div className="d-flex justify-content-between align-items-start">
            <div className="w-50 text-center">
              <div>{voiture()}</div>
            </div>
            <h5 className="text-end text-break">
              Solution responsable et écologique de covoiturage entre étudiants
              et enseignants
            </h5>
          </div>
          <div className="card shadow">
            <div className="card-body text-break">
              Bienvenue sur EPF Co'Drive, le site de covoiturage pour les élèves
              et professionnels de l'EPF ! C'est un moyen pratique et convivial
              pour partager ses trajets. Notre plateforme connecte ses membres
              pour leur permettre de partager leurs voyages avec des passagers
              cherchant un moyen de transport écologique. Que vous ayez besoin
              de vous rendre à l'EPF, ou de rentrer chez vous en fin de journée,
              notre site facilite la mise en relation des personnes partageant
              le même itinéraire. Profitez de notre système de réservation
              simple et sécurisé pour organiser vos déplacements, réduire vos
              frais de transport et rencontrer de nouvelles personnes.
              Rejoignez-nous dès maintenant et ensemble, créons une communauté
              de covoiturage dynamique et responsable !
            </div>
          </div>
        </div>
      </div>

      <div className="container d-flex justify-content-between col-xs-12 col-sm-12 col-md-11 col-lg-9 col-xl-7 mt-4">
        <div className="card flex-fill mt-3 me-3 w-50 shadow">
          <div className="card-header d-flex bg-primary">
            {addIcon()}
            <Link to="/add" className="nav-link">
              <h4 className="mt-1 px-3 align-self-center white">
                Proposer un trajet
              </h4>
            </Link>
          </div>
          <div className="card-body text-start text-break">
            Partagez votre trajet et proposez des places dans votre véhicule
            pour que des membres de l'EPF vous rejoigne, économiser sur les
            frais de transport et réduire votre empreinte carbone.
          </div>
        </div>

        <div className="card flex-fill mt-3 ms-3 w-50 shadow">
          <div className="card-header d-flex dark bg-primary">
            {searchIcon()}
            <Link to="/list" className="nav-link">
              <h4 className="mt-1 px-3 align-self-center white">
                Rechercher un trajet
              </h4>
            </Link>
          </div>
          <div className="card-body text-start text-break">
            Trouvez rapidement des trajets disponibles qui correspondent à vos
            besoins et économisez sur vos déplacements en rejoignant des
            conducteurs partageant le même itinéraire.
          </div>
        </div>
      </div>
    </div>
  );
}
