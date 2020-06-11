<template>
<div>
<h1>Outcoming Visits</h1>
<br />
        <seminarCardRequest :seminar="{module_code: 'YSC4211B', title: 'Adv Topics Molecular, Cell & Developmental Bio: Stem Cells', start: '0900', end: '1030', date: '2020-06-08', location_code: 'Y-CR20', desc: 'loremipsum1', tags: ['TAG1', 'TAG2', 'TAG3'], instructor: {name: 'Matthew Stamp', profilePic: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1627&q=80'} }" :requestStatus="''"/>
  <seminarCardRequest :seminar="{module_code: 'YSC3237', title: 'Introduction to Modern Algebra', start: '0900', end: '1030', date: '2020-06-08', location_code: 'Y-CR20', desc: 'loremipsum2', tags: ['TAG1', 'TAG2', 'TAG3'], instructor: {name: 'Matthew Stamp', profilePic: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1627&q=80'} }" :requestStatus="'pending'"/>
  <seminarCardRequest :seminar="{module_code: 'YSC2222', title: 'Organic Chemistry Laboratory', start: '0900', end: '1030', date: '2020-06-08', location_code: 'Y-CR20', desc: 'loremipsum3', tags: ['TAG3', 'TAG4', 'TAG5'], instructor: {name: 'NAME HERE'} }" :requestStatus="'accepted'"/>
  <seminarCardRequest :seminar="{module_code: 'YSC3253', title: 'Coral Reef Ecology and Environmental Change', start: '0900', end: '1030', date: '2020-06-08', location_code: 'Y-CR20', desc: 'loremupsum4', tags: ['TAG6', 'TAG7', 'TAG8'], instructor: {name: 'NAME HERE'} }" :requestStatus="'declined'"/>
</div>
</template>

<script>
import seminarCardRequest from "./seminarCardRequest"
export default {
  name: "observelog",
  components: {
    seminarCardRequest
  }

}

</script>

<style scoped>

</style>