<template>
  <div id="wrapper">
    <div id="container" v-if="!isLoading">
      <template v-if="success">
        <h1>You have opted out successfully</h1>
        <p>
          All your classes are now closed to visit requests by Open Classroom
          Project users
        </p>
      </template>
      <template v-else>
        <h1>Unsuccessful request</h1>
        <p>We could not process your opt-out request. Please try again.</p>
      </template>
      <img
        src="../../public/logo_text.png"
        style="width: 10rem; margin-top: 1.5rem;"
      />
    </div>
  </div>
</template>

<script>
import jwt from "jsonwebtoken";

export default {
  name: "OptOutPage",
  data() {
    return {
      token: this.$route.query.token,
      isLoading: false,
      success: false
    };
  },
  computed: {
    faculty_id() {
      return this.token && jwt.decode(this.token).faculty_id;
    }
  },
  async created() {
    if (!this.token) {
      this.$router.push("login");
    };
    this.isLoading = true;
    const optOutUrl = new URL(
      `/api/faculty-status/opt-out?token=${this.token}`,
      process.env.VUE_APP_BASE_URL
    );
    try {
      const response = await fetch(optOutUrl, {
        method: "POST"
      }).then(res => res.json());
      if (response.success) {
        this.success = true;
        this.isLoading = false;
      } else throw "err";
    } catch (err) {
      this.success = false;
      this.isLoading = false;
    }
  }
};
</script>

<style scoped>
#container {
  background: white;
  padding: 60px 80px;
  text-align: center;
}
#wrapper {
  background-image: linear-gradient(315deg, #f3c9bc 0%, #f5e4b3 74%);
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
