<template>
<div >

  <a-card style="width: 1400px">

 
   <courseModule />

  </a-card>
<br />
<br />
<h2>Upcoming Seminars</h2>
<addNewSeminarModal />
<br />
<bulkSeminarStatusToggle :seminartest="seminartest" @toggle-all-availability="$emit('toggle-all-availability')" />
<br/>
<courseSeminarsList />

</div> 
</template>

<script>
import addNewSeminarModal from './addNewSeminarModal'
import courseSeminarsList from './courseSeminarsList'
import courseModule from "./courseModule";
import bulkSeminarStatusToggle from "./bulkSeminarStatusToggle"
export default {
  name: "courseDetails",
  props: ["course"],
  components: {
      addNewSeminarModal,
      courseSeminarsList,
      courseModule,
      bulkSeminarStatusToggle
  }
}
</script>

<style scoped>
.list-of-moduledesc {
  justify-content: center;
}
.moduleDesc-item {
  margin: 0 10px;
}
</style>
