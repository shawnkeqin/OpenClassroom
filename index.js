const { resolve } = require("path");
const history = require("connect-history-api-fallback");
const configureAPI = require("./src/api");
const express = require("express");
const app = express();

const PORT = 8080;
// // API
configureAPI(app);

// // UI
const publicPath = resolve(__dirname, "./dist");
const staticConf = { maxAge: "1d", etag: false };

app.use(express.static(publicPath, staticConf));
app.use("/", history());
console.log("PORT=", "process.env.PORT");
app.listen(process.env.PORT || 443, () =>
  console.log(`App running on port ${PORT}!`)
);
