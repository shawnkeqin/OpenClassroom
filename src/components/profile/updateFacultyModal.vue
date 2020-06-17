<template>
  <div id="components-modal-demo-position">
    <br /><br />
    <a-button type="primary" @click="() => (modal2Visible = true)">
      Update Faculty
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
            <input type="text" placeholder="name" v-model="name" />
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
const UPDATE_FACULTY = gql`
  mutation update_faculty($id: String!, $name: String!) {
    update_faculty(where: { id: { _eq: $id } }, _set: { name: $name }) {
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
  name: "updateFacultyModal",
  data() {
    return {
      id: "",
      name: "",
      modal2Visible: false
    };
  },
  apollo: {},
  methods: {
    submit() {
      const { id, name } = this.$data;
      this.$apollo.mutate({
        mutation: UPDATE_FACULTY,
        variables: {
          id,
          name
        },
        update: (store, { data: { update_faculty } }) => {
          if (update_faculty.affected_rows) {
            if (this.type === "private") {
              const data = store.readQuery({
                query: GET_FACULTIES
              });
              const updateFaculty = data.id.find(t => t.id === data.id);
              updateFaculty.name = data.name;
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
