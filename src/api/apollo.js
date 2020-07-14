const ApolloClient = require("apollo-client").ApolloClient;
const HttpLink = require("apollo-link-http").HttpLink;
const fetch = require("node-fetch");
const InMemoryCache = require("apollo-cache-inmemory").InMemoryCache;

const createApolloClient = () => {
  const httpLink = new HttpLink({
    uri: "https://open-classroom-hasura-test.herokuapp.com/v1/graphql",
    foo: console.log("in apollo.js: " + process.env.VUE_APP_HASURA_URI),
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
}

module.exports = createApolloClient;
