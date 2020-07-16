<template>
  <div class="page-wrapper">
    <h1>My Visitors</h1>
    <SeminarsWithVisitsCard
      v-for="seminar in seminarsWithSomeVisits"
      :seminar="seminar"
      :key="seminar.id"
    />
  </div>
</template>

<script>
import SeminarsWithVisitsCard from "./SeminarWithVisitsCard";
import queries from "@/graphql/queries.gql";
import store from "@/store";
import constants from "@/utils/constants";

export default {
  name: "MyVisitorsPage",
  components: {
    SeminarsWithVisitsCard
  },
  data: function() {
    return {
      seminarsWithVisits: []
    };
  },
  computed: {
    seminarsWithSomeVisits: function() {
      return this.seminarsWithVisits.filter(
        seminar => Array.isArray(seminar.visits) && seminar.visits.length
      );
    }
  },
  apollo: {
    seminarsWithVisits: {
      query: queries.get_seminars_with_visits_by_time_requested,
      variables() {
        return {
          faculty_id: store.state.loggedInUser,
          semester_code: constants.SEMESTER_CODE_AY1819_1
        };
      },

      update: data => data.seminar
    }
  }
};
</script>

<style scoped></style>
