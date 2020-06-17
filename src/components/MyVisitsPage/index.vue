<template>
  <div>
    <h1>My Visits</h1>
    <br />
    <MyVisitCard v-for="visit in myVisits" :visit="visit" :key="visit.id" />
  </div>
</template>

<script>
import MyVisitCard from "./MyVisitCard";
import queries from "@/graphql/queries.gql";
// import constants from "../utils/constants";

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
        visitor_id: "yncms"
      },
      update: data => data.visit
    }
  }
};
</script>

<style scoped></style>
