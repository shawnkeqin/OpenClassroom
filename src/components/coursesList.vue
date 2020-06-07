<template>
  <div class="list-of-courses">
    <course-item v-for="course in course" :key="course.module_code" :course="course" class="course-item">
   
    </course-item>
  </div>
</template>

<script>
//login page form box will determine the id which will allow the graphql query (id) to match and then retrieve all the courses linked to the id. 
//graphql query out all the information for the course - including the seminar information and display in the visible view and hidden view accordingly. 
import courseItem from "./courseItem";
import gql from "graphql-tag";
const GET_COURSES = gql`
query getCourses {
  course {
    title
    desc
    module_code
    course_groups {
      schedule_desc
      group_code
      faculty_id
      syllabus
      seminars {
        date
        start
        end
        is_open
        visitor_capacity
        title
      }
    }
  }
}
`;

export default {
  name: "coursesList",
  components: { courseItem,

   },
  data() {
    return {
      course: []
    };
  },
  apollo: {
    course: {
      query: GET_COURSES
    }
  }
};
</script>

<style>
.list-of-courses {

  justify-content: center;
}
.course-item {
  margin: 0 10px;
}
</style>