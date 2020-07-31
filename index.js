const { resolve } = require("path");
const history = require("connect-history-api-fallback");
const configureAPI = require("./src/api");
const express = require("express");
const app = express();

// The server isn't run by vue-cli-service so we need to tell it what mode we want explicitly.
require("custom-env").env(process.env.VUE_APP_MODE);

// // API
configureAPI(app);

// // UI
const publicPath = resolve(__dirname, "./dist");
const staticConf = { maxAge: "1d", etag: false };

app.use(history());
app.use(express.static(publicPath, staticConf));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(
    `App running on port ${PORT}
    `
  )
);
