<template>
<div >

  <a-card style="width: 1400px">

 
   <courseModule />

  </a-card>
<br />
<br />
<h2>Upcoming Seminars</h2>
<addNewSeminarModal />
<br/>
<courseSeminarsList />

</div> 
</template>

<script>
import addNewSeminarModal from './addNewSeminarModal'
import courseSeminarsList from './courseSeminarsList'
import courseModule from "./courseModule";
export default {
  name: "courseDetails",
  props: ["course"],
  components: {
      addNewSeminarModal,
      courseSeminarsList,
      courseModule
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
