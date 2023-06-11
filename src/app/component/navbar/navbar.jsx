import "./navbar.scss";
import {useAuth} from "../../hooks/useAuth";
import React from "react";
import {Link, useNavigate} from "react-router-dom";
import {navbarToggler} from "../../../assets/allAssets";
import {canAcces} from "../../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();

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
          <div className="mb-1">{navbarToggler()}</div>
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
          <div>
            {canAcces() ? (
              <div className="dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Connecté(e)
                </a>

                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/profil">
                      Modifier mon profil
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => {
                      logout();
                      navigate("/");
                    }}>
                      Déconnexion
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <table className="navbar-nav">
                <tbody>
                  <tr>
                    <td className="pe-3">
                      <Link className="nav-link" to="/login">
                        Se connecter
                      </Link>
                    </td>
                    <td className="border-end"></td>
                    <td className="nav-item ps-3">
                      <Link className="nav-link" to="/signin">
                        S'inscrire
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
