<template>
  <div style="width: 50rem;">
    <h1>My Visits</h1>
    <template v-if="$apollo.loading"><a-skeleton active/></template>
    <template v-else>
      <div style="display: flex;">
        <div v-if="visitsBySelectedSemester.length">
          <SeminarVisitRequestCard
            v-for="visit in visitsBySelectedSemester"
            :seminar="visit.seminar"
            :visit="visit"
            :isMessagesVisible="true"
            :key="visit.id"
          />
        </div>
        <div v-else>
          <div style="width: 35rem;">
            <a-card hoverable>
              <p>
                {{
                  `You have no upcoming visits for semester ${selectedSemester[0]}`
                }}
              </p>
            </a-card>
          </div>
        </div>
        <div>
          <div style="position: sticky; top: 20px; margin: 0 20px">
            <a-card style="width: 15rem; margin-bottom: 20px;">
              <h4>Visits by semester</h4>
              <a-menu v-model="selectedSemester">
                <a-menu-item
                  v-for="semester in visitsGroupBySemester"
                  :key="semester.semester_code"
                >
                  {{ semester.semester_code }}
                </a-menu-item>
              </a-menu>
            </a-card>
            <a-card style="width: 15rem;">
              <p>
                <a @click="mapVisible = true" href="#">View campus map here</a>
              </p>
              <a-modal
                title="Campus map"
                :visible="mapVisible"
                @cancel="mapVisible = false"
                width="60vw"
                :footer="null"
              >
                <img
                  src="https://library.yale-nus.edu.sg/wp-content/uploads/2014/01/campus-map_Aug2015.jpg"
                  width="100%"
                />
              </a-modal>
              <p style="margin-bottom: 0">
                <a
                  href="https://teaching.yale-nus.edu.sg/wp-content/uploads/sites/25/2019/04/Peer-Observation-Booklet-web-version-edited-linked.pdf#page=20"
                >
                  CTL best practices for Peer Observation</a
                >
              </p>
            </a-card>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import SeminarVisitRequestCard from "@/components/SeminarVisitRequestCard";
import queries from "@/graphql/queries.gql";
import store from "@/store";

export default {
  name: "observelog",
  components: {
    SeminarVisitRequestCard
  },
  data() {
    return {
      myVisits: [],
      selectedSemester: [process.env.VUE_APP_SEMESTER_CODE], // to use v-model for a-menu, the data must but an array
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
      update: data => data.visit,
      error(error, vm, key) {
        this.$notification.error({
          key,
          message: "Failed to obtain data on your visits",
          description: "Please try again."
        });
      }
    }
  },
  computed: {
    visitsGroupBySemester() {
      const defaultVal = [
        { semester_code: process.env.VUE_APP_SEMESTER_CODE, visits: [] }
      ];
      if (!this.myVisits.length) return defaultVal;
      return this.myVisits.reduce((acc, cur) => {
        const cur_semester_code = cur.seminar.course_group.course.semester_code;
        const idx =
          acc.length === 0
            ? -1
            : acc.findIndex(
                semesterWithVisits =>
                  semesterWithVisits.semester_code === cur_semester_code
              );
        if (idx === -1) {
          acc.push({ semester_code: cur_semester_code, visits: [cur] });
        } else {
          acc[idx].visits.push(cur);
        }
        return acc;
      }, defaultVal);
    },
    visitsBySelectedSemester() {
      return this.visitsGroupBySemester.find(
        semester => semester.semester_code === this.selectedSemester[0]
      ).visits;
    }
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
  }
};
</script>

<style scoped></style>
