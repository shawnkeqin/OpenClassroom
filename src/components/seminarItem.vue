<template>
  <div>
    <a-card
      size="small"
      title="Small size card"
      style="width: 1100px"
      :key="seminartest.seminar_id"
    >
      <a slot="extra" href="#">more</a>
      <p>{{ seminartest.course_title }}</p>
      <p>{{ seminartest.location }}</p>
      <archiveSeminarModal :seminartest="seminartest" @go-to-archived="$emit('go-to-archived')" />
      <deleteSeminarModal />
      <p align="right">
      <updateSeminarModal />
      </p>
    </a-card>
  </div>
</template>

<script>
import archiveSeminarModal from "./archiveSeminarModal";
import deleteSeminarModal from "./deleteSeminarModal";
import updateSeminarModal from "./updateSeminarModal";
export default {
  name: "seminarItem",
  components: { archiveSeminarModal, deleteSeminarModal, updateSeminarModal },
  props: ["seminartest"],
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
