import Vue from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import VueSidebarMenu from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
import router from './router'
Vue.config.productionTip = false;
Vue.use(VueSidebarMenu)
Vue.use(Antd);


Vue.config.productionTip = false

new Vue({
  router, 
  render: h => h(App),
}).$mount('#app')
