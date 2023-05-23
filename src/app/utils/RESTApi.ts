// import Cookies from 'js-cookie';

const hostname = "http://localhost:8000";
export interface User {
    fname: string;
    name: string;
    email: string;
    token: string;
}

export async function getToken(user: string | undefined, password: string | undefined): Promise<User> {

    const bodyJson = JSON.stringify({"email": user, "password": password});
    console.log(bodyJson);

    return fetch(`${hostname}/api/user/login/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: bodyJson
    }).then(resp => {
        if (!resp.ok) { // @ts-ignore
            // throw new Error(resp.body);
            console.log("Erreur lors du login");
            console.error(resp);
        }
        return resp.json();
    });
}