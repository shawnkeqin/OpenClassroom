<template>
  <div>
    <a-switch @change="onChange" />
  </div>
</template>
<script>
import gql from "graphql-tag";
const TOGGLE_SEMINAR_AVAILABILITY = gql`
  mutation toggleSeminar($id: Int!) {
    update_seminartest(_set: { is_open: true}, where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;
const GET_MY_SEMINARS = gql`
  query findSeminar {
    seminartest {
      id
      start
      is_open
    }
  }
`;
export default {
  name: "seminarStatusToggle", 
  props: ["seminartest"],
  data() {
    return {};
  },
  apollo: {},
  methods: {
    async onChange(checked) {
      console.log(`a-switch to ${checked}`);
       await this.$apollo.mutate({
        mutation: TOGGLE_SEMINAR_AVAILABILITY,
        variables: {
          id: this.seminartest.id
        },
        update: (store, { data: { update_seminartest } }) => {
          if (update_seminartest.affected_rows) {
            // if (this.type === "private") {
            const data = store.readQuery({
              query: GET_MY_SEMINARS
            });
            const seminartest = data.seminartest;
            const i = seminartest.findIndex(
              seminar => seminar.id === this.seminartest.id
            );
            seminartest[i].is_open = checked;
            store.writeQuery({
              query: GET_MY_SEMINARS,
              data
            });
            // }
          }
        },
        // refetchQueries: ["findSeminar"]
      });
      this.$store.dispatch("fetchSeminars");
      this.$emit('toggle-availability');
    }
  },
};
</script>