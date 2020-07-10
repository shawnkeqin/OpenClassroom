import Vue from "vue";
import App from "./App.vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import VueSidebarMenu from "vue-sidebar-menu";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
import router from "./router";
// import store from "./store/store";
import modal from "vue-js-modal";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
// import { ApolloClient } from "apollo-client";
// import { HttpLink } from "apollo-link-http";
// import { InMemoryCache } from "apollo-cache-inmemory";
// import AuthPlugin from "./plugins/auth";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "./assets/css/main.css";
import VueApollo from "vue-apollo";
import { createProvider } from "./vue-apollo";
// Vue.use(AuthPlugin);
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.config.productionTip = false;
Vue.use(VueSidebarMenu);
Vue.use(Antd);
Vue.use(modal, { dialog: true, dynamic: true });
Vue.use(VueApollo);

Vue.config.productionTip = false;

// const httpLink = new HttpLink({
//   uri: "https://open-classroom-hasura-test.herokuapp.com/v1/graphql",
//   headers: {
//     "x-hasura-admin-secret": "openclassroom"
//   }
// });

// export const apolloClient = new ApolloClient({
//   link: httpLink,
//   cache: new InMemoryCache(),
//   connectToDevTools: true
// });

// const apolloProvider = new VueApollo({
//   defaultClient: apolloClient
// });

new Vue({
  router,
  // apolloProvider,
  render: h => h(App),
  apolloProvider: createProvider()
  // store
}).$mount("#app");
