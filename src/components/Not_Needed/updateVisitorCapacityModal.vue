<template>
  <div id="components-modal-demo-position">
    <!-- <br /><br /> -->
    <a-button type="dashed" @click="() => (modal2Visible = true)">
      Update Visitor Capacity
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
            <p>To confirm, enter Seminar ID</p>
            <input type="number" placeholder="Seminar ID" v-model="id" />
            <input
              type="number"
              placeholder="Visitor Capacity"
              v-model="visitor_capacity"
            />
          </fieldset>
          <input class="button-primary" type="submit" value="Send" />
        </form>
      </div>
    </a-modal>
  </div>
</template>
<script>
//import { InMemoryCache } from "apollo-cache-inmemory";
import queries from "@/graphql/queries.gql";
export default {
  name: "updateVisitorCapacityModal",
  //props: ["seminar_id"],
  data() {
    return {
      id: "",
      visitor_capacity: "",
      modal2Visible: false
    };
  },
  apollo: {},
  methods: {
    async submit() {
      const { id, visitor_capacity } = this.$data;
      await this.$apollo.mutate({
        mutation: queries.edit_capacity,
        variables: {
          id,
          visitor_capacity
        },
        update: (store, { data: { update_seminar } }) => {
          if (update_seminar.affected_rows) {
            if (this.type === "private") {
              const data = store.readQuery({
                query: queries.get_seminars_by_course_group
              });
              const updateCapacity = data.id.find(t => t.id === data.id);
              updateCapacity.visitor_capacity = data.visitor_capacity;
              store.writeQuery({
                query: queries.get_seminars_by_course_group,
                data
              });
            }
          }
        },
        refetchQueries: ["get_seminars_by_course_group"]
      });
      this.id = "";
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
