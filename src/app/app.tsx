import React from "react";
import Navbar from "./component/navbar/navbar";
import Footer from "./component/footer/footer";
import Accueil from "./pages/accueil/accueil";
import Signin from "./pages/signin/signin";
import Login from "./pages/login/login";
import AjoutTrajet from "./pages/ajout_trajet/ajout_trajet";
import ListeTrajet from "./pages/liste_trajet/liste_trajet";
import Logout from "./pages/logout/logout";
import Erreur from "./pages/erreur/erreur";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Detail_Trajet from "./pages/detail_trajet/detail_trajet";

export default function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <div className="mb-5">
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/add" element={<AjoutTrajet />} />
            <Route path="/list" element={<ListeTrajet />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/course/:id" element={<Detail_Trajet />} />
            <Route path="*" element={<Erreur />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}
