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
  }
};
