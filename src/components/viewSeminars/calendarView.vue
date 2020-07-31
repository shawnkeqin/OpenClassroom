<template>
  <div v-if="$apollo.loading" style="width: 100%;"><a-skeleton active /></div>
  <div v-else style="display: flex">
    <Fullcalendar
      ref="calendar"
      :plugins="calendarPlugins"
      :header="{
        left: 'title',
        center: 'dayGridMonth, timeGridWeek, timeGridDay, listWeek',
        right: 'prev today next'
      }"
      :buttonText="{
        today: 'Today',
        month: 'Month',
        week: 'Week',
        day: 'Day',
        list: 'List'
      }"
      :event-sources="eventSources"
      :selectable="true"
      @eventClick="handleClick"
      :slotEventOverlap="false"
    />
    <a-modal v-model="isModalVisible" :footer="null">
      <calendarSeminarModal :event="modalData" />
    </a-modal>
    <div style="margin-left: 2rem;">
      <a-card style="width: 10rem; margin-bottom: 20px;">
        <div>
          <a-checkbox v-model="showMySeminars" class="checkbox-filter">
            My Classes
          </a-checkbox>
          <a-checkbox v-model="showMyVisits" class="checkbox-filter">
            My Visits
          </a-checkbox>
        </div>
      </a-card>
      <a-card style="width: 10rem;">
        <div>
          <h4>Legend</h4>
          <div v-for="item in legendData" :key="item.value">
            <h5>{{ item.label }}</h5>
            <div
              v-for="option in item.options"
              :key="option.label"
              style="display: flex; margin: 0 0 5px 10px;"
            >
              <div
                :style="
                  `background-color: ${option.color}; width: 1rem; height: 1rem; margin-right: 5px;`
                "
              />
              <div>{{ option.label }}</div>
            </div>
          </div>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script>
// require("@fullcalendar/core/main.min.css"); // we are using the style from ./calendar.css instead
require("@fullcalendar/daygrid/main.min.css");
require("@fullcalendar/timegrid/main.min.css");
import Fullcalendar from "@fullcalendar/vue";
import DayGridPlugin from "@fullcalendar/daygrid";
import TimeGridPlugin from "@fullcalendar/timegrid";
import InteractionPlugin from "@fullcalendar/interaction";
import calendarSeminarModal from "./calendarSeminarModal";
import queries from "@/graphql/queries.gql";
// import constants from "@/utils/constants";
import store from "@/store";

const legendData = [
  {
    value: "visit",
    label: "My visits",
    options: [
      {
        label: "pending",
        color: "#ffb74d"
      },
      {
        label: "accepted",
        color: "#81c784"
      },
      {
        label: "declined",
        color: "#e57373"
      },
      {
        label: "cancelled",
        color: "rgba(0, 0, 0, 0.37)"
      }
    ]
  },
  {
    value: "class",
    label: "My classes",
    options: [
      {
        label: "no visitors",
        color: "#69c0ff"
      },
      {
        id: 6,
        label: "with visitors",
        color: "#1890ff"
      }
    ]
  }
];

export default {
  name: "calendarView",
  data() {
    return {
      calendarPlugins: [DayGridPlugin, TimeGridPlugin, InteractionPlugin],
      showMySeminars: true,
      showMyVisits: true,
      checkAll: false,
      my_visits: [],
      my_requests: [],
      my_seminars: [],
      legendData,
      isModalVisible: false,
      modalData: null
    };
  },
  components: { Fullcalendar, calendarSeminarModal },
  apollo: {
    my_visits: {
      query: queries.get_my_visits,
      variables() {
        return {
          visitor_id: store.state.loggedInUser
          // Technically we should have a separate query that checks semester to be efficent as users will not view previous semesters (this query is used by other components such as my visit page that needs all semesters).
        };
      },
      update: data => data.visit,
      error(error, vm, key) {
        this.$notification.error({
          key,
          message: "Server error",
          description: "Please try again."
        });
      }
    },
    my_seminars: {
      query: queries.get_seminars_with_visits_by_time_requested,
      variables() {
        return {
          faculty_id: store.state.loggedInUser
          // semester_code: process.env.VUE_APP_SEMESTER_CODE
        };
      },
      update: data => data.seminar,
      error(error, vm, key) {
        this.$notification.error({
          key,
          message: "Server error",
          description: "Please try again."
        });
      }
    }
  },
  computed: {
    Visits() {
      const events = this.my_visits.map(a => {
        return {
          date: a.seminar.date,
          start: a.seminar.date.toString() + "T" + a.seminar.start.toString(),
          end: a.seminar.date.toString() + "T" + a.seminar.end.toString(),
          title: a.seminar.course_group.course.title,
          id: a.id,
          // className: "my_visits",
          color: this.getVisitColor(a.visit_status),
          extendedProps: {
            faculty: a.seminar.course_group.faculty,
            course_group: a.seminar.course_group,
            seminar: a.seminar,
            my_visit: a
          }
        };
      });
      return {
        events,
        textColor: "rgba(0, 0, 0, 0.87)"
      };
    },
    Seminars() {
      const events = this.my_seminars.map(a => {
        return {
          date: a.date,
          start: a.date.toString() + "T" + a.start.toString(),
          end: a.date.toString() + "T" + a.end.toString(),
          title: a.course_group.course.title,
          // className: "my_seminars",
          color: a.visits.length > 0 ? "#1890ff" : "#69c0ff",
          id: a.id,
          extendedProps: {
            faculty: a.course_group.faculty,
            course_group: a.course_group,
            seminar: a,
            my_visitors: a.visits
          }
        };
      });
      return {
        events,
        textColor: "white"
      };
    },
    eventSources() {
      const requests = this.showMyRequests ? this.Requests : null;
      const seminars = this.showMySeminars ? this.Seminars : null;
      const visits = this.showMyVisits ? this.Visits : null;
      return [requests, seminars, visits].filter(x => x);
    }
  },
  methods: {
    handleClick(arg) {
      this.modalData = arg.event;
      this.isModalVisible = true;
    },
    getVisitColor(visit_status) {
      switch (visit_status) {
        case "PENDING":
          return "#ffb74d";
        case "ACCEPTED":
          return "#81c784";
        case "DECLINED":
          return "#e57373";
        default:
          return "rgba(0, 0, 0, 0.37)";
      }
    }
  }
};
</script>

<style scoped>
@import "./calendar.css";
.checkbox-filter {
  display: block;
  color: rgba(0, 0, 0, 0.54);
  margin-left: 0px;
}
</style>
