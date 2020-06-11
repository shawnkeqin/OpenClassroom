<template>
  <div id="components-modal-demo-position">
    <br /><br />
    <a-button type="dashed" @click="() => (modal2Visible = true)">
      Update Seminar
    </a-button>
    <a-modal
      v-model="modal2Visible"
      title="Update Seminar"
      centered
      @ok="() => (modal2Visible = false)"
    >
      <div class="submit-form">
        <form @submit.prevent="submit">
          <fieldset>
            <input type="number" placeholder="id" v-model="id" />
               <input type="text" placeholder="Course Title" v-model="course_title" />
            <input type="text" placeholder="Seminar ID" v-model="seminar_id" />
         <!--   <input type="number" placeholder="id" v-model="id" /> -->
            <input type="text" placeholder="Location" v-model="location" />
             <input type="date" placeholder="Date" v-model="date" />  
         <input type="time" placeholder="Start Time" v-model="start" />
            <input type="time" placeholder="End Time" v-model="end" />
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
const UPDATE_SEMINAR = gql`
  mutation update_seminar($id: Int!, $location: String!) {
    update_seminartest(where: { id: { _eq: $id } }, _set: { location: $location }) {
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
  name: "updateSeminarModal",
  data() {
    return {
      id: "",
      location: "",
      modal2Visible: false
    };
  },
  apollo: {},
  methods: {
    submit() {
      const { id, location } = this.$data;
      this.$apollo.mutate({
        mutation: UPDATE_SEMINAR,
        variables: {
          id,
          location
        },
        update: (store, { data: { update_seminartest } }) => {
          if (update_seminartest.affected_rows) {
            if (this.type === "private") {
              const data = store.readQuery({
                query: GET_MY_SEMINARS
              });
              const updateSeminar = data.id.find(t => t.id === data.id);
              updateSeminar.location = data.location;
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
      this.location = "";
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
