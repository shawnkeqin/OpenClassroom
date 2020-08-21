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
      title="Update additional course description"
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
      <h5>Additional course description</h5>
      <a-textarea v-model="edit_course_group_desc" />
    </a-modal>
  </div>
</template>
<script>
import queries from "@/graphql/queries.gql";
export default {
  name: "updateCourseGroupDescModal",
  props: {
    course_group: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      edit_course_group_desc: this.course_group.course_group_desc,
      modal2Visible: false,
      isLoading: false
    };
  },
  methods: {
    async submit() {
      this.isLoading = true;
      const id = this.course_group.id;
      const new_course_group_desc = this.edit_course_group_desc;
      try {
        await this.$apollo.mutate({
          mutation: queries.update_course_group_desc,
          variables: {
            id,
            course_group_desc: new_course_group_desc
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
          key: "update_course_group_desc_error",
          message: "Failed to update course group description",
          description: "Please try again."
        });
      }
    }
  }
};
</script>
<style scoped></style>
