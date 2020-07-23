<template>
  <div>
    <h1>My Visitors</h1>
    <div style="display: flex;">
      <div v-if="seminarsBySelectedSemester.length">
        <SeminarsWithVisitsCard
          v-for="seminar in seminarsBySelectedSemester"
          :seminar="seminar"
          :key="seminar.id"
        />
      </div>
      <div v-else>
        <div style="width: 35rem;">
          <a-card hoverable>
            <p>You have no upcoming visitors</p>
          </a-card>
        </div>
      </div>
      <div style="position: sticky; top: 20px; margin: 0 20px;">
        <a-card style="width: 15rem;">
          <h4>Visits by semester</h4>
          <a-menu v-model="selectedSemester">
            <a-menu-item
              v-for="semester in seminarsGroupBySemester"
              :key="semester.semester_code"
            >
              {{ semester.semester_code }}
            </a-menu-item>
          </a-menu>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script>
import SeminarsWithVisitsCard from "./SeminarWithVisitsCard";
import queries from "@/graphql/queries.gql";
import store from "@/store";
// import constants from "@/utils/constants";

export default {
  name: "MyVisitorsPage",
  components: {
    SeminarsWithVisitsCard
  },
  data() {
    return {
      seminarsWithVisits: [],
      selectedSemester: [process.env.VUE_APP_SEMESTER_CODE],
    };
  },
  apollo: {
    seminarsWithVisits: {
      query: queries.get_seminars_with_visits_by_time_requested,
      variables() {
        return {
          faculty_id: store.state.loggedInUser,
          // semester_code: process.env.VUE_APP_SEMESTER_CODE
        };
      },
      update: data => data.seminar
    }
  },
  computed: {
    seminarsWithSomeVisits() {
      return this.seminarsWithVisits.filter(
        seminar => Array.isArray(seminar.visits) && seminar.visits.length
      );
    },
    seminarsGroupBySemester() {
      const defaultVal = [
        { semester_code: process.env.VUE_APP_SEMESTER_CODE, seminars: [] }
      ];
      if (!this.seminarsWithSomeVisits.length) return defaultVal;
      return this.seminarsWithSomeVisits.reduce((acc, cur) => {
        const cur_semester_code = cur.semester_code;
        const idx =
          acc.length === 0
            ? -1
            : acc.findIndex(
                semesterWithSeminars =>
                  semesterWithSeminars.semester_code === cur_semester_code
              );
        if (idx === -1) {
          acc.push({ semester_code: cur_semester_code, seminars: [cur] });
        } else {
          acc[idx].seminars.push(cur);
        }
        console.log(acc)
        return acc;
      }, defaultVal);
    },
    seminarsBySelectedSemester() {
      return this.seminarsGroupBySemester.find(
        semester => semester.semester_code === this.selectedSemester[0]
      ).seminars;
    }
  },
};
</script>

<style scoped></style>
