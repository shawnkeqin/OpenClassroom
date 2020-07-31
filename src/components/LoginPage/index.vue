<template>
  <div>
    <div id="container-one" class="screen-wrapper">
      <div
        style="display: flex; justify-content: space-between; height: 80vh; width: 100%;"
      >
        <div
          class="big-text"
          style="display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-start; height: 100%; padding: 2rem;"
        >
          Class <br />observation <br />made easy
        </div>
        <div
          style="display: flex; align-items: center; margin: 1rem; height: 100%;"
        >
          <LoginCard />
        </div>
      </div>
      <div
        style="height: 20vh; width: 100%; bottom: 0; background: white; padding: 2rem;"
      >
        <h3 class="desc">What's your interest?</h3>
        <p class="desc">
          Search the schedule by course title, faculty member, major, or
          <br />special feature and find out who's open to visitors!
        </p>
      </div>
    </div>
    <div id="container-two" class="screen-wrapper">
      <div class="big-text" style="text-align: center;">
        Make a request in <br />an instant
      </div>
      <p class="desc" style="text-align: center;">
        Automatic messaging requests a specific date and time to visit.
        <br />Easy to request, easy to reply. No pressure.
      </p>
    </div>
    <div id="container-three" class="screen-wrapper">
      <div style="display: flex; width: 100%;">
        <div
          style="width: 40%; display: flex; flex-direction: column; justify-content: center;"
        >
          <div style="height: 70%; background: orange;" />
        </div>
        <div class="big-text" style="padding: 2rem;">
          Manage your <br />visits and <br />visitors. <br />Hassle-free.
        </div>
      </div>
    </div>
    <div id="container-four" class="screen-wrapper">
      <p class="desc" style="width: 20rem; text-align: center;">
        You control who can visit. Remove courses or individual meetings, set
        the number of visitors, or just leave the door open to colleagues and
        see who shows up!
      </p>
    </div>
    <div id="footer" class="screen-wrapper">
      <div>Contact us</div>
    </div>
  </div>
</template>

<script>
import LoginCard from "./LoginCard";
export default {
  name: "Login",
  components: { LoginCard },
  data() {
    return {};
  },
  methods: {}
};
</script>
<style>
.screen-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 10rem;
}
#container-one {
  height: 100vh;
  background-image: linear-gradient(315deg, #f3c9bc 0%, #f5e4b3 74%);
}
#container-two {
  height: 80vh;
}
#container-three {
  height: 60vh;
}
#container-four {
  padding: 6rem;
}
#footer {
  background: #e0e0e0;
  padding: 2rem;
}
.big-text {
  font-size: 4rem;
  font-family: "Open Sans", sans-serif;
  color: #0077c8;
  margin-bottom: 1.5rem;
}
/* .desc {
  font-size: 1rem;
} */
</style>
