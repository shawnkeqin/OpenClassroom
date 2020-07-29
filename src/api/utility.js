const ApolloClient = require("apollo-client").ApolloClient;
const HttpLink = require("apollo-link-http").HttpLink;
const fetch = require("node-fetch");
const InMemoryCache = require("apollo-cache-inmemory").InMemoryCache;
const nodemailer = require("nodemailer");

const createApolloClient = () => {
  const httpLink = new HttpLink({
    uri: process.env.VUE_APP_GRAPHQL_HTTP,
    fetch,
    headers: {
      "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET
    }
  });
  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "no-cache",
        errorPolicy: "ignore"
      },
      query: {
        fetchPolicy: "no-cache",
        errorPolicy: "all"
      }
    }
    // connectToDevTools: true
  });
};

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS
    }
  });

module.exports = {
  createApolloClient,
  createTransporter
};
