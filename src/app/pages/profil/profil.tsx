import React, { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router";
import { getNotes, getUser } from "../../api/RESTApi";
import { useAuth } from "../../hooks/useAuth";

export default function Profil() {
  const { id } = useParams();
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  const [notes, setNotes] = useState<any[]>([]);
  const [duser, setDUser] = useState<any>("");

  useEffect(() => {
    getNotes(user.token).then((resp: any) => {
      setNotes(resp);
    });
    getUser("1", user.token).then((resp) => {
      setDUser(resp);
    });
  }, []);

  return (
    <div className="Accueil">
      <div className="container col-sm-8 col-md-8 col-lg-8">
        <h2 className="my-4">Profil de Prenom nom</h2>
        <div className="card">
          <div className="card-body">
            {notes &&
              notes.map((note) => {
                return <p>{JSON.stringify(note)}</p>;
              })}
          </div>
          <div>
            {notes &&
              <p>{JSON.stringify(duser)}</p>
              }
          </div>
        </div>
      </div>
    </div>
  );
}
