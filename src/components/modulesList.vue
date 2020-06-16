<template>


       <div class="list-of-courses">
   <course-item v-for="course_group in course_group" :key="course_group.module_code" :course_group="course_group" class="course-item">
   
    </course-item>
 
  </div>     

 


</template>

<script>
import courseItem from "./moduleItem";
//import courseDetails from "./courseDetails";
import gql from "graphql-tag";

/*
const GET_MODULES = gql`
query getModules {
   faculty_by_pk(id: "yncnjb") {
    course_groups {
      module_code
      group_code
      semester_code
      course {
        title
      }
    }
  }
}
`;
*/ 
const GET_COURSE_GROUP = gql`
query myCourseGroup {
   course_group(where: {faculty_id: {_eq: "yncnjb"}}) {
    module_code
    group_code
    course {
      title
    }
  }
}
`;

const GET_COURSE = gql`
query myCourse {
  course(where: {course_groups: {faculty_id: {_eq: "yncnjb"}}}) {
    title
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
      course: [],
      course_group : []
     
    };
  },
  apollo: {
    course: {
      query: GET_COURSE
    },
    course_group: {
      query: GET_COURSE_GROUP
    },
  }
};

</script>

<style scoped>
.list-of-courses {

  justify-content: center;
}
.course-item {
  margin: 0 10px;
}
</style>
