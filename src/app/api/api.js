import userEvent from "@testing-library/user-event";
import axios from "axios";
import { environment } from "./environment";

export const fetchData = async () => {
  try {
    const response = await axios.get(`${environment.api.host}/api/courses/`);
    return response.data;
  } catch (error) {
    console.error(`erreur : ${error}`);
  }
};

export async function getToken(email, password) {
  const resp = await fetch(`${environment.api.host}/api/user/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email, password: password }),
  });
  if (!resp.ok) {
    // @ts-ignore
    console.log("error in getToken");
  }
  return await resp.json();
}

export async function logout() {
  const user = localStorage.getItem('connectedUser');
  localStorage.setItem('connectedUser', null);
  console.log("apres le logout");
  console.log(localStorage.getItem("connectedUser"));
  const resp = await fetch(`${environment.api.host}/api/user/logout/`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "Authorization": "Token " + user.token,
    }
  }).catch(e => {
    console.log("erreur dans le fetch");
    console.log(e)
  })
  localStorage.removeItem("connectedUser");

  return true;
}

// { "first_name": "John", "last_name": "Doe", "email": "john.doe@email.fr", "password": "admin123" }
export async function signinEPF(nom, prenom, email, password) {
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
  if(!resp.ok) {
    console.log("erreur dans le signin");
  }
  return await resp.json();
}
