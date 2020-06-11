<template>
  <div>
    <sidebartwo />
    <router-view />
  </div>
</template>

<script>
//import sidebar from './components/sidebar'
import sidebartwo from "./components/sidebartwo";
//import Login from './components/login'
//import incomingRequestsCard from "./components/incomingRequestsCard"
export default {
  name: "App",
  components: {
    //  sidebar
    //Login
//incomingRequestsCard
  sidebartwo
  },
  async created() {
    try {
      await this.$auth.renewTokens();
    } catch {
      // Supress the 'not logged in' error as we can illegitimately get that
      // when processing the callback url
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
