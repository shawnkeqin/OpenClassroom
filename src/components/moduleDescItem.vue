<template>
<div>
   <h1>{{course.title}}</h1>   
      
        <a-card title="Card title" :bordered="false" :key="course.module_code">
            <updateCourseDetailsModal />
            <br/>
        <h2>Course Description </h2>
        <p>{{course.desc}}</p>
        <br />
   <h2>Notes for Observers </h2>
        </a-card>
  
 
  </div>
</template>

<script>
import updateCourseDetailsModal from './updateCourseDetailsModal'
export default {
  name: "moduleDescItem",
  props: ["course"],
  components: {updateCourseDetailsModal}
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
