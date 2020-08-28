// The server isn't run by vue-cli-service so we need to tell it what mode we want explicitly.
// require("custom-env").env();
require("custom-env").env("local");
require("custom-env").env(process.env.VUE_APP_MODE);

const { resolve } = require("path"),
  history = require("connect-history-api-fallback"),
  configureAPI = require("./src/api"),
  express = require("express"),
  app = express(),
  cors = require("cors"),
  bodyParser = require("body-parser");

// // API
configureAPI(app);

// // UI
const publicPath = resolve(__dirname, "./dist");
const staticConf = {
  maxAge: "1d",
  etag: false,
  setHeaders: res => {
    res.set(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.set("X-Frame-Options", "DENY");
    switch (process.env.VUE_APP_MODE) {
      case "staging-test":
      case "production":
        res.set("Access-Control-Allow-Origin", process.env.VUE_APP_BASE_URL);
        res.set(
          "Content-Security-Policy",
          `default-src 'self'; font-src 'self' https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' https://toppng.com; frame-ancestors 'none'; connect-src ${process.env.VUE_APP_AUTH_ENDPOINT} ${process.env.VUE_APP_GRAPHQL_HTTP} `
        );
    }
  }
};

app.use(history());
app.use(express.static(publicPath, staticConf));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
// Insert this so that 404 also have headers.
app.use(function(req, res) {
  res.send(404, "Resource Not Found");
});
const PORT = process.env.PORT || 443;
app.listen(PORT, () =>
  console.log(
    `App running on port ${PORT}
    `
  )
);
