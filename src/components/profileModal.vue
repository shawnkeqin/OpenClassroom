
<template>
  <div id="components-modal-demo-position">
    <br /><br />
    <a-button type="dashed" @click="() => (modal2Visible = true)">
      Edit Profile
    </a-button>
    <a-modal
      v-model="modal2Visible"
      title="Edit My Profile"
      centered
      @ok="() => (modal2Visible = false)"
    >
      <div class="submit-form">
        <form @submit.prevent="submit">
          <fieldset>
          <!--  <input type="text" placeholder="name" v-model="name" /> -->
            <input type="text" placeholder="YNC ID" v-model="id" />
            <br />
            <input type="text" placeholder="Email" v-model="email" /> 
          <!--  <a-textarea  type="text" placeholder="email" :rows="4" v-model="email" /> -->
          </fieldset>
         <input class="button-primary" type="submit" value="Confirm" /> 
     
        </form>
      </div>
    </a-modal>
  </div>
</template>
<script>
import gql from "graphql-tag";

const UPDATE_FACULTY = gql`
  mutation update_faculty($id: String!, $email: String!) {
    update_faculty(where: { id: { _eq: $id } }, _set: { email: $email }) {
      affected_rows
    }
  }
`;
const GET_FACULTY = gql`
query findFaculty {
  faculty(where: {id: {_eq: "yncsjm1"}}) {
    email
    id
    name
  }
}

`;

export default {
  name: "profileModal",
  data() {
    return {
      id: "",
      email: "",
      modal2Visible: false
    };
  },
  apollo: {},
  methods: {
    submit() {
      const { id, email } = this.$data;
      this.$apollo.mutate({
        mutation: UPDATE_FACULTY,
        variables: {
          id,
          email
        },
        update: (store, { data: { update_faculty } }) => {
          if (update_faculty.affected_rows) {
            if (this.type === "private") {
              const data = store.readQuery({
                query: GET_FACULTY
              });
              const updateFaculty = data.id.find(t => t.id === data.id);
              updateFaculty.email = data.email;
              store.writeQuery({
                query: GET_FACULTY,
                data
              });
            }
          }
        },
        refetchQueries: ["findFaculty"]
      });
      this.id = "";
      this.email = "";
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
