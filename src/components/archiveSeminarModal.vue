<template>
  <div id="components-modal-demo-position">
    <br /><br />
    <template v-if="!is_archived">
      <a-button type="danger" @click="archiveModalVisible = true">
        Archive Seminar
      </a-button>
      <a-modal
        v-model="archiveModalVisible"
        title="Confirm archive?"
        centered
        @ok="() => (archiveModalVisible = false)"
      >
        <template slot="footer">
          <a-button key="cancel" @click="archiveModalVisible = false">
            Cancel</a-button
          >
          <a-button key="submit" @click="handleArchive"
            >Confirm archive</a-button
          >
        </template>
      </a-modal>
    </template>
    <template v-else>
      <a-button type="danger" @click="unarchiveModalVisible = true">
        Unarchive Seminar
      </a-button>
      <a-modal
        v-model="unarchiveModalVisible"
        title="Confirm unarchive?"
        centered
        @ok="() => (unarchiveModalVisible = false)"
      >
        <template slot="footer">
          <a-button key="cancel" @click="unarchiveModalVisible = false">
            Cancel</a-button
          >
          <a-button key="submit" @click="handleUnarchive"
            >Confirm unarchive</a-button
          >
        </template>
      </a-modal>
    </template>
  </div>
</template>
<script>

import queries from "../graphql/queries.gql";

export default {
  name: "archiveSeminarModal",
  props: ["seminar_id", "is_archived"],
  data() {
    return {
      archiveModalVisible: false,
      unarchiveModalVisible: false
    };
  },
  apollo: {},
  methods: {
    async handleArchive() {
      const seminar_id = this.seminar_id;
      await this.$apollo.mutate({
        mutation: queries.archive_seminar,
        variables: {
          seminar_id
        },
        // update: (store, { data: { update_seminartest } }) => {
        //   if (update_seminartest.affected_rows) {
        //     const data = store.readQuery({
        //       query: GET_MY_SEMINARS
        //     });
        //     const seminartest = data.seminartest;
        //     const i = seminartest.findIndex(
        //       seminar => seminar.id === this.seminartest.id
        //     );
        //     seminartest[i].archived = true;
        //     store.writeQuery({
        //       query: GET_MY_SEMINARS,
        //       data
        //     });
        //   }
        // },
        refetchQueries: ["get_seminars_by_course_group"]
      });
      this.modal2Visible = false;
    },
    async handleUnarchive() {
      const seminar_id = this.seminar_id;
      await this.$apollo.mutate({
        mutation: queries.unarchive_seminar,
        variables: {
          seminar_id
        },
        refetchQueries: ["get_seminars_by_course_group"]
      });
      this.modal2Visible = false;
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
