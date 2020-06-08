<template>
  <div class="list-of-seminars">
    <seminar-item
      v-for="seminartest in seminartest"
      :key="seminartest.seminar_id"
      :seminartest="seminartest"
      class="faculty-item"
    >
 
    </seminar-item>
  </div>
</template>

<script>
//login page form box will determine the id which will allow the graphql query (id) to match and then retrieve all the courses linked to the id.
//graphql query out all the information for the course - including the seminar information and display in the visible view and hidden view accordingly.
import seminarItem from "./seminarItem";
import gql from "graphql-tag";
const GET_MY_SEMINARS = gql`
query findSeminar{
   	seminartest(limit: 3){
       course_title
       seminar_id
        date
        end
        location
        start
     }
  }`
  ;
export default {
  name: "courseSeminarsList",
  components: { seminarItem },
  data() {
    return {
      seminartest: []
    };
  },
  apollo: {
    seminartest: {
      query: GET_MY_SEMINARS
    }
  }
};
</script>

<style>
.list-of-seminars {
  justify-content: center;
}
.seminar-item {
  margin: 0 10px;
}
</style>
