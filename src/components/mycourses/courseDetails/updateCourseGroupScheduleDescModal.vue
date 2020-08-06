<template>
  <div style="display: flex; align-items: center;">
    <a href="#" @click="modal2Visible = true">
      <div style="display: flex; align-items: center;">
        <div style="margin-right: 5px;">Edit</div>
        <a-icon type="edit" />
      </div>
    </a>
    <a-modal
      v-model="modal2Visible"
      title="Update Course Schedule Description"
      centered
      @ok="() => (modal2Visible = false)"
    >
      <template slot="footer">
        <a-button @click="modal2Visible = false">
          Cancel
        </a-button>
        <a-button primary @click="submit" :loading="isLoading">
          Confirm update
        </a-button>
      </template>
      <h5>Additional course schedule description</h5>
      <a-textarea v-model="edit_course_group_schedule_desc" />
    </a-modal>
  </div>
</template>
<script>
import queries from "@/graphql/queries.gql";
export default {
  name: "updateCourseGroupScheduleDescModal",
  props: {
    course_group: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      edit_course_group_schedule_desc: this.course_group.schedule_desc,
      modal2Visible: false,
      isLoading: false
    };
  },
  methods: {
    async submit() {
      this.isLoading = true;
      const id = this.course_group.id;
      const new_schedule_desc = this.edit_course_group_schedule_desc;
      try {
        await this.$apollo.mutate({
          mutation: queries.update_course_group_schedule_desc,
          variables: {
            id,
            schedule_desc: new_schedule_desc
          },
          update: (store, { data: { update_course_group } }) => {
            if (update_course_group.affected_rows) {
              if (this.type === "private") {
                const data = store.readQuery({
                  query: queries.get_course_group_new_schedule_desc
                });
                const updateCourse = data.id.find(t => t.id === id);
                updateCourse.schedule_desc = data.schedule_desc;
                store.writeQuery({
                  query: queries.get_course_group_new_schedule_desc,
                  data
                });
              }
            }
          },
          refetchQueries: [
            // "get_course_group_new_desc",
            "get_course_group_details"
          ]
        });
        this.isLoading = false;
        this.modal2Visible = false;
      } catch (err) {
        this.modal2Visible = false;
        this.$notification.error({
          key: "update_schedule_desc_error",
          message: "Failed to update course group description",
          description: "Please try again."
        });
      }
    }
  }
};
</script>
<style scoped></style>
