<template>
 <div class="list-of-moduledesc">
 
    <moduleDesc-item v-for="course in course" :key="course.module_code" :course="course" class="moduleDesc-item">
   
    </moduleDesc-item>
      </div>

</template>

<script>
//login page form box will determine the id which will allow the graphql query (id) to match and then retrieve all the courses linked to the id.
//graphql query out all the information for the course - including the seminar information and display in the visible view and hidden view accordingly.
import moduleDescItem from "./moduleDescItem";
import gql from "graphql-tag";
const GET_MODULE = gql`
query getModules {
   course(where: {id: {_eq: 1}}) {
    desc
    id
    title
    module_code
  }
}
`
  ;
export default {
  name: "courseModule",
  components: { moduleDescItem },
  data() {
    return {
      course: []
    };
  },
  apollo: {
    course: {
      query: GET_MODULE
    }
  }
};
</script>

<style>
.list-of-moduledesc {
  justify-content: center;
}
.moduleDesc-item{
  margin: 0 10px;
}
</style>
