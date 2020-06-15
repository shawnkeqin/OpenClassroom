<!-- <template>
  <div>

       <a-button type="primary" @click="showModal">
      Add New Seminar
    </a-button>
    <a-modal v-model="visible" title="Modal" ok-text="Confirm" cancel-text="Cancel" @ok="hideModal">
      <p>Bla bla ...</p>
      <p>Bla bla ...</p>
      <p>Bla bla ...</p>
    </a-modal>
    <br />
    <br />
 
  </div>
</template>
<script>
export default {
  name: 'addNewSeminarModal',
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    showModal() {
      this.visible = true;
    },
    hideModal() {
      this.visible = false;
    },
    confirm() {
      this.$confirm({
        title: 'Confirm',
        content: 'Bla bla ...',
        okText: '确认',
        cancelText: '取消',
      });
    },
  },
};
</script> -->
<template>
  <div id="components-modal-demo-position">
    <br /><br />
    <a-button type="primary" @click="() => (modal2Visible = true)">
      Add Seminar
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
            <input type="text" placeholder="email" v-model="email" />
            <input type="text" placeholder="name" v-model="name" />
            <input type="text" placeholder="is_active" v-model="is_active" />
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
const ADD_FACULTY = gql`
  mutation addFaculty(
    $id: String!
    $email: String!
    $name: String!
    $is_active: Boolean!
  ) {
    insert_faculty(
      objects: [{ id: $id, email: $email, name: $name, is_active: $is_active }]
    ) {
      returning {
        id
      }
    }
  }
`;
export default {
  name: "addNewFacultyModal",
  data() {
    return {
      id: "",
      email: "",
      name: "",
      is_active: "",
      modal2Visible: false
    };
  },
  apollo: {},
  methods: {
    submit() {
      const { id, email, name, is_active } = this.$data;
      this.$apollo.mutate({
        mutation: ADD_FACULTY,
        variables: {
          id,
          email,
          name,
          is_active
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
