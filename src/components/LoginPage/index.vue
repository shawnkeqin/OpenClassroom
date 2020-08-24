<template>
  <div>
    <div id="container-one">
      <div
        style="width: 100%; height: 10vh; background-color: rgba(0, 0, 0, .2); display: flex; justify-content: center;"
      >
        <div
          class="one-subcontainer"
          style="display: flex; justify-content: space-between; align-items: flex-end; padding: 10px 20px;"
        >
          <img src="../../assets/logo_text_white.png" style="height: 100%;" />
          <h3 style="color: white;">
            Designed by Yale-NUS faculty for Yale-NUS faculty
          </h3>
        </div>
      </div>
      <div class="screen-wrapper one-subcontainer">
        <div
          style="display: flex; justify-content: space-between; height: 70vh; width: 100%;"
        >
          <div
            class="big-text"
            style=" color: white; display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-start; height: 100%; padding: 2rem;"
          >
            Teaching <br />observation <br />made easy
          </div>
          <div
            style="display: flex; align-items: flex-end; padding: 1rem; height: 100%;"
          >
            <LoginCard />
          </div>
        </div>
        <div
          style="height: 20vh; width: 100%; bottom: 0; background: white; padding: 1.5rem 1.5rem 0 1.5rem; display: flex; justify-content: space-between; align-items: flex-end;"
        >
          <div style="width: 100%;">
            <h3 class="desc">What's your interest?</h3>
            <p>
              Heard something great about a colleague’s course?<br />
              Curious about how others are teaching on Zoom?<br />
              Want to attend a Common Curriculum lecture on the Ramayana?
            </p>
          </div>
          <div>
            <p>
              Search the schedule by course title, faculty member, major, or
              special feature and find out who's open to visitors!
            </p>
          </div>
        </div>
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
    <div id="container-three">
      <div
        class="big-text"
        style="color: white; padding: 2rem; left: 50%; position: absolute;"
      >
        Manage your <br />visits and <br />visitors. <br />Hassle-free.
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
}
#container-one {
  height: 100vh;
  background-image: url("../../assets/images/Kate-teaching.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.one-subcontainer {
  width: 60rem;
}
#container-two {
  height: 80vh;
}
#container-three {
  height: 70vh;
  background-image: url("../../assets/images/mira_banner.png");
  background-repeat: no-repeat;
  background-position: center;
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
</style>
