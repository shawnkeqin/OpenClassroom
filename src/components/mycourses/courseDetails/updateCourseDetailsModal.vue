<template>
  <div id="components-modal-demo-position">
    <!-- <br /><br /> -->
    <a-button type="danger" @click="() => (modal2Visible = true)">
      Add Extra Description
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
            <!--      <input type="number" placeholder="Enter Course ID" v-model="id" /> -->
            <textarea
              name="Description"
              placeholder="New Course Description"
              rows="4"
              cols="50"
              v-model="course_group_desc"
            >
            </textarea>
            <!-- <input type="text" placeholder="Description" v-model="desc" /> -->
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
  name: "updateCourseDetailsModal",
  props: ["id"],
  data() {
    return {
      // id: "",
      course_group_desc: "",
      modal2Visible: false
    };
  },
  apollo: {},
  methods: {
    async submit() {
      const { course_group_desc } = this.$data;
      const id = this.id;
      try {
        await this.$apollo.mutate({
          mutation: queries.update_course_group_desc,
          variables: {
            id,
            course_group_desc
          },
          update: (store, { data: { update_course_group } }) => {
            if (update_course_group.affected_rows) {
              if (this.type === "private") {
                const data = store.readQuery({
                  query: queries.get_course_group_new_desc
                });
                const updateCourse = data.id.find(t => t.id === id);
                updateCourse.course_group_desc = data.course_group_desc;
                store.writeQuery({
                  query: queries.get_course_group_new_desc,
                  data
                });
              }
            }
          },
          refetchQueries: ["get_course_group_new_desc"]
        });
        this.course_group_desc = "";
      } catch (err) {
        this.$notification.error({
          key: "update_class_error",
          message: "Failed to update course group description",
          description: "Please try again."
        });
      }
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
