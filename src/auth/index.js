const axios = require("axios").default;
import router from "@/router";
import { EventEmitter } from "events";
const AUTH_TOKEN_KEY = "AUTH_TOKEN";
const LOGGED_IN_USER_KEY = "LOGGED_IN_USER";
import store from "@/store";

class AuthService extends EventEmitter {
  logoutWithSessionExpiryMessage() {
    this.emit("session-expired-event");
    setTimeout(() => {
      this.logout();
    }, 2000);
  }
  logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(LOGGED_IN_USER_KEY);
    store.logout();
    router.push("/login");
  }
  localLogin(username, token) {
    store.login(username);
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(LOGGED_IN_USER_KEY, username);
  }
  handleAuthentication(username, password) {
    // console.log(process.env.NODE_ENV);
    // console.info(`Requesting from ${process.env.VUE_APP_AUTH_ENDPOINT}`);
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
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const loggedInUser = localStorage.getItem(LOGGED_IN_USER_KEY);
    if (token && loggedInUser) {
      store.login(loggedInUser);
      return true;
    }
    return store.state.loggedInUser ? true : false;
  }
}

const service = new AuthService();
export default service;
