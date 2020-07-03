<template>
  <div>
    <a-switch default-checked @change="onChange" v-bind="toggle" />
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
      @eventRender="renderEvent"
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
      eventSources: [],
      /*      config: {
        eventRender: function(event,element){
          var eventSources = []; 
          if("toggle" == checked){
              eventSources.push(this.Visits);
          }
          displayEvent = false; 
          event.className.forEach(function(element){
            if($.inArray(element,eventSources) != -1){
              displayEvent = true; 
            }
          }); 
      return displayEvent;
        }
      }, 
      eventFilter: (evt,el) => true, */
      my_visits: [],
      my_requests: [],
      course_group: [],
      my_seminars: []
    };
  },
  /*watch: {
    eventFilter(){
      this.$refs.calendar.fireMethod('rerenderEvents'); 
    }
  }, */
  components: { Fullcalendar },
  apollo: {
    my_visits: {
      query: queries.get_my_visits,
      variables: {
        visitor_id: constants.TEST_FACULTY_ID
      },
      update: data => data.visit
    },
    my_requests: {
      query: queries.get_seminars_with_visits_by_time_requested,
      variables: {
        faculty_id: constants.TEST_FACULTY_ID,
        semester_code: constants.SEMESTER_CODE_AY1819_1
      },
      update: data => data.seminar
    },
    course_group() {
      const faculty_id = constants.TEST_FACULTY_ID;
      return {
        query: queries.get_course_groups_by_faculty,
        variables: {
          faculty_id
        },
        update: data => data.course_group
      };
    },
    my_seminars() {
      const course_group_id = this.course_group[0].id;
      return {
        query: queries.get_seminars_by_course_group,
        variables: {
          course_group_id
        },
        update: data => data.seminar
      };
    }
  },
  computed: {
    Visits() {
      return this.my_visits.map(a => {
        return {
          date: a.seminar.date,
          start: a.seminar.date.toString() + "T" + a.seminar.start.toString(),
          end: a.seminar.date.toString() + "T" + a.seminar.end.toString(),
          title:
            a.seminar.course_group.course.title +
            "\n" +
            a.seminar.course_group.faculty.name +
            "\n" +
            a.seminar.location.full_name,
          id: a.id,
          // name: a.seminar.course_group.faculty.name,
          // location: a.seminar.location.full_name,
          groupId: "my_visits",
          color: "green"
        };
      });
    },
    Requests() {
      return this.my_requests.map(a => {
        return {
          date: a.date,
          start: a.date.toString() + "T" + a.start.toString(),
          end: a.date.toString() + "T" + a.end.toString(),
          title:
            a.course_group.course.title +
            "\n" +
            a.course_group.faculty.name +
            "\n" +
            a.location.full_name,
          id: a.id,
          //   name: a.course_group.faculty.name,
          //  location: a.location.full_name,
          groupId: "my_requests",
          color: "red"
        };
      });
    },
    Seminars() {
      return this.my_seminars.map(a => {
        return {
          date: a.date,
          start: a.date.toString() + "T" + a.start.toString(),
          end: a.date.toString() + "T" + a.end.toString(),
          title:
            a.course_group.course.title +
            "\n" +
            a.course_group.faculty.name +
            "\n" +
            a.location.full_name,
          //  name: a.course_group.faculty.name,
          //  location: a.location.full_name,
          groupId: "my_seminars",
          id: a.id
        };
      });
    }
  },
  created() {
    this.eventSources.push(this.Visits);
    this.eventSources.push(this.Requests);
    this.eventSources.push(this.Seminars);
    return this.eventSources;
  },
  methods: {
    handleClick(arg) {
      this.$modal.show(calendarSeminarModal, {
        event: arg.event
      });
    }
    /*   renderEvent: function(event, element) {
            // Array that will store accepted classes
            var eventAcceptedClasses = [];
            if ($('.daytime-events-checkbox').is(':checked')){
                eventAcceptedClasses.push('daytime-events');
            }
            if ($('.nighttime-events-checkbox').is(':checked')){
                eventAcceptedClasses.push('nighttime-events');
            }
            displayEvent = false;
            event.className.forEach(function(element){
                if ($.inArray(element, eventAcceptedClasses) != -1){
                    displayEvent = true;
                }
            });
            return displayEvent;
        } */
  }
};
</script>

<style scoped></style>
