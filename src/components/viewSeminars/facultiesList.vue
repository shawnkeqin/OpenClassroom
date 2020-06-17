<template>
  <div class="list-of-faculties">
    <faculty-item
      v-for="faculty in faculty"
      :key="faculty.id"
      :faculty="faculty"
      class="faculty-item"
    >
    </faculty-item>
  </div>
</template>

<script>
//login page form box will determine the id which will allow the graphql query (id) to match and then retrieve all the courses linked to the id.
//graphql query out all the information for the course - including the seminar information and display in the visible view and hidden view accordingly.
import FacultyItem from "./FacultyItem";
import gql from "graphql-tag";
const GET_FACULTIES = gql`
  query getFaculties {
    faculty {
      id
      email
      name
      is_active
    }
  }
`;
export default {
  name: "facultiesList",
  components: { FacultyItem },
  data() {
    return {
      faculty: []
    };
  },
  apollo: {
    faculty: {
      query: GET_FACULTIES
    }
  }
};
</script>

<style>
.list-of-faculties {
  justify-content: center;
}
.faculty-item {
  margin: 0 10px;
}
</style>
