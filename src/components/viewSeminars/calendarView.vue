<template>
  <div>
    <Fullcalendar
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
      :events="newData"
      :selectable="true"
      @eventClick="handleClick"
    />
    <!--  <calendarSeminarModal
      v-for="visit in myVisits"
      :visit="visit"
      :key="visit.id"
    /> -->
    <modals-container />
  </div>
</template>

<script>
require("@fullcalendar/core/main.min.css");
require("@fullcalendar/daygrid/main.min.css");
require("@fullcalendar/timegrid/main.min.css");
import Fullcalendar from "@fullcalendar/vue";
import DayGridPlugin from "@fullcalendar/daygrid";
import TimeGridPlugin from "@fullcalendar/timegrid";
import InteractionPlugin from "@fullcalendar/interaction";
import ListPlugin from "@fullcalendar/list";
import calendarSeminarModal from "./calendarSeminarModal";
import queries from "@/graphql/queries.gql";
import constants from "@/utils/constants";

export default {
  name: "calendarView",

  data() {
    return {
      calendarPlugins: [
        DayGridPlugin,
        TimeGridPlugin,
        InteractionPlugin,
        ListPlugin
      ],
      seminar: [],
      eventDisplay: "block"
    };
  },
  components: { Fullcalendar },
  apollo: {
    seminar: {
      query: queries.get_my_visited_request_seminars,
      variables: {
        visitor_id: constants.TEST_FACULTY_ID
      }
    }
  },
  computed: {
    newData() {
      console.log(this.seminar);

      return this.seminar.map(a => {
        return {
          date: a.date,
          start: a.date.toString() + "T" + a.start.toString(),
          end: a.date.toString() + "T" + a.end.toString(),
          title: a.course_group.course.title,
          id: a.id
        };
      });
    }
  },
  methods: {
    handleClick(arg) {
      this.$modal.show(calendarSeminarModal, {
        event: arg.event
      });
    }
  }
};
</script>

<style scoped></style>
