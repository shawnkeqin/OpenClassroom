<template>
  <div style="margin-bottom: 20px">
    <a-card style="width: 700px" :key="seminar.id">
      <a-row>
        <a-col :span="5">
          <h5>Date</h5>
          <p>{{ utils.date_format(seminar.date) }}</p>
        </a-col>
        <a-col :span="7">
          <h5>Time</h5>
          <p>
            {{
              utils.time_format(seminar.start) +
                " - " +
                utils.time_format(seminar.end)
            }}
          </p>
        </a-col>
        <a-col>
          <h5>Venue</h5>
          <p>{{ seminar.location.full_name }}</p>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <h5>Seminar title</h5>
          <p>{{ seminar.title || "None" }}</p>
        </a-col>
        <a-col>
          <h5>Visitor capacity</h5>
          <p>{{ seminar.visitor_capacity || "None" }}</p>
        </a-col>
      </a-row>
      <a-row>
        <h5>Seminar description</h5>
        <p>{{ seminar.desc || "None" }}</p>

        <h5>Seminar ID</h5>
        <p>{{ seminar.id || "None" }}</p>
      </a-row>
      <div style="display: flex; align-items: center;">
        <p style="margin: 0 20px 0 0">This class is open to visit requests</p>
        <seminarStatusToggle :seminar_id="seminar.id" />
      </div>
      <div>
        <updateVisitorCapacityModal />
      </div>
      <!-- <a-descriptions>
        <a-descriptions-item label="Date">
          {{ utils.date_format(seminar.date) }}
        </a-descriptions-item>
        <a-descriptions-item label="Time">
          {{
            utils.time_format(seminar.start) +
              " - " +
              utils.time_format(seminar.end)
          }}
        </a-descriptions-item>
        <a-descriptions-item label="Location">
          {{ seminar.location.full_name }}
        </a-descriptions-item>
        <a-descriptions-item label="Seminar title">
          {{ seminar.title }}
        </a-descriptions-item>
        <a-descriptions-item label="Seminar description">
          {{ seminar.desc }}
        </a-descriptions-item>
        <a-descriptions-item label="Visitor capacity">
          {{ seminar.visitor_capacity }}
        </a-descriptions-item>
      </a-descriptions> -->

      <p align="right">
        <!-- <deleteSeminarModal /> -->
      </p>
      <p align="right">
        <!-- <archiveSeminarModal
          :seminar_id="seminar.id"
          :is_archived="seminar.is_archived"
        /> -->
      </p>
      <p align="right">
        <updateSeminarModal />
      </p>
    </a-card>
  </div>
</template>

<script>
import utils from "@/utils";
// import deleteSeminarModal from "./deleteSeminarModal";
import updateSeminarModal from "./updateSeminarModal";
// import archiveSeminarModal from "./archiveSeminarModal";
import seminarStatusToggle from "./seminarStatusToggle";
import updateVisitorCapacityModal from "./updateVisitorCapacityModal";
export default {
  name: "seminarItem",

  // components: { archiveSeminarModal, deleteSeminarModal, updateSeminarModal, seminarStatusToggle },
  components: {
    updateSeminarModal,
    seminarStatusToggle,
    updateVisitorCapacityModal
  },
  props: ["seminar"],
  data: function() {
    return {
      utils: utils
    };
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
