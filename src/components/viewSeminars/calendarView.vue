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
      <a-card style="width: 10rem;">
        <div v-for="item in legendData" :key="item.value">
          <a-checkbox v-model="show[item.value]" class="checkbox-filter">
            {{ item.label }}
          </a-checkbox>
          <div
            v-for="option in item.options"
            :key="option.label"
            style="display: flex; margin: 0 0 5px 20px;"
          >
            <div
              :style="
                `background-color: ${option.color}; padding: 2px 5px; color: ${
                  item.value === 'seminars' ? 'white' : 'black'
                }`
              "
            >
              {{ option.label }}
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

const PENDING_VISIT_COLOR = "#ffb74d";
const ACCEPTED_VISIT_COLOR = "#81c784";
const NO_VISITORS_COLOR = "#40a9ff";
const WITH_VISITORS_COLOR = "#f759ab";

const legendData = [
  {
    value: "visits",
    label: "My visits",
    options: [
      {
        label: "pending",
        color: PENDING_VISIT_COLOR
      },
      {
        label: "accepted",
        color: ACCEPTED_VISIT_COLOR
      }
    ]
  },
  {
    value: "seminars",
    label: "My classes",
    options: [
      {
        label: "no visitors",
        color: NO_VISITORS_COLOR
      },
      {
        label: "with visitors",
        color: WITH_VISITORS_COLOR
      }
    ]
  }
];

export default {
  name: "calendarView",
  data() {
    return {
      calendarPlugins: [DayGridPlugin, TimeGridPlugin, InteractionPlugin],
      show: {
        visits: true,
        seminars: true
      },
      checkAll: false,
      my_visits: [],
      my_seminars: [],
      legendData,
      isModalVisible: false,
      modalData: null,
      error: ""
    };
  },
  components: { Fullcalendar, calendarSeminarModal },
  apollo: {
    // Only query for PENDING and ACCEPTED visits
    my_visits: {
      query: queries.get_my_visits,
      variables() {
        return {
          visitor_id: store.state.loggedInUser
          // Technically we should have a separate query that checks semester to be efficent as users will not view previous semesters (this query is used by other components such as my visit page that needs all semesters).
        };
      },
      update: data =>
        data.visit.filter(
          visit =>
            visit.visit_status === "PENDING" ||
            visit.visit_status === "ACCEPTED"
        ),
      error(err) {
        this.error = err;
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
      error(err) {
        this.error = err;
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
          color: a.visits.length > 0 ? WITH_VISITORS_COLOR : NO_VISITORS_COLOR,
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
      const seminars = this.show.seminars ? this.Seminars : null;
      const visits = this.show.visits ? this.Visits : null;
      return [seminars, visits].filter(x => x);
    }
  },
  watch: {
    error(err) {
      if (err.gqlError.extensions.code !== "invalid-jwt")
        this.$notification.error({
          message: "Failed to obtain data from database",
          description: err.toString(),
          duration: 0
        });
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
          return PENDING_VISIT_COLOR;
        case "ACCEPTED":
          return ACCEPTED_VISIT_COLOR;
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
  margin: 0 0 5px 0;
}
</style>
