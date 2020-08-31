<template>
  <div style="width: 100%; padding: 0 20px;">
    <h1>My courses</h1>
    <template v-if="$apollo.loading">
      <a-skeleton active />
    </template>
    <template v-else>
      <template v-if="course_groups && course_groups.length">
        <div style="display: flex;">
          <div style="display: flex; flex-wrap: wrap;">
            <a-card
              v-for="course_group in course_groups"
              :key="course_group.id"
              style="margin: 0 15px 15px 0; width: 16rem;"
            >
              <h3>{{ course_group.course.title }}</h3>
              <p>{{ course_group.course.module_code }}</p>
              <p>{{ "Group " + course_group.group_code }}</p>
              <p>
                <router-link :to="'/coursedetails/' + course_group.id"
                  >Edit course details</router-link
                >
              </p>
              <div style="display: flex;">
                <p style="margin-right: 5px;">
                  {{ `Toggle here to open/close this course to all visitors` }}
                </p>
                <div style="display: flex; align-items: center;">
                  <a-switch
                    :checked="course_group.is_open"
                    checked-children="open"
                    un-checked-children="closed"
                    :loading="isToggleCourseGroupLoading"
                    @click="
                      toggleCourseGroupIsOpen(
                        course_group.id,
                        course_group.is_open
                      )
                    "
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
                </div>
              </div>
            </a-card>
          </div>
          <div>
            <a-card
              style="width: 13rem;"
              :bodyStyle="{ background: '#e6f7ff', color: 'black' }"
            >
              Click "Edit course details" to:
              <ul style="margin-bottom: 0">
                <li>open or close individual classes</li>
                <li>change individual class location, timing, description</li>
                <li>add or modify course information</li>
              </ul>
            </a-card>
          </div>
        </div>
      </template>
      <template v-else>
        <div>
          <a-card>
            <p>You don't teach any course this semester</p>
          </a-card>
        </div>
      </template>
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
      course_groups: [],
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
    }
  },
  computed: {
    course() {
      return this.course_group ? this.course_group.course : null;
    }
  },
  methods: {
    async toggleCourseGroupIsOpen(id, status) {
      this.isToggleCourseGroupLoading = true;

      const course_group_id = id;
      const current_is_open = status;
      console.log(id);
      console.log(current_is_open);
      try {
        await this.$apollo.mutate({
          mutation: queries.update_course_group_and_seminars_is_open,
          variables: {
            course_group_id,
            is_open: !current_is_open
          },
          refetchQueries: [
            "get_course_groups_by_faculty",
            "get_seminars_by_course_group",
            "get_course_group_details"
          ]
        });
        this.isToggleCourseGroupLoading = false;
      } catch (err) {
        this.isToggleCourseGroupLoading = false;
        this.$notification.error({
          key: "toggle_course_group_is_open_error",
          message: "Failed to update the open status of your course",
          description: "Please try again." + err
        });
      }
    }
  }
};
</script>

<style scoped></style>
