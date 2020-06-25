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
      :events="seminars"
      :selectable="true"
      @eventClick="showEvent"
    />
    <!--  <calendarSeminarModal
      v-for="visit in myVisits"
      :visit="visit"
      :key="visit.id"
    /> -->
    <modal-containers />
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
      seminars: [],
      // hello: [{ date: "2019-04-01" }, { date: "2019-04-02" }],

      eventDisplay: "block"
    };
  },
  components: { Fullcalendar },
  apollo: {
    seminars: {
      query: queries.get_my_visited_request_seminars,
      variables: {
        visitor_id: constants.TEST_FACULTY_ID
      }
    }
  },
  methods: {
    handleClick(arg) {
      this.$modal.show(calendarSeminarModal, {
        text: "This is from the component",
        event: arg.event
      });
    }
  }
};
</script>

<style scoped></style>
