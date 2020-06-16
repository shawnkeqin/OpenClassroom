<template>
  <div class="list-of-courses">
    <!-- <course-item
      v-for="course in course"
      :key="course.module_code"
      :course="course"
      class="course-item"
    >
    </course-item> -->
    <courseItem
      v-for="course_group in course_groups"
      :key="course_group.id"
      :course_group="course_group"
    />
  </div>
</template>

<script>
import courseItem from "./moduleItem";
//import courseDetails from "./courseDetails";
// import gql from "graphql-tag";
import queries from "../graphql/queries.gql";
import constants from "../utils/constants";

// const GET_MODULES = gql`
//   query getModules {
//     course(where: { id: { _eq: 1 } }) {
//       desc
//       id
//       title
//       module_code
//     }
//   }
// `;
export default {
  name: "coursesList",
  components: {
    courseItem
    // courseDetails
  },
  data() {
    return {
      // course: []
      course_groups: []
    };
  },
  apollo: {
    // course: {
    //   query: GET_MODULES
    // }
    course_groups() {
      const faculty_id = constants.TEST_FACULTY_ID;
      return {
        query: queries.get_course_groups_by_faculty,
        variables: {
          faculty_id
        },
        update: data => data.course_group
      };
    }
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
