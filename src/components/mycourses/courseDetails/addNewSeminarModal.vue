
<template>
  <div id="components-modal-demo-position">
    <br /><br />
    <a-button type="primary" @click="() => (modal2Visible = true)">
      Add New Seminar
    </a-button>
    <a-modal
      v-model="modal2Visible"
      title="Add New Seminar"
      centered
      @ok="() => (modal2Visible = false)"
    >
      <div class="submit-form">
        <form @submit.prevent="submit">
          <fieldset>
            <input type="text" placeholder="Course Title" v-model="course_title" />
            <input type="text" placeholder="Seminar ID" v-model="seminar_id" />
         <!--   <input type="number" placeholder="id" v-model="id" /> -->
            <input type="text" placeholder="Location" v-model="location" />
             <input type="date" placeholder="Date" v-model="date" />  
         <input type="time" placeholder="Start Time" v-model="start" />
            <input type="time" placeholder="End Time" v-model="end" />
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
    $location: String!
    $date: String!
    $start: String!
    $end: String!
  

  ) {
    insert_seminartest(
      objects: [{ course_title: $course_title, seminar_id: $seminar_id, location: $location, date: $date, start: $start, end: $end }]
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
      const { course_title,seminar_id,location, date,start,end} = this.$data;
      this.$apollo.mutate({
        mutation: ADD_SEMINAR,
        variables: {
          course_title,
          seminar_id,
          location,
          date,
          start,
          end
      //    date
         
        },
        refetchQueries: ["getSeminars"]
      });
      this.course_title = "";
      this.seminar_id = "";
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
