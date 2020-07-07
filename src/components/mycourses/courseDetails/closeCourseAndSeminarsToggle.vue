<template>
  <!-- <div> -->
  <a-switch default-checked @change="onChange" />
  <!-- </div> -->
</template>
<script>
import gql from "graphql-tag";

export default {
  name: "closeCourseAndSeminarsToggle",
  props: ["course_group_id"],
  data() {
    return {};
  },
  methods: {
    async onChange(checked) {
      const course_group_id = this.course_group_id;
      console.log(`a-switch to ${checked}`);
      await this.$apollo.mutate({
        mutation: gql`
  mutation close_course_and_seminars($course_group_id: Int!) {
  update_course_group(where: {id: {_eq: $course_group_id}}, _set: { is_open: ${checked}}) {
 		affected_rows
  }
  update_seminar(where: {course_group: {id: {_eq: $course_group_id}}}, _set: {is_open: ${checked}}) {
    affected_rows
  }
}
`,
        variables: {
          course_group_id
        },
        /*    update: (store, { data: { update_seminar } }) => {
          if (update_seminar.affected_rows) {
            // if (this.type === "private") {
            const data = store.readQuery({
              query: GET_MY_SEMINARS
            });
            const seminar = data.seminar;
            const i = seminar.findIndex(
              seminar => seminar.id === this.seminar.id
            );
            seminar[i].is_open = checked;
            store.writeQuery({
              query: GET_MY_SEMINARS,
              data
            });
            // }
          }
        }, */
        refetchQueries: [
          "get_seminars_by_course_group",
          "get_course_groups_by_faculty"
        ]
      });
    }
  }
};
</script>
