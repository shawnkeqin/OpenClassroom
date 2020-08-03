<template>
  <div style="width: 100%; padding: 0 20px;">
    <h1>My courses</h1>
    <template v-if="$apollo.loading"><a-skeleton active/></template>
    <template v-else>
      <div class="div1" style="display: flex; align-content: flex-start">
        <template v-if="course_groups && course_groups.length">
          <a-card
            v-for="course_group in course_groups"
            :key="course_group.id"
            style="margin-right: 20px; width: 350px"
          >
            <h3>{{ course_group.course.title }}</h3>
            <p>{{ course_group.course.module_code }}</p>
            <p>{{ "Group " + course_group.group_code }}</p>
            <router-link
              style="font-size:25px; "
              :to="'/coursedetails/' + course_group.id"
              >Course details
              <a-icon style="margin-bottom: 20px;" type="right-circle"
            /></router-link>

            <a-card style="width: 250px; margin-right: 10px;">
              <p style="margin: 0 10px 0 0">
                {{
                  `This course is ${
                    course_group.is_open ? `open` : `closed`
                  } to visit requests`
                }}
              </p>
              <a-switch
                :checked="course_group.is_open"
                checked-children="open"
                un-checked-children="closed"
                :loading="isToggleCourseGroupLoading"
                @click="toggleCourseGroupIsOpen"
                style="margin-right: 5px;"
              />
              <a-tooltip
                title="Closing/opening this course will automatically close/open all of its classes."
              >
                <a-icon
                  type="exclamation-circle"
                  theme="filled"
                  class="pending"
                />
              </a-tooltip>
            </a-card>
          </a-card>
        </template>

        <template v-else>
          <div class="div1">
            <a-card>
              <p>You don't teach any course this semester</p>
            </a-card>
          </div>
        </template>
        <div class="div2">
          <a-card>
            You may change course group information, class-specific details
            (location, timings, description, etc), and close individual classes
            within each course group page.
          </a-card>
        </div>
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
      id: this.$route.params.id,
      course_groups: [],
      course_group: {},
      isToggleCourseGroupLoading: false
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
    },
    course_group() {
      const course_group_id = this.id;
      return {
        query: queries.get_course_group_details,
        variables: {
          course_group_id
        },
        update: data => data.course_group[0],
        error(error, vm, key) {
          this.$notification.error({
            key,
            message: "Failed to obtain data on your course",
            description: "Please try again."
          });
        }
      };
    }
  },
  computed: {
    course() {
      return this.course_group ? this.course_group.course : null;
    }
  },
  methods: {
    async toggleCourseGroupIsOpen() {
      this.isToggleCourseGroupLoading = true;
      const course_group_id = this.id;
      const current_is_open = this.course_group.is_open;
      try {
        await this.$apollo.mutate({
          mutation: queries.update_course_group_and_seminars_is_open,
          variables: {
            course_group_id,
            is_open: !current_is_open
          },
          refetchQueries: [
            "get_course_group_details",
            "get_seminars_by_course_group"
          ]
        });
        this.isToggleCourseGroupLoading = false;
      } catch (err) {
        this.isToggleCourseGroupLoading = false;
        this.$notification.error({
          key: "toggle_course_group_is_open_error",
          message: "Failed to update the open status of your course",
          description: "Please try again."
        });
      }
    }
  }
};
</script>

<style scoped>
.div1 {
  display: inline;
}
.div2 {
  display: inline;
}
</style>
