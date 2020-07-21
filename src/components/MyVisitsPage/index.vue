<template>
  <div class="page-wrapper">
    <h1>My Visits</h1>
    <div style="display: flex;">
      <!-- <div v-if="seminarsToVisit.length">
        <SeminarRequestCard
          v-for="seminarWithVisits in seminarsToVisit"
          :seminar="seminarWithVisits.seminar"
          :visits="seminarWithVisits.visits"
          :isMessagesVisible="true"
          :key="seminarWithVisits.seminar.id"
        />
      </div> -->
      <div v-if="myVisits.length">
        <SeminarVisitRequestCard
          v-for="visit in myVisits"
          :seminar="visit.seminar"
          :visit="visit"
          :isMessagesVisible="true"
          :key="visit.id"
        />
      </div>
      <div v-else>
        <div style="width: 35rem; margin-bottom: 30px">
          <a-card hoverable>
            <p>You have no upcoming visits</p>
          </a-card>
        </div>
      </div>
      <div>
        <div style="position: sticky; top: 20px; margin: 50px">
          <p>
            <a @click="mapVisible = true" href="#">View campus map</a>
          </p>
          <a-modal
            title="Campus map"
            :visible="mapVisible"
            @cancel="mapVisible = false"
            width="60vw"
          >
            <template slot="footer">
              <div />
            </template>
            <img
              src="https://library.yale-nus.edu.sg/wp-content/uploads/2014/01/campus-map_Aug2015.jpg"
              width="100%"
            />
          </a-modal>
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
// import SeminarRequestCard from "../viewSeminars/SeminarRequestCard";
import SeminarVisitRequestCard from "@/components/SeminarVisitRequestCard";
import queries from "@/graphql/queries.gql";
import store from "@/store";

export default {
  name: "observelog",
  components: {
    // SeminarRequestCard
    SeminarVisitRequestCard
  },
  data() {
    return {
      myVisits: [],
      mapVisible: false
    };
  },
  apollo: {
    myVisits: {
      query: queries.get_my_visits,
      variables() {
        return {
          visitor_id: store.state.loggedInUser
        };
      },
      update: data => data.visit
    }
  },
  // computed: {
  //   seminarsToVisit() {
  //     if (!this.myVisits.length) return [];
  //     return this.myVisits.reduce((acc, cur) => {
  //       const cur_seminar = cur.seminar;
  //       const idx =
  //         acc.length === 0
  //           ? -1
  //           : acc.findIndex(
  //               seminarWithVisits =>
  //                 seminarWithVisits.seminar.id === cur.seminar_id
  //             );
  //       if (idx === -1) {
  //         acc.push({ seminar: cur_seminar, visits: [cur] });
  //       } else {
  //         const curr_seminarWithVisits = acc[idx];
  //         curr_seminarWithVisits.visits.push(cur);
  //       }
  //       return acc;
  //     }, []);
  //   }
  // }
};
</script>

<style scoped></style>
