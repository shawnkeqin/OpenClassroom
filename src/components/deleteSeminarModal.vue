<template>
  <div id="components-modal-demo-position">
    <br /><br />
    <a-button type="danger" @click="() => (modal2Visible = true)">
      Delete Seminar
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
const REMOVE_SEMINAR = gql`
  mutation removeSeminar($id: Int!) {
    delete_seminartest(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;
const GET_MY_SEMINARS = gql`
query findSeminar{
   	seminartest(limit: 3){
       course_title
       seminar_id
        date
        end
        location
        start
     }
  }`
export default {
  name: "deleteSeminarModal",
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
        mutation: REMOVE_SEMINAR,
        variables: {
          id
        },
        update: (store, { data: { delete_seminartest } }) => {
          if (delete_seminartest.affected_rows) {
            if (this.type === "private") {
              const data = store.readQuery({
                query: GET_MY_SEMINARS
              });
              data.id = data.id.filter(t => {
                return t.id !== data.id;
              });
              store.writeQuery({
                query: GET_MY_SEMINARS,
                data
              });
            }
          }
        },
        refetchQueries: ["findSeminar"]
      });
      this.id = "";
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
