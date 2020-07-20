<template>
  <div class="page-wrapper">
    <h2>
      {{ course ? course.title : "" }}
    </h2>
    <div style="display: flex; align-items: center; margin-bottom: 5px">
      <h3 style="display: inline; margin: 0 10px 0 0">
        {{ course ? course.module_code : "" }}
      </h3>
      <!--  <a-button type="danger" size="large" @click="setAllUnavailable">
        Close Course
      </a-button> -->
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
    <a-card style="width: 35rem" :bodyStyle="{ padding: 0 }">
      <a-collapse default-active-key="1" :bordered="false">
        <a-collapse-panel key="2" header="Course description">
          <p>{{ course ? course.desc : "" }}</p>
          <updateCourseDetailsModal :course="course" />
          <b>Additional Description: </b>
          <br />
          <p>{{ course_group ? course_group.course_group_desc : "" }}</p>
        </a-collapse-panel>
      </a-collapse>
      <a-collapse default-active-key="1" :bordered="false">
        <a-collapse-panel key="2" header="Course Syllabus">
          <p>{{ course_group.syllabus }}</p>
        </a-collapse-panel>
      </a-collapse>
      <a-collapse default-active-key="1" :bordered="false">
        <a-collapse-panel key="3" header="Notes for observers">
          <p>{{ course ? course.notes : "" }}</p>
        </a-collapse-panel>
      </a-collapse>
    </a-card>
    <div style="padding-top: 20px">
      <h2>Upcoming classes</h2>
      <!-- <addNewSeminarModal /> -->
      <div class="list-of-seminars">
        <!-- <a-button
          :type="isActiveOn ? 'primary' : 'default'"
          @click="isActiveOn = true"
          >Active</a-button
        >
        <a-button
          :type="!isActiveOn ? 'primary' : 'default'"
          @click="isActiveOn = false"
          >Archived</a-button
        > -->
        <!-- <seminar-item
          v-for="seminar in active_seminars"
          :key="seminar.id"
          :seminar="seminar"
        />
        <seminar-item
          v-for="seminar in archived_seminars"
          :key="seminar.id"
          :seminar="seminar"
        /> -->
        <seminarItem
          v-for="seminar in seminars"
          :key="seminar.id"
          :seminar="seminar"
        />
      </div>
    </div>
  </div>
</template>

<script>
import queries from "@/graphql/queries.gql";
import seminarItem from "./seminarItem";
// import addNewSeminarModal from "./addNewSeminarModal";
import updateCourseDetailsModal from "./updateCourseDetailsModal";
// import courseModule from "./courseModule";
// import closeCourseAndSeminarsToggle from "./closeCourseAndSeminarsToggle";
export default {
  name: "courseDetails",
  // props: ["id"],
  components: {
    seminarItem,
    // addNewSeminarModal,
    updateCourseDetailsModal
    // closeCourseAndSeminarsToggle
    // courseModule
  },
  data: function() {
    return {
      id: this.$route.params.id,
      seminars: [],
      course_group: {},
      isToggleCourseGroupLoading: false
    };
  },
  apollo: {
    seminars() {
      const course_group_id = this.id;
      return {
        query: queries.get_seminars_by_course_group,
        variables: {
          course_group_id,
          semester_code: process.env.VUE_APP_SEMESTER_CODE
        },
        update: data => data.seminar
      };
    },
    course_group() {
      const course_group_id = this.id;
      return {
        query: queries.get_course_group_details,
        variables: {
          course_group_id,
          semester_code: process.env.VUE_APP_SEMESTER_CODE
        },
        update: data => data.course_group[0]
      };
    }
  },
  computed: {
    course() {
      return this.course_group ? this.course_group.course : null;
    }
  },
  // computed: {
  //   archived_seminars() {
  //     return this.seminars.filter(seminar => seminar.is_archived);
  //   },
  //   active_seminars() {
  //     return this.seminars.filter(seminar => !seminar.is_archived);
  //   }
  // },
  methods: {
    async toggleCourseGroupIsOpen() {
      this.isToggleCourseGroupLoading = true;
      const course_group_id = this.id;
      const current_is_open = this.course_group.is_open;
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
    },
    async setAllUnavailable() {
      const course_group_id = this.id;
      await this.$apollo.mutate({
        mutation: queries.close_all_course_seminars,
        variables: {
          course_group_id
        },
        // update: (store, { data: { update_seminartest } }) => {
        //   if (update_seminartest.affected_rows) {
        //     const data = store.readQuery({
        //       query: GET_MY_SEMINARS
        //     });
        //     const seminartest = data.seminartest;
        //     const i = seminartest.findIndex(
        //       seminar => seminar.id === this.seminartest.id
        //     );
        //     seminartest[i].archived = true;
        //     store.writeQuery({
        //       query: GET_MY_SEMINARS,
        //       data
        //     });
        //   }
        // },
        refetchQueries: ["get_seminars_by_course_group"]
      });
      this.modal2Visible = false;
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
}
.seminar-item {
  margin: 0 10px;
}
</style>
