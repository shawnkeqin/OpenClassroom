var passport = require("passport"),
  bodyParser = require("body-parser"),
  express = require("express"),
  LdapStrategy = require("passport-ldapauth");

var api = express.Router();
var OPTS = {
  server: {
    url: "ldap://localhost:10389",
    bindDN: "cn=jeremy,ou=users,dc=example,dc=com",
    bindCredentials: "jeremyyew",
    searchBase: "ou=users,dc=example,dc=com",
    searchFilter: "(cn=jeremy)",
    reconnect: true
  }
};
passport.use(new LdapStrategy(OPTS));

api.get("/", function(req, res) {
  res.send("API home");
});

api.post("/login", (req, res, next) => {
  passport.authenticate("ldapauth", (err, user, info) => {
    console.log(err);
    console.log(user);
    console.log(info);
    res.status(401).send(info);
  })(req, res, next);
});

api.use(bodyParser.urlencoded({ extended: false }));
api.use(passport.initialize());
module.exports = app => {
  app.use(bodyParser.json());
  app.use("/api", api);
};
// middleware that is specific to this router
// api.use(function timeLog(req, res, next) {
//   console.log("Time: ", Date.now());
//   next();
// });
