const { resolve } = require("path");
const history = require("connect-history-api-fallback");
const configureAPI = require("./src/api");
const express = require("express");
const app = express();

require("custom-env").env(true);

// // API
configureAPI(app);

// // UI
const publicPath = resolve(__dirname, "./dist");
const staticConf = { maxAge: "1d", etag: false };

app.use(express.static(publicPath, staticConf));
app.use("/", history());

console.log("env: PORT=", process.env.PORT);
const PORT = process.env.PORT || 443;
app.listen(PORT, () =>
  console.log(
    `App running on port ${PORT} with:\n
    NODE_ENV=${process.env.NODE_ENV}\n
    `
  )
);
