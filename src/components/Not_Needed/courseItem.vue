<template>
  <div id="app">
 
       <table id="firstTable">

    <tr>
          <th>Course Title</th>
          <th>Module Code</th>
          <th>Faculty ID</th>
          <th>Course Description</th>
          <th>Syllabus</th>
          <th>Schedule</th>
        </tr> 
   
   <!--  <tr @click="toggle(course.module_code)" :class="{ opened: opened.includes(course.module_code) }" :key="course.module_code"> -->
         <tr :key="course.module_code">
        <td>{{ course.course_groups }}</td>
        <td>{{ course.module_code }}</td>
        <td>{{ course.course_groups.faculty_id }}</td>
        <td>{{ course.desc }}</td>
        <td>{{ course.course_groups.syllabus }}</td>
        <td>{{ course.course_groups.schedule_desc }}</td>
     </tr>
   <!--     <tr v-if="opened.includes(course.module_code)">
        <td colspan="2">ON!</td>
      </tr>  -->
    
    </table>

  </div>
</template>

<script>
export default {
  name: "courseItem",
  props: ["course"],
  methods: {
    toggle(module_code) {
      const index = this.opened.indexOf(module_code);
      if (index > -1) {
        this.opened.splice(index, 1);
      } else {
        this.opened.push(module_code);
      }
    }
  }
};
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
