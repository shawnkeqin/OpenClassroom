<template>
  <div>
    <fieldset>
      <legend align="center">{{ event.title }}</legend>
      <p align="center">
        <u>Seminar Details</u>
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
        <b>ID: </b>
        {{ event.id }}
      </p>
      <p align="center">
        <b>ID: </b>
        {{ event.id }}
      </p>
      <br />
    </fieldset>
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
    event: []
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

<style scoped></style>
