<template>
  <sidebartwo />

  <!-- <Login /> -->
</template>

<script>
//import sidebar from './components/sidebar'
import sidebartwo from "./components/sidebartwo";
//import Login from './components/login'

export default {
  name: "App",
  components: {
    //  sidebar
    //Login

    sidebartwo
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
