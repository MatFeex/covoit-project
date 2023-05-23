export class User {
  constructor(email, token) {
    this.email = email;
    this.token = token;
  }

  toString() {
    return `${this.email}, ${this.token}`;
  }
}
