<template>
  <div style="width: 35rem; margin-bottom: 20px">
    <div
      style="display: flex; align-items: center; justify-content: space-between; padding: 0 20px 0 20px; margin-bottom: 5px;"
    >
      <div style="display: flex; align-items: center;">
        <p style="margin: 0 10px 0 0">
          {{
            `This class is ${
              seminar.is_open ? `open` : `closed`
            } to visit requests`
          }}
        </p>
        <a-switch
          :checked="seminar.is_open"
          checked-children="open"
          un-checked-children="closed"
          :loading="is_loading"
          @click="toggleSeminarIsOpen"
        />
      </div>
      <updateSeminarModal :seminar="seminar" />
    </div>
    <a-card
      :bodyStyle="{ 'padding-bottom': '5px' }"
      :class="{ closed: !seminar.is_open }"
    >
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
      <!-- <seminarStatusToggle :seminar_id="seminar.id" /> -->
      <!-- <h5>Seminar Availability</h5>
        <p>{{ seminar.is_open }}</p> -->
      <!-- <updateVisitorCapacityModal /> -->
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
    updateSeminarModal
    // seminarStatusToggle,
    // updateVisitorCapacityModal
  },
  props: ["seminar"],
  data: function() {
    return {
      utils: utils,
      is_loading: false
    };
  },
  methods: {
    async toggleSeminarIsOpen() {
      this.is_loading = true;
      const seminar_id = this.seminar.id;
      const current_is_open = this.seminar.is_open;
      await this.$apollo.mutate({
        mutation: queries.updateSeminarIsOpen,
        variables: {
          seminar_id,
          is_open: !current_is_open
        },
        refetchQueries: ["get_seminars_by_course_group"]
      });
      this.is_loading = false;
    }
  }
};
</script>

<style scoped>
.closed {
  background-color: rgba(0, 0, 0, 0.12);
}
</style>
