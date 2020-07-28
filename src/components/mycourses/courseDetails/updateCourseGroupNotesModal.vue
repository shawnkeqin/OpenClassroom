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
      title="Update notes for visitors"
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
      <h5>Notes for visitors</h5>
      <a-textarea v-model="edit_notes" />
    </a-modal>
  </div>
</template>
<script>
import queries from "@/graphql/queries.gql";
export default {
  name: "updateCourseGroupNotesModal",
  props: {
    course_group: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      edit_notes: this.course_group.notes,
      modal2Visible: false,
      isLoading: false
    };
  },
  methods: {
    async submit() {
      this.isLoading = true;
      const id = this.course_group.id;
      const new_notes = this.edit_notes;
      try {
        await this.$apollo.mutate({
          mutation: queries.update_course_group_notes,
          variables: {
            id,
            notes: new_notes
          },
          refetchQueries: ["get_course_group_details"]
        });
        this.isLoading = false;
        this.modal2Visible = false;
      } catch (err) {
        this.modal2Visible = false;
        this.$notification.error({
          key: "update_course_group_notes_error",
          message: "Failed to update notes for visitors",
          description: "Please try again."
        });
      }
    }
  }
};
</script>
<style scoped></style>
