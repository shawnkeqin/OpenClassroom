<template>

<div>
     <h1>
    My Observe Log
  </h1>
  <br />
  <h2>My Observation requests</h2>
  <a-table :columns="columns" :data-source="data" :scroll="{ x: 1500, y: 300 }">
    <a slot="action" slot-scope="">action</a>
  </a-table>
  <br />
<h2>Incoming Observation Requests</h2>
   <a-table :columns="columns" :data-source="data" :scroll="{ x: 1500, y: 300 }">
    <a slot="action" slot-scope="">action</a>
  </a-table>
  </div>
</template>
<script>
const columns = [
  { title: 'Professor', dataIndex: 'name', key: 'name', fixed: 'left' },
  { title: 'Course Title',  dataIndex: 'age', key: 'age', fixed: 'left' },
  { title: 'Code', dataIndex: 'address', key: '1', width: 150 },
  { title: 'Date', dataIndex: 'address', key: '2', width: 150 },
  { title: 'Start', dataIndex: 'address', key: '3', width: 150 },
  { title: 'End', dataIndex: 'address', key: '4', width: 150 },
  { title: 'Day', dataIndex: 'address', key: '5', width: 150 },
  { title: 'Room', dataIndex: 'address', key: '6', width: 150 },
  {
    title: 'Status',
    key: 'operation',
    fixed: 'right',
    width: 100,
    scopedSlots: { customRender: 'action' },
  },
];

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}

export default {
    name: 'observelog',
  data() {
    return {
      data,
      columns,
    };
  },
};
</script>