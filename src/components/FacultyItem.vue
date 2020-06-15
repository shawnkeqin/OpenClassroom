<template>
  <!-- <div :key="faculty.id">
    <p>{{ faculty.email}}</p>
    <p>{{ faculty.name }}</p>
    <p>{{ faculty.is_active }}</p>
    <p>{{ faculty.id }}</p>  -->
  <!-- <div :key="faculty.id" id="components-table-demo-size">
    <h4>Middle size table</h4>
    <a-table :columns="columns" :data-source="faculty" size="middle" />
  </div> -->
  <div>
    <table id="firstTable">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Profession</th>
          <th>View Seminar</th>
        </tr>
      </thead>
      <tbody>
        <tr :key="faculty.id">
          <td>{{ faculty.id }}</td>
          <td>{{ faculty.name }}</td>
          <td>{{ faculty.email }}</td>
          <td>{{ faculty.is_active }}</td>
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
  name: "FacultyItem",
  props: ["faculty"]
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
  min-width: 250px;
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
