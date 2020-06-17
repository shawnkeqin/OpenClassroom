<template>
  <div id="components-modal-demo-position">
    <br /><br />
    <a-button type="danger" @click="() => (modal2Visible = true)">
      Update Course Details
    </a-button>
    <a-modal
      v-model="modal2Visible"
      title="Update Course Details"
      centered
      @ok="() => (modal2Visible = false)"
    >
      <div class="submit-form">
        <form @submit.prevent="submit">
          <fieldset>
            <input type="number" placeholder="Course ID" v-model="id" />
            <textarea name="Description" placeholder="New Course Description" rows="4" cols="50" v-model="desc"> </textarea>
           <!-- <input type="text" placeholder="Description" v-model="desc" /> -->
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
const UPDATE_MODULE = gql`
  mutation update_course($id: Int!, $desc: String!) {
    update_course(where: { id: { _eq: $id } }, _set: { desc: $desc}) {
      affected_rows
    }
  }
`;
const GET_MODULE = gql`
query getModules {
   course(where: {id: {_eq: 1}}) {
    desc
    id
    title
    module_code
  }
}
`
export default {
  name: "updateCourseDetailsModal",
  data() {
    return {
      id: "",
      desc: "",
      modal2Visible: false
    };
  },
  apollo: {},
  methods: {
    submit() {
      const { id, desc } = this.$data;
      this.$apollo.mutate({
        mutation: UPDATE_MODULE,
        variables: {
          id,
          desc
        },
        update: (store, { data: { update_course } }) => {
          if (update_course.affected_rows) {
            if (this.type === "private") {
              const data = store.readQuery({
                query: GET_MODULE
              });
              const updateCourse = data.id.find(t => t.id === data.id);
              updateCourse.desc = data.desc;
              store.writeQuery({
                query: GET_MODULE,
                data
              });
            }
          }
        },
        refetchQueries: ["getModules"]
      });
      this.id = "";
      this.desc = "";
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
