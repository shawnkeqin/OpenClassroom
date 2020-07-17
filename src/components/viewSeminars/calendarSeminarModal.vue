<template>
  <div
    style="height: 100px;padding-top: 20px; padding-right: 20px; padding-bottom: 20px; padding-left: 20px"
  >
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
        {{ event.extendedProps.module_code }}
      </p>
      <h3 style="font-size: 24px;">
        {{ event.title }}
      </h3>
      <div style="margin-bottom: 3px;">
        <h4 style="display: inline;">
          {{ event.start }}
          {{ event.end }}
        </h4>
      </div>
      <h5 style="display: inline">{{ event.extendedProps.location }}</h5>
    </div>
    <div style="margin-bottom: 20px;">
      <h5>Class title</h5>
      <p>{{ event.title || "No seminar title" }}</p>
      <h5>Class description</h5>
      <p>{{ event.extendedProps.desc || "No seminar description" }}</p>

      <h5>Instructor</h5>
      <div style="display: flex; align-items: center;">
        <p style="margin: 0 5px;">
          {{ event.extendedProps.name }}
        </p>
      </div>
      <!--   <p>{{ course_group.notes || "None" }}</p> -->
    </div>
    <div style="margin-bottom: 20px;"></div>
    <template>
      <h4 class="accepted">
        Confirmed visitors
      </h4>
      <div style="display: flex; align-items: center; margin-bottom: 5px;">
        <img
          class="avatar-small"
          :src="
            'https://toppng.com/uploads/preview/app-icon-set-login-icon-comments-avatar-icon-11553436380yill0nchdm.png'
          "
        />
        <p style="margin: 0 5px;">
          {{ event.extendedProps.name }}
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
      <div style="display: flex; flex-direction: column; align-items: left;">
        <a
          href="https://library.yale-nus.edu.sg/wp-content/uploads/2014/01/campus-map_Aug2015.jpg"
          target="_blank"
          >View campus map</a
        >
      </div>
    </template>

    <!-- <fieldset>
      <legend align="center">{{ event.title }}</legend>
      <p align="center">
        <u>Seminar Details</u>
      </p>
      <p align="center">
        <b>Instructor: </b>
        {{ event.extendedProps.name }}
      </p>
      <p align="center">
        <b>Start: </b>
        {{ event.start }}
      </p>
      <p align="center">
        <b>End: </b>
        {{ event.end }}
      </p>
      <p align="center">
        <b>Location: </b>
        {{ event.extendedProps.location }}
      </p>
      <br />
    </fieldset> -->
  </div>
</template>

<script>
//import {mapGetters} from "vuex";
import utils from "@/utils";
//import queries from "@/graphql/queries.gql";
//import constants from "@/utils/constants";
export default {
  name: "calendarSeminarModal",
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
      selected: "",
      utils: utils
      //  seminar: {}
    };
  },
  computed: {
    course_group() {
      return this.seminar.course_group;
    },
    course() {
      return this.course_group.course;
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
