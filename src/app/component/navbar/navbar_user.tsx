import { Link } from "react-router-dom";
import "./navbar.scss";
import React from "react";
// import { iconProfil } from "../../../assets/allAssets";

function NavbarUser() {
  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td className="px-3">Connecté(e)</td>
            <td className="border-end"></td>
            <td className="nav-item px-3">
              <Link className="nav-link" to="/logout">
                Déconnexion
              </Link>
            </td>
            {/* <td>{iconProfil()}</td> */}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default NavbarUser;
