
<template>
  <div id="components-modal-demo-position">
    <br /><br />
    <a-button type="primary" @click="() => (modal2Visible = true)">
      Add New Seminar
    </a-button>
    <a-modal
      v-model="modal2Visible"
      title="Vertically centered modal dialog"
      centered
      @ok="() => (modal2Visible = false)"
    >
      <div class="submit-form">
        <form @submit.prevent="submit">
          <fieldset>
            <input type="text" placeholder="course_title" v-model="course_title" />
            <input type="text" placeholder="seminar_id" v-model="seminar_id" />
            <input type="number" placeholder="id" v-model="id" />
            <input type="text" placeholder="location" v-model="location" />
            <input type="date" placeholder="date" v-model="date" />
            <input type="time" placeholder="start" v-model="start" />
            <input type="time" placeholder="end" v-model="end" />
          </fieldset>
          <input class="button-primary" type="submit" value="Send" />
        </form>
      </div>
    </a-modal>
  </div>
</template>
<script>
import gql from "graphql-tag";
//import { InMemoryCache } from "apollo-cache-inmemory";
const ADD_SEMINAR = gql`
  mutation addSeminar(
    $course_title: String!
    $seminar_id: String!
    $id: Int!
    $location: String!
    $date: Date!
    $start: Int!
    $end: Int!
  ) {
    insert_seminar(
      objects: [{ course_title: $course_title, seminar_id: $seminar_id,  id: $id,  location: $location, date: $date, start: $start, end: $end }]
    ) {
      returning {
        id
      }
    }
  }
`;

export default {
  name: "addNewSeminarModal",
  data() {
    return {
      course_title: "",
      seminar_id: "",
      id: "",
      location: "",
      date: "",
      start: "",
      end: "",
      modal2Visible: false
    };
  },
  apollo: {},
  methods: {
    submit() {
      const { course_title,seminar_id,id,location, date, start, end } = this.$data;
      this.$apollo.mutate({
        mutation: ADD_SEMINAR,
        variables: {
          course_title,
          seminar_id,
          id,
          location,
          date,
          start,
          end
        },
        refetchQueries: ["findSeminar"]
      });
      this.course_title = "";
      this.seminar_id = "";
      this.id = "";
      this.location = "";
      this.date = "";
      this.start = "";
      this.end = "";
    }
  }
};
</script>
<style scoped>
form {
  width: 50%;
}
.submit-form {
  display: flex;
  justify-content: center;
}
</style>
