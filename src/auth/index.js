const axios = require("axios").default;
import router from "@/router";
import { EventEmitter } from "events";
const AUTH_TOKEN_KEY = "AUTH_TOKEN";
const LOGGED_IN_KEY = "LOGGED_IN";

class AuthService extends EventEmitter {
  authToken = null;
  loggedInUser = null;
  tokenExpiry = null;
  logoutWithSessionExpiryMessage() {
    this.emit("session-expired-event");
    setTimeout(() => {
      this.logout();
    }, 2000);
  }
  logout() {
    this.authToken = null;
    this.loggedInUser = null;
    this.tokenExpiry = null;
    localStorage.removeItem(LOGGED_IN_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    router.push("login");
  }
  localLogin(username, token) {
    this.loggedInUser = username;
    this.authToken = token;
    localStorage.setItem(LOGGED_IN_KEY, "true");
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
  handleAuthentication(username, password) {
    // console.log(process.env.NODE_ENV);
    console.info(`Requesting from ${process.env.VUE_APP_AUTH_ENDPOINT}`);
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
  getLoggedInUser() {
    return this.loggedInUser;
  }
}

const service = new AuthService();
export default service;
