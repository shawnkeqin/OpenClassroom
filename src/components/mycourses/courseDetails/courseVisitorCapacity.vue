<template>
  <div id="components-modal-demo-position">
    <!-- <br /><br /> -->
    <a-button type="danger" @click="() => (modal2Visible = true)">
      Set visitor capacity for the whole course
    </a-button>
    <a-modal
      v-model="modal2Visible"
      title="Set Visitor Capacity"
      centered
      @ok="() => (modal2Visible = false)"
    >
      <div class="submit-form">
        <form @submit.prevent="submit">
          <fieldset>
            <!--      <input type="number" placeholder="Enter Course ID" v-model="id" /> -->
            <h5>Visitor capacity</h5>
            <input
              type="number"
              v-model="visitor_capacity"
              class="input-field"
            />

            <!-- <input type="text" placeholder="Description" v-model="desc" /> -->
          </fieldset>
          <br />
          <input class="button-primary" type="submit" value="Set Capacity" />
        </form>
      </div>
    </a-modal>
  </div>
</template>
<script>
//import { InMemoryCache } from "apollo-cache-inmemory";
import queries from "@/graphql/queries.gql";
export default {
  name: "updateCourseVisitorCapacityModal",
  //props: ["id"],
  data() {
    return {
      //  id: "",
      id: this.$route.params.id,
      visitor_capacity: "",
      modal2Visible: false
    };
  },
  apollo: {},
  methods: {
    async submit() {
      const { visitor_capacity } = this.$data;
      const id = this.id;
      await this.$apollo.mutate({
        mutation: queries.update_course_group_visitor_capacity,
        variables: {
          id,
          visitor_capacity
        },
        update: (store, { data: { update_course_group } }) => {
          if (update_course_group.affected_rows) {
            if (this.type === "private") {
              const data = store.readQuery({
                query: queries.get_course_group_new_visitor_capacity
              });
              const updateCourse = data.id.find(t => t.id === id);
              updateCourse.visitor_capacity = data.visitor_capacity;
              store.writeQuery({
                query: queries.get_course_group_new_visitor_capacity,
                data
              });
            }
          }
        },
        refetchQueries: [
          // "get_course_group_new_visitor_capacity",
          "get_course_group_details"
        ]
      });
      this.visitor_capacity = "";
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
