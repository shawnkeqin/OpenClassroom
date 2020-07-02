<template>
  <div class="spinner">
    <div class="section">
      <h1>Opt Out</h1>
      <p>
        App users will not be able to send visit requests to your class once you
        have successfully opted out.
      </p>
      <div>
        <h5>Your YNC staff ID:</h5>
        <a-input
          v-model="faculty_id_opt_out"
          placeholder="Type your staffID here"
          style="width: 200px;"
        />
        <a-button @click="handleOptOut">Confirm</a-button>
      </div>
    </div>
    <div class="section">
      <h1>Opt In</h1>
      <p>
        App users will be able to send visit requests to your class once you
        have successfully opted in.
      </p>
      <div>
        <h5>Your YNC staff ID:</h5>
        <a-input
          v-model="faculty_id_opt_in"
          placeholder="Type your staffID here"
          style="width: 200px;"
        />
        <a-button @click="handleOptIn">Confirm</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import queries from "@/graphql/queries.gql";

export default {
  name: "FacultyStatusPage",
  data() {
    return {
      faculty_id_opt_out: "",
      faculty_id_opt_in: ""
    };
  },
  methods: {
    async handleOptOut() {
      const faculty_id = this.faculty_id_opt_out;
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
    },
    async handleOptIn() {
      const faculty_id = this.faculty_id_opt_in;
      const results = await this.$apollo.mutate({
        mutation: queries.update_faculty_active_status,
        variables: {
          faculty_id,
          active_status: true
        }
      });
      if (results.data.update_faculty.affected_rows) {
        this.$notification.success({
          key: "OPT_IN_SUCCESS",
          message: "Succesful opt-in request",
          description:
            "All your classes are now open to visit requests in this app."
        });
        this.faculty_id = "";
      } else {
        this.$notification.error({
          key: "OPT_IN_ERROR",
          message: "Opt-in error",
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
