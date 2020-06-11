<template>
  <div id="components-modal-demo-position">
    <br /><br />
    <a-button type="danger" @click="modal2Visible = true">
      Archive Seminar
    </a-button>
    <a-modal
      v-model="modal2Visible"
      title="Confirm archive?"
      centered
      @ok="() => (modal2Visible = false)"
    >
      <template slot="footer">
        <a-button key="cancel" @click="modal2Visible = false">
          >Cancel</a-button
        >
        <a-button key="submit" @click="submit">Confirm archive</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import gql from "graphql-tag";
//import { InMemoryCache } from "apollo-cache-inmemory";
const ARCHIVE_SEMINAR = gql`
  mutation archiveSeminar($id: Int!) {
    update_seminartest(_set: { archived: true }, where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;
const GET_MY_SEMINARS = gql`
  query findSeminar {
    seminartest {
      id
      archived
    }
  }
`;
export default {
  name: "archiveSeminarModal",
  props: ["seminartest"],
  data() {
    return {
      modal2Visible: false
    };
  },
  apollo: {},
  methods: {
    async submit() {
      await this.$apollo.mutate({
        mutation: ARCHIVE_SEMINAR,
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
            seminartest[i].archived = true;
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
      this.modal2Visible = false;
      this.$emit('go-to-archived');
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
