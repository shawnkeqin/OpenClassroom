var passport = require("passport"),
  bodyParser = require("body-parser"),
  express = require("express"),
  LdapStrategy = require("passport-ldapauth"),
  jwt = require("jsonwebtoken"),
  moment = require("moment"),
  cors = require("cors");

const LDAP_CONNECTED =
  process.env.VUE_APP_MODE == "production" ||
  process.env.VUE_APP_MODE == "staging-test";
const notifsRouter = require("./notifsRouter");
const facultyStatusRouter = require("./facultyStatusRouter");
var api = express.Router();

var getLDAPConfiguration = function(req, callback) {
  process.nextTick(function() {
    var opts = {
      server: {
        url: process.env.LDAP_URL,
        bindDn: `nusstf\\${req.body.username}`,
        bindCredentials: req.body.password,
        searchBase: process.env.LDAP_SEARCH_BASE || "",
        searchFilter: `sAMAccountName=${req.body.username}`,
        reconnect: true
      }
    };
    callback(null, opts);
  });
};

if (LDAP_CONNECTED) {
  passport.use(new LdapStrategy(getLDAPConfiguration));
}

api.get("/", function(req, res) {
  res.send("API home");
});

api.post("/login", (req, res, next) => {
  if (!LDAP_CONNECTED) {
    // Send authorization for requested user regardless of password, without doing LDAP request.
    console.info(
      "Not in producting or staging-test, so responding with mock authorization."
    );
    const payload = {
      exp: moment()
        .add(process.env.LDAP_TOKEN_EXP_DAYS, "days")
        .unix(),
      "https://hasura.io/jwt/claims": {
        "x-hasura-allowed-roles": ["user"],
        "x-hasura-default-role": "user",
        "x-hasura-user-id": req.body.username
      }
    };
    jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
      res.json({
        success: true,
        token: token
      });
    });
    return;
  }
  console.info("Contacting NUS LDAP servers...");
  passport.authenticate("ldapauth", (err, user, info) => {
    console.info(`NUS LDAP server response:\n
      err:${err ? JSON.stringify(err) : err}\n
      user:${user ? JSON.stringify(user) : user}\n
      info:${JSON.stringify(info)}`);
    if (err) {
      console.info(err);
      return next(err);
    }
    if (!user) {
      console.info("No user, returning login failed response.");
      res.json({
        success: false,
        message: info.message || ""
      });
    } else {
      console.info(
        `Constructing auth response payload with user object returned by LDAP: ${JSON.stringify(
          user
        )}`
      );
      const payload = {
        exp: moment()
          .add(process.env.LDAP_TOKEN_EXP_DAYS, "days")
          .unix(),
        "https://hasura.io/jwt/claims": {
          "x-hasura-allowed-roles": ["user"],
          "x-hasura-default-role": "user",
          "x-hasura-user-id": user[process.env.LDAP_RESP_USERNAME_FIELD]
        }
      };
      console.info("Signing JWT claim...");
      jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
        if (err) {
          console.info(err);
          res.send(err);
        }
        console.info("Returning JWT: " + token);
        res.json({
          success: true,
          token: token
        });
      });
    }
  })(req, res, next);
});

api.use("/notifs", notifsRouter);
api.use("/faculty-status", facultyStatusRouter);

api.use(bodyParser.urlencoded({ extended: false }));
api.use(passport.initialize());
module.exports = app => {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("X-Frame-Options", "DENY");
    switch (process.env.VUE_APP_MODE) {
      case "staging-test":
      case "production":
        res.header("Access-Control-Allow-Origin", process.env.VUE_APP_BASE_URL);
        res.header(
          "Content-Security-Policy",
          `default-src 'self'; font-src 'self' https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' https://toppng.com; frame-ancestors 'none'; connect-src ${process.env.VUE_APP_AUTH_ENDPOINT}`
        );
    }
    next();
  });
  app.use("/api", api);
  // app.use("/notifs", notifsRouter);
};
// middleware that is specific to this router
// api.use(function timeLog(req, res, next) {
//   console.log("Time: ", Date.now());
//   next();
// });
