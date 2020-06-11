<template>
<div>
   
   <p>{{ faculty.name }}</p>
    <p>{{ faculty.id }}</p>
    <p>{{faculty.email }}</p>
  
  </div>
</template>

<script>
export default {
  name: "profileItem",
  props: ["faculty"]
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
