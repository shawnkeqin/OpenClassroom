<template>
  <div>
    {{ seminar.module_code }}
    <fieldset>
      <legend>EVENT DETAILS</legend>
      <b>Title:</b>{{ seminar.title }} <br />
      <b>Start: </b> {{ utils.time_format(seminar.start) }} <br />
      <b>End: </b>{{ utils.time_format(seminar.end) }} <br />
    </fieldset>
  </div>
</template>

<script>
//import {mapGetters} from "vuex";
import utils from "@/utils";
import queries from "@/graphql/queries.gql";
export default {
  name: "calendarSeminarModal",
  props: ["visit"],
  data: function() {
    return {
      selected: "",
      utils: utils,
      seminar: {}
    };
  },
  apollo: {
    seminar() {
      const seminar_id = this.visit.seminar_id;
      return {
        query: queries.get_seminar,
        variables: {
          seminar_id
        },
        update: data => data.seminar[0]
      };
    }
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
