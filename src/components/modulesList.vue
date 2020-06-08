<template>


       <div class="list-of-courses">
    <course-item v-for="course in course" :key="course.module_code" :course="course" class="course-item">
   
    </course-item>
  </div>     

 


</template>

<script>
import courseItem from "./moduleItem";
//import courseDetails from "./courseDetails";
import gql from "graphql-tag";

const GET_MODULES = gql`
query getModules {
  course(limit:5) {
    title
    module_code
  }
}
`;
export default {
  name: "coursesList",
  components: { courseItem,
 // courseDetails
  },
  data() {
    return {
      course: []
    };
  },
  apollo: {
    course: {
      query: GET_MODULES
    }
  }
};

</script>

<style scoped>
.list-of-courses {

  justify-content: center;
}
.-item {
  margin: 0 10px;
}
</style>
