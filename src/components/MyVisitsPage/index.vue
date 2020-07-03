<template>
  <div class="page-wrapper">
    <h1>My Visits</h1>
    <div style="display: flex;">
      <div>
        <SeminarRequestCard
          v-for="visit in myVisits"
          :seminar="visit.seminar"
          :visit="visit"
          :isMessagesVisible="true"
          :key="visit.id"
        />
      </div>
      <div>
        <div style="position: sticky; top: 20px; margin: 50px">
          <p>
            <a
              href="https://library.yale-nus.edu.sg/wp-content/uploads/2014/01/campus-map_Aug2015.jpg"
              target="_blank"
              >View campus map</a
            >
          </p>
          <p>
            CTL best practices for Peer Observation: download
            <a
              href="https://teaching.yale-nus.edu.sg/wp-content/uploads/sites/25/2019/04/Peer-Observation-Booklet-web-version-edited-linked.pdf#page=20"
              target="_blank"
              >here</a
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SeminarRequestCard from "../viewSeminars/SeminarRequestCard";
import queries from "@/graphql/queries.gql";
import constants from "@/utils/constants";

export default {
  name: "observelog",
  components: {
    SeminarRequestCard
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
