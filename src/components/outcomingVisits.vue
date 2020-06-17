<template>
  <div>
    <h1>My Visits</h1>
    <br />
    <myVisitCard v-for="visit in myVisits" :visit="visit" :key="visit.id" />
  </div>
</template>


<script>
import myVisitCard from "./myVisitCard";
import queries from "../graphql/queries.gql";
// import constants from "../utils/constants";

export default {
  name: "observelog",
  components: {
    myVisitCard
  },
  data() {
    return {
      myVisits: []
    }
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
