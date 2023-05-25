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
  console.log(user);
  return fetch(`${environment.api.host}/api/user/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ "email": user, "password": password }),
  }).then((resp) => {
    console.log(resp);
    if (!resp.ok) {
      // @ts-ignore
      throw new Error(resp.body);
    }
    return resp.json();
  });
}

export async function APIlogout(token: string) {
  return fetch(`${environment.api.host}/api/user/logout/`, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`
    } 
  })
    .then((response) => {
      if (response.ok) {
        return response;
      } else {
        console.log("Erreur lors du logout");
      }
    })
    .catch((error) => {
      console.log(error);
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
  return axios.get(`${environment.api.host}/api/courses/${id}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    }
    })
    .then((resp) => {
      return resp.data;
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
}

export async function getUser(id: string, token: string) {
  return axios.get(`${environment.api.host}/api/user/${id}/`, {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`
    }
    })
    .then((resp) => {
      console.log(resp);
      return resp.data;
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
}

export async function signinEPF(
  nom: string,
  prenom: string,
  email: string,
  password: string
) {
  const resp = await fetch(`${environment.api.host}/api/user/`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      first_name: nom,
      last_name: prenom,
      email: email,
      password: password,
    }),
  });
  if (!resp.ok) {
    console.log("Erreur dans le signin");
  }
  return await resp.json();
}
