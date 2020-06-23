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
      :selectable="true"
      :events="EVENTS"
      @select="handleSelect"
      @eventClick="handleClick"
    />
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
import { mapGetters } from "vuex";
import calendarSeminarModal from "./calendarSeminarModal";
import queries from "@/graphql/queries.gql";
import constants from "@/utils/constants";
export default {
  name: "calendarView",
  data: () => ({
    calendarPlugins: [
      DayGridPlugin,
      TimeGridPlugin,
      InteractionPlugin,
      ListPlugin
    ],
    mySeminars: []
  }),
  components: { Fullcalendar },
  computed: {
    ...mapGetters(["EVENTS"])
  },
  apollo: {
    mySeminars: {
      query: queries.get_my_visits,
      variables: {
        visitor_id: constants.TEST_FACULTY_ID
      },
      update: data => data.visit
    }
  },
  methods: {
    handleSelect(arg) {
      this.$store.commit("ADD_EVENT", {
        id: new Date().getTime(),
        title: "something",
        start: arg.start,
        end: arg.end,
        allDay: arg.allDay
      });
    },
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
