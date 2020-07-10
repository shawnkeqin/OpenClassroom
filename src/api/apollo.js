const ApolloClient = require("apollo-client").ApolloClient;
const HttpLink = require("apollo-link-http").HttpLink;
const fetch = require("node-fetch");
const InMemoryCache = require("apollo-cache-inmemory").InMemoryCache;

const httpLink = new HttpLink({
  uri: process.env.HASURA_URI,
  fetch,
  headers: {
    "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET
  }
});

const apolloClient = new ApolloClient({
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

module.exports = apolloClient;
