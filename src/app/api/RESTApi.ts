import { environment } from "./environment";
import axios from "axios";

axios.defaults.headers.common = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export interface Token {
  token: string;
  expiry: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  date_joined: string;
}

export async function getToken(
  user: string | undefined,
  password: string | undefined
): Promise<Token> {
  return axios
    .post(`${environment.api.host}/api/user/login/`, {
      email: user,
      password: password,
    })
    .then((resp) => {
      return resp.data;
    })
    .catch(() => {
      return null;
    });
}

export async function logout(token: string) {
  return axios
    .post(
      `${environment.api.host}/api/user/logout/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
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
    });
}

export async function getCourses() {
  return axios
    .get(`${environment.api.host}/api/courses/`)
    .then((resp) => {
      return resp.data;
    })
    .catch(() => {
      return null;
    });
}

export async function getCourse(id: string, token: string) {
  return axios
    .get(`${environment.api.host}/api/courses/${id}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
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

export async function getUserCourses(status: string, token: string) {
  return axios
    .get(`${environment.api.host}/api/courses-user/`, {
      params: {
        status: status,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((resp) => {
      return resp.data;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
}

export async function getUser(id: string, token: string) {
  return axios
    .get(`${environment.api.host}/api/user/${id}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
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

export async function getConnectedUser(token: string): Promise<User | null> {
  return axios
    .get(`${environment.api.host}/api/user/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((resp) => {
      console.log(resp.data);
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
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((resp) => {
      console.log(resp.data);
      return resp.data;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
  // console.log(resp);
}

export async function getNotesGiven(token: string, id: string) {
  return axios
    .get(`${environment.api.host}/api/notes/user/${id}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
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
        Authorization: `Bearer ${token}`,
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

export async function getNotesWithUser(token: string, id: number) {
  return axios
    .get(`${environment.api.host}/api/notes/user/${id}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
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

export async function updateUserInfo(
  newFName: string,
  newLName: string,
  newEmail: string,
  password: string,
  token: string
) {
  // URL: PUT /api/user/
  // Request body (update a user but not the password):
  // { "first_name": "John 2", "last_name": "Doe 2", "email": "john.doe2@email.fr" "password":"admin123" }

  return axios
    .put(
      `${environment.api.host}/api/user/`,
      {
        first_name: newFName,
        last_name: newLName,
        email: newEmail,
        password: password,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((resp) => {
      console.log(resp);
      return resp.data;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
}

export async function updateUserPassword(
  email: string,
  oldpassword: string,
  newpassword: string,
  token: string
) {
  return axios
    .patch(
      `${environment.api.host}/api/user/`,
      {
        email: email,
        password: oldpassword,
        new_password: newpassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((resp) => {
      console.log(resp);
      return resp.data;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
}

export async function becomePassenger(id: string, token: String) {
  return axios.post(
    `${environment.api.host}/api/passengers-user/`,
    {
      course: id,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export async function deleteCourse(id: string, token: string) {
  return axios
    .delete(`${environment.api.host}/api/courses/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((resp) => {
      console.log(resp);
      return resp;
    });
}

export function noteSomeone(
  note: number,
  comm: string,
  token: string,
  courseId: string,
  ratedId: string
) {
  return axios.post(
    `${environment.api.host}/api/notes/courses/${courseId}/user-rated/${ratedId}/`,
    {
      note: note,
      comment: comm,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
