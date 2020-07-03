<template>
  <div class="spinner">
    <div class="section">
      <h1>Opt Out</h1>
      <p>
        App users will not be able to send visit requests to your class once you
        have successfully opted out.
      </p>
      <div style="margin-bottom: 120px;">
        <h5>Your YNC staff ID:</h5>
        <a-input
          v-model="faculty_id"
          placeholder="Type your staffID here"
          style="width: 200px;"
        />
        <a-button @click="handleOptOut">Confirm</a-button>
      </div>
      <p>
        Or
        <router-link to="/opt-in"><a href="#">opt in</a></router-link> instead.
      </p>
    </div>
  </div>
</template>

<script>
import queries from "@/graphql/queries.gql";

export default {
  name: "OptOutPage",
  data() {
    return {
      faculty_id: ""
    };
  },
  methods: {
    async handleOptOut() {
      const faculty_id = this.faculty_id;
      const results = await this.$apollo.mutate({
        mutation: queries.update_faculty_active_status,
        variables: {
          faculty_id,
          active_status: false
        }
      });
      if (results.data.update_faculty.affected_rows) {
        this.$notification.success({
          key: "OPT_OUT_SUCCESS",
          message: "Succesful opt-out request",
          description:
            "All your classes are no longer open to visit requests in this app."
        });
        this.faculty_id = "";
      } else {
        this.$notification.error({
          key: "OPT_OUT_ERROR",
          message: "Opt-out error",
          description:
            "The server could not process your request. Please ensure that your staff ID is correct."
        });
      }
    }
  }
};
</script>

<style scoped>
.spinner {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: white;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.section {
  width: 80%;
  padding: 20px;
}
</style>
