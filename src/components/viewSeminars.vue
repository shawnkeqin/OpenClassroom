<template>
  <div>
    <a-card title="Search Courses" style="width: 1400px">
      <form @submit.prevent="submit">
        <fieldset>
          <input type="text" placeholder="Seminar ID" v-model="seminar_id" />
          <input
            type="text"
            placeholder="Course Title"
            v-model="course_title"
          />
          <input type="text" placeholder="Start" v-model="start" />
          <input type="text" placeholder="End" v-model="end" />
          <input type="text" placeholder="Date" v-model="date" />
          <input type="text" placeholder="Location" v-model="location" />
        </fieldset>
        <input class="button-primary" type="submit" value="Send" />
      </form>

      <br />
      <br />
      <br />
      <h2>Results</h2>
      <div class="list-of-seminars">
        <seminar-item
          v-for="seminartest in seminartest"
          :key="seminartest.seminar_id"
          :seminartest="seminartest"
          class="seminar-item"
        >
        </seminar-item>
      </div>
    </a-card>
  </div>
</template>

<script>
import seminarItem from "./seminarItem";
import gql from "graphql-tag";

const GET_SEMINARS = gql`
  query getSeminars {
    seminartest {
      course_title
      date
      end
      location
      seminar_id
      start
    }
  }
`;
export default {
  name: "viewSeminars",
  components: { seminarItem },
  data() {
    return {
      seminar_id: "",
      seminartest: []
    };
  },
  apollo: {
    seminartest: {
      query: GET_SEMINARS
    }
  },
  methods: {
    submit() {
      const { seminar_id } = this.$data;
      this.$apollo.query({
        query: `query searchSeminars{
  seminartest(where: {seminar_id: {_eq: ${seminar_id}}}) {
    course_title
    date
    end
    location
    seminar_id
    start
  }
  }`
      });

      this.seminar_id = "";
      this.course_title = "";
      this.start = "";
      this.end = "";
      this.date = "";
      this.location = "";
    }
  }
};
</script>

<style scoped>
.list-of-seminars {
  justify-content: center;
}
.seminar-item {
  margin: 0 10px;
}
</style>
