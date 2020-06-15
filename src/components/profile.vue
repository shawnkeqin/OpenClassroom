<template>
  <div id="parent">
    <a-card title="My Profile" style="width: 1400px">
      <a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" :size= "large" />

          <!-- <div>{{profile.name}} </div>  -->
<div class="list-of-faculties">
  <profile-item
      v-for="faculty in faculty"
      :key="faculty.id"
      :faculty="faculty"
      class="faculty-item"
    >
    </profile-item>
  </div> 
  <!--  <profileItem /> -->
       
        <profileModal />
     
    </a-card>
    <br />
    <br />
    <br />
    <a-card title="My Preferences">
      <p
        style="fontSize: 14px;color: rgba(0, 0, 0, 0.85); marginBottom: 16px;fontWeight: 500"
      >
        Group title
      </p>
      <a-card title="Inner card title">
        <a slot="extra" href="#">More</a>
        Email me when new observation requests for my seminars are created.
        <a-switch default-checked />
      </a-card>
      <a-card title="Inner card title" :style="{ marginTop: '16px' }">
        <a slot="extra" href="#">More</a>
        Email me when my pending observation requests are accepted/declined.
        <a-switch default-checked />
      </a-card>
      <a-card title="Inner card title" :style="{ marginTop: '16px' }">
        <a slot="extra" href="#">More</a>
        Email me 1 hours before the next observation.
        <a-switch default-checked />
      </a-card>
    </a-card>
  </div>
</template>

<script>
//import {mapState} from 'vuex'
// import gql from "graphql-tag";
import profileModal from './profileModal'
import profileItem from './profileItem'
import queries from '../graphql/queries.gql'

export default {
  name: "Profile",
  components: {
    profileModal,
    profileItem
  },
  data() {
    return {
      faculty: []
    };
  },
  apollo: {
    faculty: {
      query: queries.findFaculty,
      variables: {
        faculty_id: "yncsjm1"
      }
    }
  }
};
</script>

<style scoped>
#parent {
  text-align: center;
}
.center {
  margin: auto;
}

.list-of-faculties {

  justify-content: center;
}
.faculty-item {
  margin: 0 10px;
}
</style>
