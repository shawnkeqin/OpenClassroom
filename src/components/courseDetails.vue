<template>
<div>
<h1>Hello </h1>
  <a-card style="width: 300px">
    <p>Card content</p>
    <p>Card content</p>
    <p>Card content</p>
  </a-card>
<br />
<br />
<h2>Upcoming Seminars</h2>
<addNewSeminarModal />
<courseSeminarsList />

</div> 
</template>

<script>
import addNewSeminarModal from './addNewSeminarModal'
import courseSeminarsList from './courseSeminarsList'
export default {
  name: "courseDetails",
  props: ["course"],
  components: {
      addNewSeminarModal,
      courseSeminarsList
  }
}
</script>

<style scoped>

</style>
