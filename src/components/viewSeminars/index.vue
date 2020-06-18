<template>
  <div>
    <a-input-search
      placeholder="Search by course title"
      size="large"
      v-model="course_title"
    />
    <br />
    <br />

    <p>&nbsp;</p>
    <p>&nbsp;</p>

    <div align="right">
      <h3 align="left">Results</h3>
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
            <a-select v-model="faculty_name" show-search>
              <a-select-option
                v-for="faculty in faculty_list"
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
            <a-select-option
              v-for="tag in tags_list"
              :key="tag.label.toString()"
            >
              {{ tag.label.toString() }}
            </a-select-option>
          </a-select>
        </a-form>
      </a-card>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import queries from "@/graphql/queries.gql";
import seminarCardRequest from "./seminarCardRequest";
export default {
  name: "viewSeminars",
  components: { seminarCardRequest },
  data() {
    return {
      form: this.$form.createForm(this, { name: "form" }),
      open2: false,
      course_title: "",
      faculty_name: "",
      tag_label: [],
      start: "",
      end: ""
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
      query: queries.searchSeminarsByFilters,
      variables() {
        return {
          course_title: this.course_title ? `%${this.course_title}%` : "%",
          faculty_name: this.faculty_name || "%",
          tag_label: this.tag_label
        };
      }
    },
    faculty_list: {
      query: queries.getFacultyList,
      update: data => data.faculty
    },
    tags_list: {
      query: queries.getTagsList,
      update: data => data.tag
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
