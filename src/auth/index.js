const axios = require("axios").default;
const AUTH_TOKEN_KEY = "AUTH_TOKEN";
const LOGGED_IN_KEY = "LOGGED_IN";

class AuthService {
  authToken = null;
  loggedInUser = null;
  tokenExpiry = null;
  localLogin(username, token) {
    this.loggedInUser = username;
    this.authToken = token;

    localStorage.setItem(LOGGED_IN_KEY, "true");
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
  handleAuthentication(username, password) {
    return axios
      .post(process.env.VUE_APP_AUTH_ENDPOINT, {
        username: username,
        password: password
      })
      .then(resp => {
        if (resp.data.success && resp.data.token) {
          this.localLogin(username, resp.data.token);
        }
        return resp;
      });
  }
  isAuthenticated() {
    return this.loggedInUser;
  }
}

const service = new AuthService();
export default service;
