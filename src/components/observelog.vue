<!-- <template>
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
import EventModal from "./EventModal";

export default {
  data: () => ({
    calendarPlugins: [
      DayGridPlugin,
      TimeGridPlugin,
      InteractionPlugin,
      ListPlugin
    ]
  }),
  components: { Fullcalendar },
  computed: {
    ...mapGetters(["EVENTS"])
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
      this.$modal.show(EventModal, {
        text: "This is from the component",
        event: arg.event
      });
    }
  }
};
</script>

<style scoped></style>
-->

<template>
<div>
<h1>Incoming Visits</h1>
<br />
  <incomingRequestsCard v-bind="{seminar: {module_code: 'YSC3237', title: 'Introduction to Modern Calculus', start: '0900', end: '1030', date: '2020-06-08', location_code: 'Y-CR20', desc: 'loremipsum1', visitor_capacity: 5 }, requests: [{name: 'Mira Seo', status: 'pending', profilePic: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1627&q=80'}, {id: 1, name: 'Matthew Stamp A', status: 'pending', requestMessage: 'Hello! '}, {id: 2, name: 'Matthew Stamp B', status: 'accepted', requestMessage: 'testing message feature'}, {id: 3, name: 'Somone cool', status: 'declined'}]}" />
</div>
</template>

<script>
import incomingRequestsCard from './incomingRequestsCard'
export default {
  name: "observelog",
  components: {
    incomingRequestsCard
  }

}

</script>

<style scoped>

</style>