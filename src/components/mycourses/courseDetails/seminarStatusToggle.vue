<template>
  <!-- <div> -->
    <a-switch default-checked @change="onChange" />
  <!-- </div> -->
</template>
<script>
import gql from "graphql-tag";

export default {
  name: "seminarStatusToggle", 
  props: ["seminar_id"],
  data() {
    return {};
  },
  apollo: {},
  methods: {
    async onChange(checked) {
      const seminar_id = this.seminar_id;
      console.log(`a-switch to ${checked}`);
       await this.$apollo.mutate({
        mutation: gql`
  mutation toggleSeminar($seminar_id: Int!) {
    update_seminar(where: { id: { _eq: $seminar_id }}, _set: { is_open: ${checked}}) {
      affected_rows
    }
  }
`,
        variables: {
         seminar_id
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
         refetchQueries: ["get_seminars_by_course_group"]
      });

    }
  },
};
</script>