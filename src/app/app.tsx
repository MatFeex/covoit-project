import React from "react";
import Navbar from "./component/navbar/navbar";
import Accueil from "./pages/accueil/accueil";
import Signin from "./pages/signin/signin";
import Login from "./pages/login/login";
import AjoutTrajet from "./pages/ajout_trajet/ajout_trajet";
import ListeTrajet from "./pages/liste_trajet/liste_trajet";
import Logout from "./pages/logout/logout";
import Erreur from "./pages/erreur/erreur";

import "bootstrap/js/dist/collapse";
import "bootstrap/js/dist/dropdown";
import "bootstrap/js/dist/modal";

import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Detail_Trajet from "./pages/detail_trajet/detail_trajet";
import Profil from "./pages/profil/profil";
import {InfoProvider} from "./context/InfoContext";
import "./style/style.scss";
import ModifProfil from "./pages/modif_profil/modif_profil";

export default function App() {
	return (
		<div className="App">
			<Router>
				<Navbar />
				<Routes>
					<Route element={<InfoProvider />}>
						<Route path="/" element={<Accueil />} />
						<Route path="/login" element={<Login />} />
						<Route path="/signin" element={<Signin />} />
						<Route path="/add" element={<AjoutTrajet />} />
						<Route path="/list" element={<ListeTrajet />} />
						<Route path="/logout" element={<Logout />} />
						<Route path="/course/:id" element={<Detail_Trajet />} />
						<Route path="/profil/:id" element={<Profil />} />
						<Route path="/profil" element={<ModifProfil />} />
						<Route path="*" element={<Erreur />} />
					</Route>
				</Routes>
				{/* <Footer /> */}
			</Router>
		</div>
	);
}
