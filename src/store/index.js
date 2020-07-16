const store = {
  state: {
    loggedInUser: null
  },
  login(user) {
    this.state.loggedInUser = user;
  },
  logout() {
    this.state.loggedInUser = null;
  }
};

export default store;
