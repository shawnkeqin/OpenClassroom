const api = require("./src/api");

module.exports = {
  devServer: {
    before: api
  },
  pluginOptions: {
    apollo: {
      enableMocks: true,
      enableEngine: true
    }
  },
  configureWebpack: { output: { filename: "[name].[hash].bundle.js" } }
};
