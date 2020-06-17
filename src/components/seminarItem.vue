<template>
  <div>

    <a-card
      size="small"
      title="Seminar"
      style="width: 1100px"
      :key="seminar.id"
    >
      <a slot="extra"><seminarStatusToggle :seminar_id="seminar.id" /></a>
      <a-descriptions>
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
      </a-descriptions>

      <p align="right">
        <deleteSeminarModal />
      </p>
      <p align="right">
        <archiveSeminarModal
          :seminar_id="seminar.id"
          :is_archived="seminar.is_archived"
        />
      </p>
      <p align="right">
        <updateSeminarModal />
      </p>
    </a-card>
  </div>
</template>

<script>
import utils from "../utils";
import deleteSeminarModal from "./deleteSeminarModal";
import updateSeminarModal from "./updateSeminarModal";
import archiveSeminarModal from "./archiveSeminarModal";
import seminarStatusToggle from "./seminarStatusToggle"
export default {
  name: "seminarItem",

  components: { archiveSeminarModal, deleteSeminarModal, updateSeminarModal, seminarStatusToggle },
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
