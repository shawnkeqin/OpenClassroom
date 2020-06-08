<template>
  <div id="components-modal-demo-position">
    <br /><br />
    <a-button type="primary" @click="() => (modal2Visible = true)">
      Delete Faculty
    </a-button>
    <a-modal
      v-model="modal2Visible"
      title="Vertically centered modal dialog"
      centered
      @ok="() => (modal2Visible = false)"
    >
      <div class="submit-form">
        <form @submit.prevent="submit">
          <fieldset>
            <input type="text" placeholder="id" v-model="id" />
          </fieldset>
          <input class="button-primary" type="submit" value="Send" />
        </form>
      </div>
    </a-modal>
  </div>
</template>
<script>
import gql from "graphql-tag";
//import { InMemoryCache } from "apollo-cache-inmemory";
const REMOVE_FACULTY = gql`
  mutation removefaculty($id: String!) {
    delete_faculty(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;
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
  name: "addNewFacultyModal",
  data() {
    return {
      id: "",
      modal2Visible: false
    };
  },
  apollo: {},
  methods: {
    submit() {
      const { id } = this.$data;
      this.$apollo.mutate({
        mutation: REMOVE_FACULTY,
        variables: {
          id
        },
        update: (store, { data: { delete_faculty } }) => {
          if (delete_faculty.affected_rows) {
            if (this.type === "private") {
              const data = store.readQuery({
                query: GET_FACULTIES
              });
              data.id = data.id.filter(t => {
                return t.id !== data.id;
              });
              store.writeQuery({
                query: GET_FACULTIES,
                data
              });
            }
          }
        },
        refetchQueries: ["getFaculties"]
      });
      this.id = "";
      this.email = "";
      this.name = "";
      this.is_active = "";
    }
  }
};
</script>
<style scoped>
form {
  width: 50%;
}
.submit-form {
  display: flex;
  justify-content: center;
}
</style>
