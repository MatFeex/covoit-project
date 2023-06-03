import React, { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router";
import { checkValidity, getNotesGiven, getNotesGot, getUser } from "../../api/RESTApi";
import { useAuth } from "../../hooks/useAuth";
import { getReadableDate } from "../../utils/utils";
import "./profil.scss";

export default function Profil() {
  const { id } = useParams<string>();
  const { user } = useAuth();

  if (!user || !checkValidity(user)) {
    return <Navigate to="/login" />;
  }

  const [notesGot, setNotesGot] = useState<any[]>([]);
  const [notesGiven, setNotesGiven] = useState<any[]>([]);
  const [duser, setDUser] = useState<any>("");
  const [moyenne, setMoyenne] = useState<string>("");

  useEffect(() => {
    if (id) {
      getNotesGot(user.token, id).then((resp: any) => {
        setNotesGot(resp.notes);
      });
      // getNotesGiven(user.token, id).then((resp: any) => {
      //   setNotesGiven(resp.notes);
      // });
      getUser(id, user.token).then((resp) => {
        setDUser(resp.user);
      });
    }
  }, []);

  return (
    <div className="Accueil">
      <div className="container col-xs-10 col-sm-9 col-md-8 col-lg-7 col-xl-6">
        <h2 className="my-4">
          Profil de {duser.first_name} {duser.last_name}
        </h2>
        <div className="d-bloc">
          <div>
            A rejoint l'application le {getReadableDate(duser.date_joined)}
          </div>

          <div className="card mt-2 card-profil">
            <a
              className="card-body text-decoration-none link-dark"
              data-bs-toggle="collapse"
              href="#collapseNotesGot"
              role="button"
              aria-expanded="false"
              aria-controls="collapseNotesGot"
            >
              {notesGot ? (
                <div>
                  {notesGot.reduce((moy: number, note: any) => {
                    console.log(note.note);
                    return moy + note.note;
                  }, 0) / notesGot.length}{" "}
                  / 10 - {notesGot.length} avis
                </div>
              ) : (
                <div>Aucune note</div>
              )}
            </a>
          </div>

          <div className="collapse mt-2" id="collapseNotesGot">
            {notesGot &&
              notesGot.map((note) => {
                return <div className="ms-4">{JSON.stringify(note)}</div>;
              })}
          </div>

          <div className="mt-2">
            {notesGot && <div>{JSON.stringify(duser)}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
