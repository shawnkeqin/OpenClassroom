<template>
  <div>
    <a-input-search
      placeholder="input search text"
      enter-button="Search"
      size="large"
      v-model="title"
    />
    <br />
    <br />

    <p>&nbsp;</p>
    <p>&nbsp;</p>

    <div align="right">
      <h2 align="left">Results</h2>
      <div align="left" class="list-of-seminars">
        <seminarCardRequest
          v-for="seminar in seminar"
          :key="seminar.id"
          :seminar="seminar"
          class="seminar-item"
        >
        </seminarCardRequest>
      </div>
      <a-card style="width: 300px">
        <a-form :form="form">
          <h4 align="center">Filter</h4>
          <p align="center">Date Range</p>
          <!--  <a-range-picker
      :default-value="[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]"
      :format="dateFormat"
    /> -->
          <br />
          <p align="center">Timings</p>
          <p align="center">Start - End</p>
          <p align="center">
            <a-time-picker :open.sync="open2" v-model="start">
              <a-button
                slot="addon"
                size="small"
                type="primary"
                @click="handleClose"
              >
                Ok
              </a-button>
            </a-time-picker>
          </p>

          <p align="center">Instructor</p>
          <a-form-item>
            <a-select v-model="name">
              <a-select-option
                v-for="faculty in faculty"
                :value="faculty.name.toString()"
                :key="faculty.name.toString()"
              >
                {{ faculty.name.toString() }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <p align="center">Tags</p>
          <a-select
            v-model="tag_label"
            mode="tags"
            style="width: 100%"
            placeholder="Tags Mode"
          >
            <a-select-option v-for="tag in tag" :key="tag.label.toString()">
              {{ tag.label.toString() }}
            </a-select-option>
          </a-select>
        </a-form>
      </a-card>
    </div>
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

-->

    <!-- <seminar-item
      v-for="seminartest in seminartest"
      :key="seminartest.seminar_id"
      :seminartest="seminartest"
      class="seminar-item"
    > -->

    <!-- <seminarCardRequest :seminar="{module_code: 'YSC4211B', title: 'Adv Topics Molecular, Cell & Developmental Bio: Stem Cells', start: '0900', end: '1030', date: '2020-06-08', location_code: 'Y-CR20', desc: 'loremipsum1', tags: ['TAG1', 'TAG2', 'TAG3'], instructor: {name: 'Matthew Stamp', profilePic: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1627&q=80'} }" :requestStatus="''"/>  -->

    <!-- </seminar-item>  -->

    <!-- <p>{{seminartest}}</p> 
      
   <seminarCardRequest :seminar="{module_code: 'YSC3237', title: 'Introduction to Modern Algebra', start: '0900', end: '1030', date: '2020-06-08', location_code: 'Y-CR20', desc: 'loremipsum2', tags: ['TAG1', 'TAG2', 'TAG3'], instructor: {name: 'Matthew Stamp', profilePic: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1627&q=80'} }" :requestStatus="'pending'"/>
  <seminarCardRequest :seminar="{module_code: 'YSC2222', title: 'Organic Chemistry Laboratory', start: '0900', end: '1030', date: '2020-06-08', location_code: 'Y-CR20', desc: 'loremipsum3', tags: ['TAG3', 'TAG4', 'TAG5'], instructor: {name: 'NAME HERE'} }" :requestStatus="'accepted'"/>
  <seminarCardRequest :seminar="{module_code: 'YSC3253', title: 'Coral Reef Ecology and Environmental Change', start: '0900', end: '1030', date: '2020-06-08', location_code: 'Y-CR20', desc: 'loremupsum4', tags: ['TAG6', 'TAG7', 'TAG8'], instructor: {name: 'NAME HERE'} }" :requestStatus="'declined'"/> 
 -->
  </div>
</template>

<script>
import moment from "moment";
//import seminarItem from "./seminarItem";
import gql from "graphql-tag";
import seminarCardRequest from "./seminarCardRequest";
//import seminarItem from './seminarItem'

const GET_FACULTY = gql`
  query getFaculty {
    faculty {
      id
      name
    }
  }
`;

const GET_TAGS = gql`
  query MyQuery {
    tag {
      label
    }
  }
`;

export default {
  name: "viewSeminars",
  components: { seminarCardRequest },
  data() {
    return {
      form: this.$form.createForm(this, { name: "form" }),
      open2: false,
      title: "",
      name: "",
      tag_label: []

      /*    seminar: [], 
      course_title: "",
      location: "",
      date: "",
      start: "",
      end: "",
      dateFormat: 'YYYY/MM/DD',
      monthFormat: 'YYYY/MM',
      dateFormatList: ['DD/MM/YYYY', 'DD/MM/YY'], */
      // seminar: []
    };
  },
  apollo: {
    seminar: {
      query: gql`
        query MyQuery($title: String!, $name: String!, $tag_label: [String!]) {
          seminar(
            where: {
              _or: [
                { course_group: { course: { title: { _similar: $title } } } }
                { course_group: { faculty: { name: { _similar: $name } } } }
                {
                  course_group: {
                    course: { tagged_as: { tag_label: { _in: $tag_label } } }
                  }
                }
              ]
            }
            limit: 5
          ) {
            date
            start
            end
            id
            location {
              code
            }
            course_group {
              course {
                title
                module_code
              }
              group_code
              faculty {
                name
              }
            }
          }
        }
      `,
      variables() {
        return {
          title: this.title,
          name: this.name,
          start: this.start,
          tag_label: this.tag_label
        };
      }
    },
    faculty: {
      query: GET_FACULTY
    },
    tag: {
      query: GET_TAGS
    }

    //  seminartest: {
    //    query: GET_SEMINARS
    //  },
    /*   seminartest: {
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

`
*/
  },
  methods: {
    onSearch(value) {
      console.log(value);
    },
    moment,
    handleChange(value) {
      console.log(`selected ${value}`);
    },
    handleClose() {
      this.open = false;
      this.open2 = false;
    }
  }
};
</script>

<style scoped>
.list-of-seminars {
  justify-content: center;
  position: absolute;
}
.seminar-item {
  margin: 0 10px;
}

.filter {
  position: fixed;
}
</style>
