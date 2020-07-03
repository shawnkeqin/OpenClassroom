<template>
  <div>
    <!-- <div>
      <div :style="{ borderBottom: '1px solid #E9E9E9' }">
        <a-checkbox
          :indeterminate="indeterminate"
          :checked="checkAll"
          @change="onCheckAllChange"
        >
          Check all
        </a-checkbox>
      </div>
      <br />
      <a-checkbox-group
        v-model="checkedList"
        :options="plainOptions"
        @change="onChange"
      />
    </div> -->
    <div>
      <a-checkbox @change="onChange" v-model="checkedBox">
        My Requests
      </a-checkbox>
      <a-checkbox @change="onChangeTwo" v-model="checkedBoxTwo">
        My Seminars
      </a-checkbox>
      <a-checkbox @change="onChangeThree" v-model="checkedBoxThree">
        My Vists
      </a-checkbox>
    </div>
    <br />
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
    />
    <!--  <calendarSeminarModal
      v-for="visit in myVisits"
      :visit="visit"
      :key="visit.id"
    /> -->
    <modals-container :adaptive="true" :width="1000" :height="1000" />
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
//import CalendarSeminar from "./CalendarSeminar";
import queries from "@/graphql/queries.gql";
import constants from "@/utils/constants";
const plainOptions = ["My Seminars", "My Visits", "My Requests"];
const defaultCheckedList = ["My Seminars", "My Visits"];

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
      checkedList: defaultCheckedList,
      checkedBox: false,
      checkedBoxTwo: false,
      checkedBoxThree: false,
      indeterminate: true,
      checkAll: false,
      plainOptions,
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
          title: a.seminar.course_group.course.title,
          id: a.id,
          //  name: a.seminar.course_group.faculty.name,
          //  location: a.seminar.location.full_name,
          className: "my_visits",
          color: "green",
          extendedProps: {
            name: a.seminar.course_group.faculty.name.toString(),
            location: a.seminar.location.full_name.toString()
          }
        };
      });
    },
    Requests() {
      return this.my_requests.map(a => {
        return {
          date: a.date,
          start: a.date.toString() + "T" + a.start.toString(),
          end: a.date.toString() + "T" + a.end.toString(),
          title: a.course_group.course.title,
          id: a.id,
          // name: a.course_group.faculty.name,
          // location: a.location.full_name,
          className: "my_requests",
          color: "red",
          extendedProps: {
            name: a.course_group.faculty.name.toString(),
            location: a.location.full_name.toString()
          }
        };
      });
    },
    Seminars() {
      return this.my_seminars.map(a => {
        return {
          date: a.date,
          start: a.date.toString() + "T" + a.start.toString(),
          end: a.date.toString() + "T" + a.end.toString(),
          title: a.course_group.course.title,
          // name: a.course_group.faculty.name,
          // location: a.location.full_name,
          className: "my_seminars",
          id: a.id,
          extendedProps: {
            name: a.course_group.faculty.name.toString(),
            location: a.location.full_name.toString()
          }
        };
      });
    }
  },
  /* created() {
    this.eventSources.push(this.Visits);
    this.eventSources.push(this.Requests);
    this.eventSources.push(this.Seminars);
    return this.eventSources;
  }, */
  methods: {
    handleClick(arg) {
      this.$modal.show(calendarSeminarModal, {
        event: arg.event
      });
      /* this.$modal.show(CalendarSeminar, {
        event: arg.event
      }); */
    },
    /* onChange(checkedList) {
      this.indeterminate =
        !!checkedList.length && checkedList.length < plainOptions.length;
      this.checkAll = checkedList.length === plainOptions.length;
    }, */
    /*  onCheckAllChange(e) {
      Object.assign(this, {
        checkedList: e.target.checked ? plainOptions : [],
        indeterminate: false,
        checkAll: e.target.checked
      });
    }, */
    onChange(e) {
      console.log(`checked = ${e.target.checked}`);
      Object.assign(this, {
        checkedBox: e.target.checked
          ? this.eventSources.push(this.Requests)
          : this.eventSources.pop(this.Requests)
      });
      return this.eventSources;
    },
    onChangeTwo(e) {
      console.log(`checked = ${e.target.checked}`);
      Object.assign(this, {
        checkedBoxTwo: e.target.checked
          ? this.eventSources.push(this.Seminars)
          : this.eventSources.pop(this.Seminars)
      });
      return this.eventSources;
    },
    onChangeThree(e) {
      console.log(`checked = ${e.target.checked}`);
      Object.assign(this, {
        checkedBoxThree: e.target.checked
          ? this.eventSources.push(this.Visits)
          : this.eventSources.pop(this.Visits)
      });
      return this.eventSources;
    }
  }
};
</script>

<style scoped></style>
