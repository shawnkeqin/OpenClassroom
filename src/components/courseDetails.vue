<template>
  <div>
    <a-card style="width: 1400px">
      <!-- <courseModule /> -->
      <div>
        <h1>{{ course.title }}</h1>
        <a-card title="" :bordered="false" :key="course.module_code">
          <a-collapse default-active-key="1" :bordered="false">
            <a-collapse-panel key="2" header="Update Course Details">
              <updateCourseDetailsModal />
            </a-collapse-panel>
          </a-collapse>
          <br />
          <h2>Course Description</h2>
          <p>{{ course.desc }}</p>
          <br />
          <h2>Notes for Observers</h2>
          <a-collapse default-active-key="1" :bordered="false">
            <a-collapse-panel key="2" header="Notes">
              <p>{{ text }}</p>
            </a-collapse-panel>
          </a-collapse>
        </a-card>
      </div>
    </a-card>
    <br />
    <br />
    <h2>Upcoming Seminars</h2>
    <addNewSeminarModal />
    <br />
    <div class="list-of-seminars">
      <a-button
        :type="isActiveOn ? 'primary' : 'default'"
        @click="isActiveOn = true"
        >Active</a-button
      >
      <a-button
        :type="!isActiveOn ? 'primary' : 'default'"
        @click="isActiveOn = false"
        >Archived</a-button
      >
      <seminar-item
        v-show="isActiveOn"
        @go-to-archived="isActiveOn = false"
        v-for="seminar in active_seminars"
        :key="seminar.id"
        :seminar="seminar"
      />
      <seminar-item
        v-show="!isActiveOn"
        v-for="seminar in archived_seminars"
        :key="seminar.id"
        :seminar="seminar"
      />
    </div>
  </div>
</template>

<script>
import queries from "@/graphql/queries.gql";
import seminarItem from "./seminarItem";
import addNewSeminarModal from "./addNewSeminarModal";
// import courseModule from "./courseModule";
export default {
  name: "courseDetails",
  props: ["id"],
  components: {
    seminarItem,
    addNewSeminarModal,
    // courseModule
  },
  data: function() {
    return {
      seminars: [],
      course: {},
      isActiveOn: true
    };
  },
  apollo: {
    seminars() {
      const course_group_id = this.id;
      return {
        query: queries.get_seminars_by_course_group,
        variables: {
          course_group_id
        },
        update: data => data.seminar
      };
    },
    course() {
      const course_group_id = this.id;
      return {
        query: queries.get_course_by_course_group,
        variables: {
          course_group_id
        },
        update: data => data.course[0]
      };
    }
  }, 
  computed: {
    archived_seminars() {
      return this.seminars.filter(seminar => seminar.is_archived);
    },
    active_seminars() {
      return this.seminars.filter(seminar => !seminar.is_archived);
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
