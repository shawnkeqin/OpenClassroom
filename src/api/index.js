var passport = require("passport"),
  bodyParser = require("body-parser"),
  express = require("express"),
  LdapStrategy = require("passport-ldapauth"),
  jwt = require("jsonwebtoken"),
  moment = require("moment"),
  cors = require("cors");

const notifsRouter = require("./notifsRouter");
const facultyStatusRouter = require('./facultyStatusRouter')
var api = express.Router();

var getLDAPConfiguration = function(req, callback) {
  process.nextTick(function() {
    var opts = {
      server: {
        url: process.env.LDAP_URL,
        bindDn:
          `cn=${req.body.username},` + process.env.LDAP_BIND_DN_SUFFIX || "",
        bindCredentials: req.body.password,
        searchBase: process.env.LDAP_SEARCH_BASE || "",
        searchFilter: `(cn=${req.body.username})`,
        reconnect: true
      }
    };
    callback(null, opts);
  });
};

if (process.env.NODE_ENV == "production") {
  passport.use(new LdapStrategy(getLDAPConfiguration));
}

api.get("/", function(req, res) {
  res.send("API home");
});

api.post("/login", (req, res, next) => {
  if (process.env.NODE_ENV != "production") {
    // Send authorization for requested user regardless of password, without doing LDAP request.
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
  passport.authenticate("ldapauth", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.status(401).json({
        success: false,
        message: info
      });
    } else {
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
      jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
        if (err) {
          // console.log(err);;
          res.send(err);
        }
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
api.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
module.exports = app => {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
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
