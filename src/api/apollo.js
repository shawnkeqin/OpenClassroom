const ApolloClient = require("apollo-client").ApolloClient;
const HttpLink = require("apollo-link-http").HttpLink;
const fetch = require("node-fetch");
const InMemoryCache = require("apollo-cache-inmemory").InMemoryCache;

const httpLink = new HttpLink({
  uri: "https://open-classroom-hasura-test.herokuapp.com/v1/graphql",
  fetch,
  headers: {
    "x-hasura-admin-secret": "openclassroom"
  }
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  // connectToDevTools: true
});

module.exports = apolloClient;
