<template>
  <div class="page-wrapper">
    <h1>My courses</h1>
    <div style="display: flex; align-content: flex-start">
      <template v-for="course_group in course_groups">
        <a-card :key="course_group" style="margin-right: 20px; width: 350px">
          <h3>{{ course_group.course.title }}</h3>
          <p>{{ course_group.course.module_code }}</p>
          <p>{{ "Group " + course_group.group_code }}</p>
          <router-link :to="'/coursedetails/' + course_group.id"
            >Course details</router-link
          >
        </a-card>
      </template>
    </div>
  </div>
</template>

<script>
import queries from "@/graphql/queries.gql";
import constants from "@/utils/constants";

export default {
  name: "coursesList",
  data() {
    return {
      course_groups: []
    };
  },
  apollo: {
    course_groups() {
      const faculty_id = constants.TEST_FACULTY_ID;
      return {
        query: queries.get_course_groups_by_faculty,
        variables: {
          faculty_id
        },
        update: data => data.course_group
      };
    }
  }
};
</script>

<!--
<template>
  <div>
    <h1 style="color:DarkBlue;">
      My Courses
    </h1>
    <a-tabs>
      <a-tab-pane key="2" tab="Current">
        <a-card title="Manage Course Information">
          <p
            style="fontSize: 14px;color: rgba(0, 0, 0, 0.85); marginBottom: 16px;fontWeight: 500"
          ></p>

          <h2>Manage Seminars</h2>

          <p>
            Update Seminar scheduling, observation status and view observation
            requests/upcoming observations for this course.
          </p>
          <addNewFacultyModal />
          <br />
          <deleteFacultyModal />
          <br />
          <updateFacultyModal /> -->

<!--
 <div class = "seminars">
  
    <div @dblclick="onDblClick(seminar)" v-for="seminar in allSeminars" :key="seminar.id" class = "seminar">{{seminar.title}} 
      <a-icon type="delete" @click="deleteSeminar(seminar.id)"></a-icon>
    </div>
    </div>

    <a-card size="small" title="Small size card" style="width: 1400px">
     
      <a slot="extra" href="#"> <addNewSeminarModal /></a>
            <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">  

    <br />
      <br />
    <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
     <a-button type="primary" @click="onSubmit"> 
        <updateSeminarModal />
      </a-button> 
    </a-form-model-item>
  </a-form-model> 
        </a-card> 
      </a-tab-pane>

      <a-button slot="tabBarExtraContent">
        Extra Action
      </a-button>
    </a-tabs>
    <coursesList />
  </div>
</template>
-->
<!-- <script>
//import addNewFacultyModal from "./addNewFacultyModal";
//import updateSeminarModal from './updateSeminarModal'
//import addNewSeminar from './addNewSeminar'
import { mapGetters, mapActions } from "vuex";
//import facultiesList from './facultiesList'
//import deleteFacultyModal from "./deleteFacultyModal";
//import updateFacultyModal from "./updateFacultyModal";
//import coursesList from "./coursesList";
import coursesList from "./modulesList";
export default {
  components: {
    coursesList
    //addNewFacultyModal,
    //   facultiesList,
    // deleteFacultyModal,
    // updateFacultyModal,
    // coursesList
    //  updateSeminarModal,
    //  addNewSeminar
  },
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        name: "",
        region: undefined,
        date1: undefined,
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      isAuthenticated: false,
      isLoading: true
    };
  },
  methods: {
    ...mapActions(["fetchSeminars", "deleteSeminar", "updateSeminar"]),
    onDblClick(seminar) {
      const updSeminar = {
        id: seminar.id,
        title: "change title"
      };
      this.updateSeminar(updSeminar);
    },
    onSubmit() {
      // console.log("submit!", this.form);
    },
    handleLoginEvent(data) {
      this.isAuthenticated = data.loggedIn;
      this.isLoading = false;
    }
  },
  beforeCreate() {
    this.isLoading = true;
  },
  mounted() {
    this.isLoading = false;
  },

  computed: mapGetters(["allSeminars"]),
  created() {
    this.fetchSeminars();
  }
};
</script>

<style scoped>
.seminars {
  display: block;
  block-size: auto;
}

.seminar {
  border: 1px solid #ccc;
  background: #d3d3d3;
  padding: 1rem;
  border-radius: 5px;
  text-align: center;
  position: relative;
  cursor: pointer;
}
</style>
-->
