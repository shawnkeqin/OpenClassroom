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
      title="Update course Syllabus"
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
      <h5>Additional course syllabus</h5>
      <a-textarea v-model="edit_course_group_syllabus" />
    </a-modal>
  </div>
</template>
<script>
import queries from "@/graphql/queries.gql";
export default {
  name: "updateCourseGroupSyllabusModal",
  props: {
    course_group: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      edit_course_group_syllabus: this.course_group.syllabus,
      modal2Visible: false,
      isLoading: false
    };
  },
  methods: {
    async submit() {
      this.isLoading = true;
      const id = this.course_group.id;
      const new_syllabus = this.edit_course_group_syllabus;
      try {
        await this.$apollo.mutate({
          mutation: queries.update_course_group_syllabus,
          variables: {
            id,
            syllabus: new_syllabus
          },
          refetchQueries: ["get_course_group_details"]
        });
      } catch (err) {
        this.$notification.error({
          message: "Failed to update course group description",
          description: err.toString()
        });
      }
      this.isLoading = false;
      this.modal2Visible = false;
    }
  }
};
</script>
<style scoped></style>
