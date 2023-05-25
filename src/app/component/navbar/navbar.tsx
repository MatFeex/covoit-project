import "./navbar.scss";
import { useAuth } from "../../hooks/useAuth";
import React from "react";
import NavbarUser from "./navbar_user";
import NavbarNoUser from "./navbar_no_user";
import { Link } from "react-router-dom";
import "../../../../node_modules/bootstrap/js/dist/collapse";

function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="navbar shadow sticky-top white">
      <div className="container d-flex justify-content-between">
        <div className="d-flex justify-content-between align-items-center">
          <div className="navbar-brand">
            <h3>
              <Link className="nav-link" to="/">
                <b className="white">EPF Co'Drive</b>
              </Link>
            </h3>
          </div>
          <div className="m-3">
            <Link className="nav-link" to="/add">
              Proposer un trajet
            </Link>
          </div>
          <div className="m-3">
            <Link className="nav-link" to="/list">
              Rechercher un trajet
            </Link>
          </div>
        </div>

        {user ? <NavbarUser /> : <NavbarNoUser />}
      </div>
    </nav>
  );
}

export default Navbar;
