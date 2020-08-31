import Vue from "vue";
import App from "./App.vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import VueSidebarMenu from "vue-sidebar-menu";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
import router from "./router";
import modal from "vue-js-modal";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "./assets/css/main.css";
import VueApollo from "vue-apollo";
import { createProvider } from "./vue-apollo";
import VueRx from "vue-rx";

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.config.productionTip = false;
Vue.use(VueSidebarMenu);
Vue.use(Antd);
Vue.use(modal, { dialog: true, dynamic: true });
Vue.use(VueApollo);
Vue.use(VueRx);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
  apolloProvider: createProvider()
}).$mount("#app");
