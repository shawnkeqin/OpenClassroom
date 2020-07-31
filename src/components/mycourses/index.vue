<template>
  <div style="width: 100%; padding: 0 20px;">
    <h1>My courses</h1>
    <template v-if="$apollo.loading"><a-skeleton active/></template>
    <template v-else>
      <div style="display: flex; align-content: flex-start">
        <template v-if="course_groups && course_groups.length">
          <a-card
            v-for="course_group in course_groups"
            :key="course_group.id"
            style="margin-right: 20px; width: 350px"
          >
            <h3>{{ course_group.course.title }}</h3>
            <p>{{ course_group.course.module_code }}</p>
            <p>{{ "Group " + course_group.group_code }}</p>
            <router-link :to="'/coursedetails/' + course_group.id"
              >Course details</router-link
            >
          </a-card>
        </template>
        <template v-else>
          <a-card>
            <p>You don't teach any course this semester</p>
          </a-card>
        </template>
      </div>
    </template>
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
        update: data => data.course_group,
        error(error, vm, key) {
          this.$notification.error({
            key,
            message: "Failed to obtain data on your courses",
            description: "Please try again."
          });
        }
      };
    }
  }
};
</script>
