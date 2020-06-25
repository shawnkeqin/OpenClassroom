<template>
  <div style="width: 35rem; margin-bottom: 20px">
    <a-card>
      <div>
        <a-col :span="7">
          <!-- <h5>Seminar ID</h5>
          <p>{{ seminar.id || "None" }}</p> -->
          <h5>Date</h5>
          <p>{{ utils.date_format(seminar.date) }}</p>
          <h5>Time</h5>
          <p>
            {{
              utils.time_format(seminar.start) +
                " - " +
                utils.time_format(seminar.end)
            }}
          </p>
          <h5>Visitor capacity</h5>
          <p>{{ seminar.visitor_capacity || "None" }}</p>
        </a-col>
        <a-col>
          <h5>Venue</h5>
          <p>{{ seminar.location.full_name }}</p>
          <h5>Seminar title</h5>
          <p>{{ seminar.title || "None" }}</p>
          <h5>Seminar description</h5>
          <p>{{ seminar.desc || "None" }}</p>
        </a-col>
      </div>
      <div
        style="display: flex; align-items: center; justify-content: space-between;"
      >
        <div style="display: flex; align-items: center;">
          <p style="margin: 0 5px 0 0">This class is open to visit requests</p>
          <a-switch
            :checked="is_open"
            checked-children="open"
            un-checked-children="closed"
            :loading="is_loading"
            @click="toggleSeminarIsOpen"
          />
        </div>
        <!-- <seminarStatusToggle :seminar_id="seminar.id" /> -->
        <!-- <h5>Seminar Availability</h5>
        <p>{{ seminar.is_open }}</p> -->
        <updateSeminarModal :seminar="seminar" />
        <!-- <updateVisitorCapacityModal /> -->
      </div>
    </a-card>
  </div>
</template>

<script>
import utils from "@/utils";
import queries from "@/graphql/queries.gql";
// import deleteSeminarModal from "./deleteSeminarModal";
import updateSeminarModal from "./updateSeminarModal";
// import archiveSeminarModal from "./archiveSeminarModal";
// import seminarStatusToggle from "./seminarStatusToggle";
// import updateVisitorCapacityModal from "./updateVisitorCapacityModal";
export default {
  name: "seminarItem",

  // components: { archiveSeminarModal, deleteSeminarModal, updateSeminarModal, seminarStatusToggle },
  components: {
    updateSeminarModal,
    // seminarStatusToggle,
    // updateVisitorCapacityModal
  },
  props: ["seminar"],
  data: function() {
    return {
      utils: utils,
      is_open: this.seminar.is_open,
      is_loading: false,
    };
  },
  methods: {
    async toggleSeminarIsOpen() {
      this.is_loading = true;
      const seminar_id = this.seminar.id;
      const current_is_open = this.is_open;
      const result = await this.$apollo.mutate({
        mutation: queries.updateSeminarIsOpen,
        variables: {
          seminar_id,
          is_open: !current_is_open
        }
      });
      this.is_open = result.data.update_seminar.returning[0].is_open;
      this.is_loading = false;
    }
  }
};
</script>

<style scoped>
table {
  font-family: "Open Sans", sans-serif;
  width: 750px;
  border-collapse: collapse;
  border: 3px solid #44475c;
  margin: 10px 10px 0 10px;
}

table th {
  text-transform: uppercase;
  text-align: left;
  background: #44475c;
  color: #fff;
  padding: 8px;
  min-width: 180px;
}

table td {
  text-align: left;
  padding: 8px;
  border-right: 2px solid #7d82a8;
}
table td:last-child {
  border-right: none;
}
table tbody tr:nth-child(2n) td {
  background: #d4d8f9;
}
</style>
