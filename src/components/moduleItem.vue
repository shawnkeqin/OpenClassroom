<template>
<div style="background-color: #ececec; padding: 20px;">
    <a-row :gutter="16">
      <a-col :span="8">
        <a-card title="Card title" :bordered="false" :key="course.module_code">
          <p>{{course.title}}</p>
        <p>{{course.module_code}}</p>
        <router-link to='/coursedetails'>Course Details</router-link>
        </a-card>
      </a-col> 
    </a-row>
  </div>
</template>

<script>
export default {
  name: "courseItem",
  props: ["course"]
}
</script>

<style scoped>
table {
  width: 100%;
  border: 1px solid #ccc;
}

td {
  padding: 2px;
  border: 1px solid #ccc;
}

.opened {
  background-color: yellow;
}
</style>
