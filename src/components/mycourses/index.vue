<template>
  <div style="width: 100%; padding: 0 0.5rem;">
    <h1>My Courses</h1>
    <template v-if="$apollo.loading">
      <a-skeleton active />
    </template>
    <template v-else>
      <template v-if="course_groups && course_groups.length">
        <div style="display: flex; justify-content: space-between;">
          <div style="display: flex; flex-wrap: wrap;">
            <a-card
              v-for="course_group in course_groups"
              :key="course_group.id"
              style="margin: 0 15px 15px 0; width: 18rem;"
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
              style="width: 14rem;"
              :bodyStyle="{ background: '#e6f7ff', color: 'black' }"
            >
              Click "Edit course details" to:
              <ul style="margin-bottom: 0">
                <li>open or close individual classes</li>
                <li>change individual class location, timing, description</li>
                <li>
                  add or modify course information such as description,
                  syllabus, notes for visitors, and tags
                </li>
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
        error(err) {
          this.$notification.error({
            message: "Failed to obtain data from database",
            description: err.toString(),
            duration: 0
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
      } catch (err) {
        this.$notification.error({
          message: "Failed to update the open status of your course",
          description: err.toString(),
          duration: 0
        });
      }
      this.isToggleCourseGroupLoading = false;
    }
  }
};
</script>

<style scoped></style>
