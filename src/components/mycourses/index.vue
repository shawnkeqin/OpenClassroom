<template>
  <div class="page-wrapper">
    <h1>My courses</h1>
    <div style="display: flex; align-content: flex-start">
      <template v-for="course_group in course_groups">
        <a-card :key="course_group.id" style="margin-right: 20px; width: 350px">
          <h3>{{ course_group.course.title }}</h3>
          <p>{{ course_group.course.module_code }}</p>
          <p>{{ "Group " + course_group.group_code }}</p>
          <router-link :to="'/coursedetails/' + course_group.id"
            >Course details</router-link
          >
        </a-card>
      </template>
    </div>
  </div>
</template>

<script>
import queries from "@/graphql/queries.gql";
import store from "@/store";
export default {
  name: "coursesList",
  data() {
    return {
      course_groups: []
    };
  },
  apollo: {
    course_groups() {
      return {
        query: queries.get_course_groups_by_faculty,
        variables() {
          return {
            faculty_id: store.state.loggedInUser,
            semester_code: process.env.VUE_APP_SEMESTER_CODE
          };
        },
        update: data => data.course_group
      };
    }
  }
};
</script>
