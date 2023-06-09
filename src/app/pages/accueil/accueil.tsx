import "./accueil.scss";

import { voiture, addIcon, searchIcon } from "../../../assets/allAssets";
import { Link } from "react-router-dom";
import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { environment } from "../../api/environment";
import { getCourse, getUser } from "../../api/RESTApi";

export default function Accueil() {
  const { user } = useAuth();

  return (
    <div className="Accueil">
      <div className="container-fluid light-bg">
        <div className="container p-4">
          <h3 className="pb-4 fw-semibold">
            Un vaste choix de trajets pour se rendre à l'EPF !
          </h3>
          <div className="d-flex justify-content-between align-items-start">
            <div className="w-50 text-center">
              <div>{voiture()}</div>
            </div>
            <h5 className="text-end text-wrap">
              Solution responsable et écologique de covoiturage entre étudiants
              et enseignants
            </h5>
          </div>
          <div className="card shadow">
            <div className="card-body">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi et
              tempus leo, non viverra lectus. Etiam sagittis maximus pulvinar.
              Sed placerat, ligula non feugiat feugiat, ante nibh ultrices
              libero, nec mattis elit velit eu lacus. Pellentesque luctus sed
              justo eget accumsan. In lobortis pellentesque rutrum. Sed in ex
              hendrerit, finibus metus in, viverra ligula. Aliquam pellentesque
              felis quis diam tempus, in auctor odio finibus. Praesent nunc
              lacus, pellentesque quis nibh vitae, volutpat placerat quam.
              Aliquam non justo sed risus venenatis sodales eget fermentum
              lacus. Quisque eros dolor, luctus a mollis quis, placerat a velit.
              Aliquam eget odio molestie, eleifend sem ut, volutpat tortor.
              Nulla facilisi. Quisque non ligula ac leo placerat cursus. Cras
              quis pellentesque tortor. Sed egestas tempus molestie
            </div>
          </div>
        </div>
      </div>

      <div className="container d-flex justify-content-between mt-4">
        <div className="card flex-fill m-3 w-50 shadow">
          <div className="card-header d-flex bg-primary">
            {addIcon()}
            <Link to="/add" className="nav-link">
              <h4 className="mt-1 px-3 align-self-center white">
                Proposer un trajet
              </h4>
            </Link>
          </div>
          <div className="card-body text-start text-wrap">
            Donec pharetra, turpis et varius fermentum, enim dolor molestie
            lacus, hendrerit bibendum enim velit eu metus. Vestibulum enim nisl,
            pharetra a enim blandit, tincidunt tincidunt tellus.
          </div>
        </div>

        <div className="card flex-fill m-3 w-50 shadow">
          <div className="card-header d-flex dark bg-primary">
            {searchIcon()}
            <Link to="/list" className="nav-link">
              <h4 className="mt-1 px-3 align-self-center white">
                Rechercher un trajet
              </h4>
            </Link>
          </div>
          <div className="card-body text-start text-wrap">
            Nam facilisis urna non mi ullamcorper tincidunt. Curabitur non
            tristique nunc. Nullam ultrices neque enim. Nulla dignissim leo ex,
            at hendrerit dolor euismod sed.
          </div>
        </div>
      </div>
    </div>
  );
}
