// The server isn't run by vue-cli-service so we need to tell it what mode we want explicitly.
// require("custom-env").env();
require("custom-env").env("local");
require("custom-env").env(process.env.VUE_APP_MODE);

const { resolve } = require("path"),
  history = require("connect-history-api-fallback"),
  configureAPI = require("./src/api"),
  express = require("express"),
  app = express();

// // API
app.disable("x-powered-by");
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
        res.set(
          "Access-Control-Allow-Origin",
          process.env.VUE_APP_BASE_URL_LOCALHOST
        );
        res.set(
          "Content-Security-Policy",
          `default-src 'self'; font-src 'self' https://fonts.gstatic.com; style-src 'self' https://fonts.googleapis.com; img-src 'self' https://toppng.com blob: data:; frame-ancestors 'none'; connect-src 'self' ${process.env.VUE_APP_AUTH_ENDPOINT} ${process.env.VUE_APP_GRAPHQL_HTTP};`
        );
        res.set("X-XSS-Protection", "1");
        res.set("X-Content-Type-Options", "nosniff");
    }
  }
};

app.use(history());
app.use(express.static(publicPath, staticConf));
// Insert this so that 404 also have headers.
app.use(function(req, res) {
  switch (process.env.VUE_APP_MODE) {
    case "staging-test":
    case "production":
      res.header(
        "Access-Control-Allow-Origin",
        process.env.VUE_APP_BASE_URL_LOCALHOST
      );
      res.header("X-XSS-Protection", "1");
      res.header("X-Content-Type-Options", "nosniff");
      res.send(404, "Resource Not Found");
  }
});

var PORT = process.env.PORT || 443;
if (process.env.VUE_APP_MODE == "production") {
  PORT = 83;
}
app.listen(PORT, () =>
  console.log(
    `App running on port ${PORT}
    `
  )
);
