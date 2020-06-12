<template>
  <div>
    <h1>Outcoming Visits</h1>
    <br />
    <!-- <div>{{ myVists }}</div> -->
    <myVisitCard v-for="visit in myVists" :visit="visit" :key="visit.id" />
  </div>
</template>


<script>
import myVisitCard from "./myVisitCard";
import gql from 'graphql-tag';

export default {
  name: "observelog",
  components: {
    myVisitCard
  },
  // computed: {
  //   myVists() {
  //     return this.$store.state.myVists;
  //   }
  // },
  data() {
    return {
      myVisits: []
    }
  },
  apollo: {
    myVists: {
      query: gql`
        query getMyVisits($visitor_id: String!) {
          visit(where: { visitor_id: { _eq: $visitor_id } }) {
            id
            seminar_id
            visit_status
            visitor_id
          }
        }`,
      variables: {
        visitor_id: "yncsjm"
      },
      update: data => data.visit
    }
  },
  // create() {
    // console.log('created');
    // this.$store.dispatch("fetchMyVisits", { visitor_id: "yncsjm" });
  // }
};
</script>

<style scoped></style>
