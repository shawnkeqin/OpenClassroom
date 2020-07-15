<template>
  <div>
    <div class="section">
      <h1>Opt In</h1>
      <p>
        App users will be able to send visit requests to your class once you
        have successfully opted in.
      </p>
      <div style="margin-bottom: 120px;">
        <p>{{ `Your YNC staff ID: ${faculty_id}` }}</p>
        <!-- <a-input
          v-model="faculty_id"
          placeholder="Type your staffID here"
          style="width: 200px;"
        /> -->
        <a-button @click="handleOptIn">Confirm</a-button>
      </div>
      <p>
        Or
        <router-link to="/opt-out"><a href="#">opt out</a></router-link> instead.
      </p>
    </div>
  </div>
</template>

<script>
// import queries from "@/graphql/queries.gql";
import jwt from "jsonwebtoken";

export default {
  name: "FacultyStatusPage",
  data() {
    return {
      token: this.$route.query.token,
    };
  },
  computed: {
    faculty_id() {
      return this.token && jwt.decode(this.token).faculty_id;
    }
  },
  methods: {
    async handleOptIn() {
      // const faculty_id = this.faculty_id;
      // const results = await this.$apollo.mutate({
      //   mutation: queries.update_faculty_active_status,
      //   variables: {
      //     faculty_id,
      //     active_status: true
      //   }
      // });
      // if (results.data.update_faculty.affected_rows) {
      //   this.$notification.success({
      //     key: "OPT_IN_SUCCESS",
      //     message: "Succesful opt-in request",
      //     description:
      //       "All your classes are now open to visit requests in this app."
      //   });
      //   this.faculty_id = "";
      // } else {
      //   this.$notification.error({
      //     key: "OPT_IN_ERROR",
      //     message: "Opt-in error",
      //     description:
      //       "The server could not process your request. Please ensure that your staff ID is correct."
      //   });
      // }
    }
  }
};
</script>

<style scoped>
.section {
  width: 80%;
  padding: 20px;
}
</style>
