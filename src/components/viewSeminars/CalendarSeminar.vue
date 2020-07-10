<template>
  <div>
    <div v-if="!isMySeminar" style="display: flex; margin-bottom: 10px;">
      <div style="display: flex; align-items: center">
        <a-icon
          type="check-circle"
          theme="filled"
          class="status-icon accepted"
        />
      </div>
      <div>
        <h4 class="accepted" style="margin-bottom: 0">
          Accepted visit request
        </h4>
      </div>
    </div>
    <div
      style="display: flex; flex-direction: column; align-items: center; margin-bottom: 40px;"
    >
      <p style="margin: 3px;">
        <!--     {{ seminar.module_code }} -->
      </p>
      <h3 style="font-size: 24px;">
        {{ event.title }}
      </h3>
      <div style="margin-bottom: 3px;">
        <h4 style="display: inline; font-weight: bold;">
          <!--   {{ utils.date_format(seminar.date) + " | " }} -->
          <!--   {{ utils.date_format(event.date) + " | " }} -->
        </h4>
        <h4 style="display: inline;">
          <!--    {{
            utils.time_format(seminar.start) +
              " - " +
              utils.time_format(seminar.end) +
              " | "
          }} -->
          {{ event.start }}
          {{ event.end }}
        </h4>
      </div>
      <!--    <h5 style="display: inline">{{ seminar.location.full_name }}</h5> -->
      <h5 style="display: inline">{{ event.title }}</h5>
    </div>
    <div style="margin-bottom: 20px;">
      <h5>Class title</h5>
      <p>{{ event.title || "No seminar title" }}</p>
      <h5>Class description</h5>
      <!--   <p>{{ seminar.desc || "No seminar description" }}</p> -->
      <h5>Note for visitors</h5>
      <!--   <p>{{ course_group.notes || "None" }}</p> -->
    </div>
    <template v-if="isMySeminar && confirmedVisits.length">
      <h4 class="accepted">
        Confirmed visitors
      </h4>
      <div
        v-for="visit in confirmedVisits"
        :key="visit.id"
        style="display: flex; align-items: center; margin-bottom: 5px;"
      >
        <img
          class="avatar-small"
          :src="
            visit.visitor.profilePic ||
              'https://toppng.com/uploads/preview/app-icon-set-login-icon-comments-avatar-icon-11553436380yill0nchdm.png'
          "
        />
        <p style="margin: 0 5px;">
          {{ visit.visitor.name }}
        </p>
        <div style="display: flex; align-items: center">
          <a-icon
            type="check-circle"
            theme="filled"
            class="status-icon accepted"
            style="font-size: 15px;"
          />
        </div>
      </div>
    </template>
    <template v-else>
      <div style="margin-bottom: 20px;">
        <h5>Instructor</h5>
        <div style="display: flex; align-items: center;">
          <img
            class="avatar-medium"
            :src="
              course_group.faculty.profilePic ||
                'https://toppng.com/uploads/preview/app-icon-set-login-icon-comments-avatar-icon-11553436380yill0nchdm.png'
            "
          />
          <p style="margin: 0 5px;">
            {{ course_group.faculty.name }}
          </p>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; align-items: left;">
        <a
          href="https://library.yale-nus.edu.sg/wp-content/uploads/2014/01/campus-map_Aug2015.jpg"
          target="_blank"
          >View campus map</a
        >
        <AddToCalendar :seminar="seminar" />
      </div>
    </template>
  </div>
</template>

<script>
import utils from "@/utils";
import AddToCalendar from "./AddToCalendar";

export default {
  name: "CalendarSeminar",
  components: {
    AddToCalendar
  },
  props: {
    seminar: {
      type: Object,
      default: null
    },
    event: [],
    isMySeminar: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      utils: utils
    };
  },
  computed: {
    course_group() {
      return this.seminar.course_group;
    },
    course() {
      return this.course_group.course;
    },
    confirmedVisits() {
      return this.isMySeminar
        ? this.seminar.visits.filter(visit => visit.visit_status === "ACCEPTED")
        : [];
    }
  }
};
</script>

<style scoped>
.ant-card-hoverable {
  cursor: default;
}
.closed {
  background-color: rgba(0, 0, 0, 0.12);
}
.request-status {
  font-size: 16px;
  font-family: "Lato", sans-serif;
  font-weight: bold;
}
.placeholder {
  color: rgba(0, 0, 0, 0.37);
  font-weight: normal;
}
</style>
