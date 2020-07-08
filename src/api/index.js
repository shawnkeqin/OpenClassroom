var passport = require("passport"),
  bodyParser = require("body-parser"),
  express = require("express"),
  LdapStrategy = require("passport-ldapauth"),
  jwt = require("jsonwebtoken"),
  moment = require("moment");

var api = express.Router();

var getLDAPConfiguration = function(req, callback) {
  process.nextTick(function() {
    var opts = {
      server: {
        url: process.env.LDAP_URL,
        bindDn: `cn=${req.body.username},` + process.env.LDAP_BIND_DN_SUFFIX,
        bindCredentials: `${req.body.password}`,
        searchBase: process.env.LDAP_SEARCH_BASE,
        searchFilter: `(cn=${req.body.username})`,
        reconnect: true
      }
    };
    callback(null, opts);
  });
};

passport.use(new LdapStrategy(getLDAPConfiguration));

api.get("/", function(req, res) {
  res.send("API home");
});

api.post("/login", (req, res, next) => {
  passport.authenticate("ldapauth", (err, user, info) => {
    console.log(err);
    console.log(user);
    console.log(info);
    if (err) {
      return next(err);
    }
    if (!user) {
      res.status(401).json({
        success: false,
        message: "info"
      });
    } else {
      const payload = {
        exp: moment()
          .add(30, "seconds")
          .unix(),
        "https://hasura.io/jwt/claims": {
          "x-hasura-allowed-roles": ["user"],
          "x-hasura-default-role": "user",
          "x-hasura-user-id": "hihi"
        }
      };
      jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
        if (err) {
          console.log(err);
          res.send(err);
        }
        res.json({
          success: true,
          token: "Bearer " + token
        });
      });
    }
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

// {"type": "RS512", "key": ";"}
