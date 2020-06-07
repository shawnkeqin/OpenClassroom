<template>
  <div>
    <table id="firstTable">
      <thead>
        <tr>
          <th>Seminar ID</th>
          <th>Course Title</th>
          <th>Start</th>
          <th>End</th>
          <th>Date</th>
          <th>Location</th>
          <th>Request Observation</th>
        </tr>
      </thead>
      <tbody>
        <tr :key="seminartest.seminar_id">
          <td>{{ seminartest.seminar_id }}</td>
          <td>{{ seminartest.course_title }}</td>
          <td>{{ seminartest.start }}</td>
          <td>{{ seminartest.end }}</td>
          <td>{{ seminartest.date }}</td>
          <td>{{ seminartest.location }}</td>
          <td>
            <div>
              <b-button v-b-toggle.collapse-1 variant="primary"
                >Toggle Collapse</b-button
              >
              <b-collapse id="collapse-1" class="mt-2">
                <b-card>
                  <p class="card-text">Collapse contents Here</p>
                </b-card>
              </b-collapse>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "seminarItem",
  props: ["seminartest"]
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
