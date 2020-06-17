<template>
  <div>
    <a-input-search
      placeholder="input search text"
      enter-button="Search"
      size="large"
      @search="onSearch"
    />
    <br/>
       <br/>

<p>&nbsp;</p>
<p>&nbsp;</p>
     <p align="right">
  <a-card style="width: 300px">
 <p align="center">Filter</p>
  <p align="center">Date Range</p>
   <a-range-picker
      :default-value="[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]"
      :format="dateFormat"
    />
    <br />
     <p align="center">Timings</p>
     <p align="center">Start - End</p>
     <p align="center">
       <a-time-picker :default-value="moment('12:08', 'HH:mm')" format="HH:mm" align="center" />
      
         <a-time-picker :default-value="moment('12:08', 'HH:mm')" format="HH:mm" align="center" />
         </p>
    <p align="center">Instructor</p>
     <a-select mode="tags" style="width: 100%" placeholder="Tags Mode" @change="handleChange">
    <a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i">
      {{ (i + 9).toString(36) + i }}
    </a-select-option>
  </a-select>
     <p align="center">Tags</p>
       <a-select mode="tags" style="width: 100%" placeholder="Tags Mode" @change="handleChange">
    <a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i">
      {{ (i + 9).toString(36) + i }}
    </a-select-option>
  </a-select>
  </a-card>
  
  
    
      </p>
  <!--  <a-card title="Search Courses" style="width: 1400px">
     <form @submit.prevent="submit">
        <fieldset>
          <input type="text" placeholder="Seminar ID" v-model="seminar_id" />
          <input
            type="text"
            placeholder="Course Title"
            v-model="course_title"
          />
          <input type="text" placeholder="Start" v-model="start" />
          <input type="text" placeholder="End" v-model="end" />
          <input type="text" placeholder="Date" v-model="date" />
          <input type="text" placeholder="Location" v-model="location" />
        </fieldset>
        <input class="button-primary" type="submit" value="Send" />
      </form> -->
   <!--    <a-descriptions title="Search Fields">
    <a-descriptions-item label="Seminar ID">
   <input v-model="seminar_id" placeholder="Seminar ID"  />
    </a-descriptions-item>
    <a-descriptions-item label="Course Title">
  <input v-model="course_title" placeholder="Course Title" />
    </a-descriptions-item>
    <a-descriptions-item label="Location">
  <input v-model="location" placeholder="location" />
    </a-descriptions-item>
    <a-descriptions-item label="Date">

  <input type="date" v-model="date" placeholder="date" />
    </a-descriptions-item>
        <a-descriptions-item label="Start">

  <input type="time" id="start" v-model="start" placeholder="start" />
    </a-descriptions-item>
        <a-descriptions-item label="End">

  <input type="time" v-model="end" placeholder="end" />
    </a-descriptions-item>
 
  </a-descriptions>


      <br />
      <br />
      <br />
      <h2>Results</h2>
  <div class="list-of-seminars">
   <seminar-item
      v-for="seminartest in seminartest"
      :key="seminartest.seminar_id"
      :seminartest="seminartest"
      class="seminar-item"
    > 
  <seminarCardRequest :seminar="{module_code: 'YSC4211B', title: 'Adv Topics Molecular, Cell & Developmental Bio: Stem Cells', start: '0900', end: '1030', date: '2020-06-08', location_code: 'Y-CR20', desc: 'loremipsum1', tags: ['TAG1', 'TAG2', 'TAG3'], instructor: {name: 'Matthew Stamp', profilePic: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1627&q=80'} }" :requestStatus="''"/> 
   <seminarCardRequest  v-for="seminartest in seminartest"
      :key="seminartest.seminar_id"
      :seminartest="seminartest"
      class="seminar-item" >
  </seminarCardRequest >
    </seminar-item> 
  </div>
     <p>{{seminartest}}</p> 
      
   <seminarCardRequest :seminar="{module_code: 'YSC3237', title: 'Introduction to Modern Algebra', start: '0900', end: '1030', date: '2020-06-08', location_code: 'Y-CR20', desc: 'loremipsum2', tags: ['TAG1', 'TAG2', 'TAG3'], instructor: {name: 'Matthew Stamp', profilePic: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1627&q=80'} }" :requestStatus="'pending'"/>
  <seminarCardRequest :seminar="{module_code: 'YSC2222', title: 'Organic Chemistry Laboratory', start: '0900', end: '1030', date: '2020-06-08', location_code: 'Y-CR20', desc: 'loremipsum3', tags: ['TAG3', 'TAG4', 'TAG5'], instructor: {name: 'NAME HERE'} }" :requestStatus="'accepted'"/>
  <seminarCardRequest :seminar="{module_code: 'YSC3253', title: 'Coral Reef Ecology and Environmental Change', start: '0900', end: '1030', date: '2020-06-08', location_code: 'Y-CR20', desc: 'loremupsum4', tags: ['TAG6', 'TAG7', 'TAG8'], instructor: {name: 'NAME HERE'} }" :requestStatus="'declined'"/> 
    </a-card> -->
  </div>
</template>

<script>
import moment from 'moment';
//import seminarItem from "./seminarItem";
import gql from "graphql-tag";
//import seminarCardRequest from "./seminarCardRequest"
//import seminarItem from './seminarItem'
/*const GET_SEMINARS = gql`
  query getSeminars {
    seminartest {
      course_title
      date
      end
      location
      seminar_id
      start
    }
  }
`; */
export default {
  name: "viewSeminars",
 // components: { seminarCardRequest },
  data() {
    return {
     seminar_id: "",
     // seminartest: [] 
      course_title: "",
      location: "",
      date: "",
      start: "",
      end: "",
      dateFormat: 'YYYY/MM/DD',
      monthFormat: 'YYYY/MM',
      dateFormatList: ['DD/MM/YYYY', 'DD/MM/YY'],
      
    
     
     
    //  seminartest: []
    };
  },
  apollo: {
  //  seminartest: {
  //    query: GET_SEMINARS
  //  },
    seminartest: {
    query: gql`
query findSeminar($seminar_id: String!, $course_title: String!, $location: String!, $date: String!,  $start: String! , $end: String!)  {
  seminartest(where: {_or: [{location: {_similar: $location}}, {course_title: {_similar: $course_title}},{seminar_id: {_similar: $seminar_id}},  {date: {_eq: $date}},  {start: {_eq: $start}}, {end: {_eq: $end}}] }) {
    course_title
    seminar_id
    location
    date
    start
    end
  
  }
}
`, 
/*
query: gql`
query findSeminar( $course_title: String , $location: String!) {
   	seminartest(where: {course_title: {_eq:$course_title} , _or: {location: {_eq: $location}}){
       course_title
       seminar_id
        location
       
     }
  }
`, 
*/
variables() {
  return {
    seminar_id: this.seminar_id,
    course_title: this.course_title,
    location: this.location,
    date: this.date,
    start: this.start, 
    end: this.end 
   
 


  }
}
}

  },
  methods: {
  onSearch(value) {
      console.log(value);
    },
    moment,
    handleChange(value) {
      console.log(`selected ${value}`);
    },
  } 
};
</script>

<style scoped>
.list-of-seminars {
  justify-content: center;
}
.seminar-item {
  margin: 0 10px;
}
</style>
