<template>
  <div style="width: 80%;">
    <h2>
      {{ course ? course.title : "" }}
    </h2>
    <div>
      <h3 style="margin: 0 10px 0 0">
        {{ course ? course.module_code : "" }}
      </h3>
      <p>
        {{
          `Teaching mode: ${constants.TEACHING_MODES[
            course_group.teaching_mode
          ] || "NA"}`
        }}
      </p>
    </div>
    <div style="display: flex; align-items: center; padding-bottom: 5px;">
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
        <a-icon type="exclamation-circle" theme="filled" class="pending" />
      </a-tooltip>
    </div>
    <a-card style="width:100%" :bodyStyle="{ padding: 0 }">
      <a-collapse v-model="activeKey" :bordered="false">
        <a-collapse-panel key="1">
          <template slot="header">
            <h4 style="margin: 0;">Course Description</h4>
          </template>
          <p>{{ course && (course.desc || "None") }}</p>
          <h5 style="margin: 0; margin-right: 10px;">
            Additional Description
          </h5>
          <p>{{ course_group.course_group_desc || "" }}</p>
          <updateCourseGroupDescModal :course_group="course_group" />
        </a-collapse-panel>
        <a-collapse-panel key="2">
          <template slot="header">
            <h4 style="margin: 0;">Course Syllabus</h4>
          </template>
          <p>{{ course_group.syllabus || "None" }}</p>
        </a-collapse-panel>
        <a-collapse-panel key="3">
          <template slot="header">
            <h4 style="margin: 0;">
              Notes for Observers
            </h4>
          </template>
          <p>{{ course && (course.notes || "None") }}</p>
          <updateCourseGroupNotesModal :course_group="course_group" />
        </a-collapse-panel>
      </a-collapse>
    </a-card>
    <div style="padding-top: 40px">
      <h2>Upcoming classes</h2>
      <updateVisitorCapacityBulk :id="id" />
      <div class="list-of-seminars">
        <SeminarsTable :seminars="seminars" :course_group="course_group" />
      </div>
    </div>
  </div>
</template>

<script>
import queries from "@/graphql/queries.gql";
import constants from "@/utils/constants";
import updateCourseGroupDescModal from "./updateCourseGroupDescModal";
import updateCourseGroupNotesModal from "./updateCourseGroupNotesModal";
import updateVisitorCapacityBulk from "./updateVisitorCapacityBulk";
import SeminarsTable from "./SeminarsTable";

export default {
  name: "courseDetails",
  components: {
    SeminarsTable,
    updateCourseGroupDescModal,
    updateCourseGroupNotesModal,
    updateVisitorCapacityBulk
  },
  data() {
    return {
      constants,
      id: this.$route.params.id,
      activeKey: ["1", "2", "3"],
      seminars: [],
      course_group: {},
      isToggleCourseGroupLoading: false
    };
  },
  apollo: {
    seminars() {
      const course_group_id = this.id;
      const date_lower_bound = new Date(Date.now())
        .toLocaleDateString("en-GB", { timeZone: "Asia/Singapore" })
        .split("/")
        .reverse()
        .join("-");
      return {
        query: queries.get_seminars_by_course_group,
        variables: {
          course_group_id,
          date_lower_bound
        },
        update: data => data.seminar,
        error(error, vm, key) {
          this.$notification.error({
            key,
            message: "Failed to obtain data on your classes",
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
.list-of-moduledesc {
  justify-content: center;
}
.moduleDesc-item {
  margin: 0 10px;
}
.list-of-seminars {
  justify-content: center;
  margin-bottom: 80px;
}
.seminar-item {
  margin: 0 10px;
}
</style>
