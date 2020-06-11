<template>
  <div class="list-of-seminars">
    <a-button :type="isActiveOn ? 'primary' : 'default'" @click="isActiveOn = true">Active</a-button>
    <a-button :type="!isActiveOn ? 'primary' : 'default'" @click="isActiveOn = false">Archived</a-button>
    <seminar-item
      v-show="isActiveOn"
      @go-to-archived="isActiveOn = false"
      v-for="seminartest in seminartest.filter(
        seminartest => !seminartest.archived
      )"
      :key="seminartest.seminar_id"
      :seminartest="seminartest"
    />
    <seminar-item
      v-show="!isActiveOn"
      v-for="seminartest in seminartest.filter(
        seminartest => seminartest.archived
      )"
      :key="seminartest.seminar_id"
      :seminartest="seminartest"
    />
  </div>
</template>

<script>
//login page form box will determine the id which will allow the graphql query (id) to match and then retrieve all the courses linked to the id.
//graphql query out all the information for the course - including the seminar information and display in the visible view and hidden view accordingly.
import seminarItem from "./seminarItem";
export default {
  name: "courseSeminarsList",
  components: { seminarItem },
  data() {
    return {
      isActiveOn: true
    };
  },
  computed: {
    seminartest() {
      return this.$store.getters.allSeminars;
    }
  },
  created() {
    this.$store.dispatch("fetchSeminars");
  }
};
</script>

<style>
.list-of-seminars {
  justify-content: center;
}
.seminar-item {
  margin: 0 10px;
}
</style>
