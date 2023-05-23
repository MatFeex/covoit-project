import { Link } from "react-router-dom";
import { iconProfil } from "../../../assets/allAssets";
import "./navbar.scss";
import { useAuth } from "../../hooks/useAuth";
import React from "react";

function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="navbar shadow sticky-top white">
      <div className="container d-flex justify-content-between">
        <div className="navbar-brand">
          <h3 className="pt-1">
            <Link className="nav-link" to="/">
              <b className="white">EPF Co'Drive</b>
            </Link>
          </h3>
        </div>
        <div>
          <table>
            <tbody>
              {!user ? (
                <tr>
                  <td className="px-3">
                    <Link className="nav-link" to="/login">
                      Se connecter
                    </Link>
                  </td>
                  <td className="border-end"></td>
                  <td className="px-3">
                    <Link className="nav-link" to="/signin">
                      S'inscire
                    </Link>
                  </td>
                  <td>{iconProfil()}</td>
                </tr>
              ) : (
                <tr>
                  <td className="px-3">Connecté(e)</td>
                  <td className="border-end"></td>
                  <td className="px-3">
                    <Link className="nav-link" to="/logout">
                      Déconnexion
                    </Link>
                  </td>
                  <td>{iconProfil()}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
