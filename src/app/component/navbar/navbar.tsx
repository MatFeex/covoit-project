import "./navbar.scss";
import { useAuth } from "../../hooks/useAuth";
import React from "react";
import NavbarUser from "./navbar_user";
import NavbarNoUser from "./navbar_no_user";
import { Link } from "react-router-dom";
import "../../../../node_modules/bootstrap/js/dist/collapse";
import { navbarToggler } from "../../../assets/allAssets";
import { checkValidity } from "../../api/RESTApi";

function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="navbar navbar-codrive navbar-expand-lg white">
      <div className="container">
        <div className="navbar-brand">
          <Link className="nav-link" to="/">
            <b className="nav-title">EPF Co'Drive</b>
          </Link>
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <div className="mb-1">
          {navbarToggler()}
          </div>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/add">
                Proposer un trajet
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/list">
                Rechercher un trajet
              </Link>
            </li>
          </ul>
          <div>{(user && checkValidity(user)) ? <NavbarUser /> : <NavbarNoUser />}</div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
