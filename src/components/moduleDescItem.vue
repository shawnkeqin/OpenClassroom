<template>
<div>
<h1>{{course.title}}</h1>   
  
        <a-card title="" :bordered="false" :key="course.module_code">
              <a-collapse default-active-key="1" :bordered="false">
      <a-collapse-panel key="2" header="Update Course Details">
      <updateCourseDetailsModal />
      </a-collapse-panel>
    </a-collapse>
            
            <br/>
        <h2>Course Description </h2>
        <p>{{course.desc}}</p>
        <br />
   <h2>Notes for Observers </h2>
  <a-collapse default-active-key="1" :bordered="false">
      <a-collapse-panel key="2" header="Notes">
      <p>{{text}}</p>
      </a-collapse-panel>
    </a-collapse>
        </a-card>
  
 
  </div>
</template>

<script>
import updateCourseDetailsModal from './updateCourseDetailsModal'
export default {
  name: "moduleDescItem",
  props: ["course"],
  components: {updateCourseDetailsModal},
  data(){
    return{
      text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    }
  }
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
