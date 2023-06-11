import { environment } from "./environment";
import axios from "axios";

axios.defaults.headers.common = {
  Accept: "application/json",
  "Content-Type": "application/json",
};


export interface User {
  fname: string;
  name: string;
  email: string;
  token: string;
}

export async function getToken(
  user: string | undefined,
  password: string | undefined
): Promise<User> {

  return axios
    .post(
      `${environment.api.host}/api/user/login/`,
      { email: user, password: password },
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((resp) => {
      return resp.data;
    }).catch(() => {
      return null;
    });
}

export async function APIlogout(token: string) {
  return axios
    .post(
      `${environment.api.host}/api/user/logout/`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }
    )
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
}

export async function signinEPF(
  nom: string,
  prenom: string,
  email: string,
  password: string
) {
  return axios
    .post(`${environment.api.host}/api/user/`, {
      first_name: nom,
      last_name: prenom,
      email: email,
      password: password,
    })
    .then((resp) => {
      console.log(resp);
      return resp.data;
    })
    .catch((error) => {
      console.log(JSON.stringify(error.response.data));
      return null;
    });
}

export async function getCourses() {
  return axios
    .get(`${environment.api.host}/api/courses/`)
    .then((resp) => {
      return resp.data;
    })
    .catch((error) => {
      return null;
    });
}

export async function getCourse(id: string, token: string) {
  return axios
    .get(`${environment.api.host}/api/courses/${id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
    .then((resp) => {
      return resp.data;
    })
    .catch((error) => {
      console.log(error.response);
      return null;
    });
}

export async function getUser(id: string, token: string) {
  return axios
    .get(`${environment.api.host}/api/user/${id}/`, {
      method: "GET",
      // headers: {
      //   Authorization: `Token ${token}`,
      // },
    })
    .then((resp) => {
      return resp.data;
    })
    .catch((error) => {
      console.log(error.response.data);
      return null;
    });
}

export async function getConnectedUser(token: string) {
  return axios
    .get(`${environment.api.host}/api/user/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    .then((resp) => {
      return resp.data;
    })
    .catch((error) => {
      console.log(error.response.data);
      return null;
    });
}

export async function addCourse(
  start: string,
  end: string,
  brand: string,
  model: string,
  seats: string,
  date: string,
  status: string,
  token: string
) {
  return axios
    .post(
      `${environment.api.host}/api/courses-user/`,
      {
        start: start,
        end: end,
        vehicle_brand: brand,
        vehicle_model: model,
        vehicle_seats: parseInt(seats),
        date: date,
        status: status,
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    )
    .then((resp) => {
      console.log(resp.data);
      return resp.data;
    }).catch((err) => {
      console.log(err)
      return null;
    });
  // console.log(resp);
}

export async function getNotesGiven(token: string, id: string) {
  return axios
    .get(`${environment.api.host}/api/notes/user/${id}/`, {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    .then((resp) => {
      // console.log(resp);
      return resp.data;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
}

export async function getNotesGot(token: string, id: string) {
  return axios
    .get(`${environment.api.host}/api/notes/user/${id}/`, {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
      },
      params: {
        user: "rated",
      },
    })
    .then((resp) => {
      return resp.data;
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
}

export async function getNotesWithUser(token: string, id: string) {
  return axios
    .get(`${environment.api.host}/api/notes/user/${id}/`, {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
      },
      params: {
        user: "rated",
      },
    })
    .then((resp) => {
      return Promise.all(
        resp.data.notes.map((note: any) => {
          return getUser(note.rater, token).then((user: any) => {
            return {
              id: note.id,
              note: note.note,
              comment: note.comment,
              course: note.course,
              rater: user.user,
              rated: note.rated,
            };
          });
        })
      );
    })
    .then((objects) => {
      return objects;
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
}

export function checkValidity(user: any) {
  if (new Date(user.expiry) <= new Date()) {
    return false;
  } else {
    return true;
  }
}
