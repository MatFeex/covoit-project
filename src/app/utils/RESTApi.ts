import { environment } from "../api/environment";

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

  return fetch(`${environment.api.host}/api/user/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: user, password: password }),
  }).then((resp) => {
    if (!resp.ok) {
      // @ts-ignore
      // throw new Error(resp.body);
      console.log("Erreur lors du login");
      console.error(resp);
    }
    return resp.json();
  });
}

export async function APIlogout(token: string) {
  console.log("Appelle de API logout");
  return fetch(`${environment.api.host}/api/user/logout/`, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
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
