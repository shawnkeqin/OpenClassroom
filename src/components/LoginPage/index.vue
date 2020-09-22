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
            <h3>What's your interest?</h3>
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
    <div class="screen-wrapper" style="padding-top: 20vh;">
      <div class="big-text" style="text-align: center;">
        Make a request in <br />an instant
      </div>
    </div>
    <div class="screen-wrapper" style="background: #f5f5f5; padding: 2rem;">
      <div style="text-align: center; margin: 0;">
        Automatic messaging requests a specific date and time to visit.
        <br />Easy to request, easy to reply. No pressure.
      </div>
    </div>
    <div id="mira-banner">
      <div
        style="padding: 1rem 2rem; float: left; margin-left: 55%; background: white;"
      >
        <div class="big-text" style="margin-bottom: 1rem;">
          Manage your <br />visits and <br />visitors. <br />Hassle-free.
        </div>
        <div style="width: 20rem;">
          <p>
            You control who can visit.
          </p>
          <p>
            Remove courses or individual meetings, set the number of visitors,
            or just leave the door open to colleagues and see who shows up!
          </p>
        </div>
      </div>
    </div>
    <div id="footer">
      <div style="margin-right: 5rem;">
        <div>Contact us</div>
        <div>mira.seo@yale-nus.edu.sg</div>
      </div>
      <div>
        <div>
          Photos used with permission from
          <a href="https://teaching.yale-nus.edu.sg/" target="_blank"
            >Yale-NUS Center for Teaching and Learning</a
          >
        </div>
        <div>
          Funded by a grant from
          <a href="http://nus.edu.sg/cdtl" target="_blank"
            >NUS Center for Development of Teaching and Learning</a
          >
        </div>
      </div>
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
  width: 100%;
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
#two-subcontainer-1 {
  height: 80vh;
}
#mira-banner {
  height: 100vh;
  padding-top: 4rem;
  padding-bottom: 1rem;
  background-image: url("../../assets/images/mira_banner.png");
  background-repeat: no-repeat;
  background-position: top left;
  background-size: 60rem;
  background-color: #f89829;
}
#container-four {
  padding: 6rem;
}
#footer {
  background: #e0e0e0;
  padding: 2rem 10rem;
  display: flex;
  justify-content: space-between;
}
.big-text {
  font-size: 4rem;
  font-family: "Open Sans", sans-serif;
  color: #0077c8;
  margin-bottom: 1.5rem;
}
</style>
