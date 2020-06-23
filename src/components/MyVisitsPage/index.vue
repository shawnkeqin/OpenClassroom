<template>
  <div class="page-wrapper">
    <div class="content-block-wrapp">
      <h1>My Visits</h1>
      <MyVisitCard
        v-for="visit in myVisits"
        :seminar="visit.seminar"
        :visit="visit"
        :isMessagesVisible="true"
        :key="visit.id"
      />
    </div>
  </div>
</template>

<script>
import MyVisitCard from "./MyVisitCard";
import queries from "@/graphql/queries.gql";
import constants from "@/utils/constants";

export default {
  name: "observelog",
  components: {
    MyVisitCard
  },
  data() {
    return {
      myVisits: []
    };
  },
  apollo: {
    myVisits: {
      query: queries.get_my_visits,
      variables: {
        visitor_id: constants.TEST_FACULTY_ID
      },
      update: data => data.visit
    }
  }
};
</script>

<style scoped></style>
