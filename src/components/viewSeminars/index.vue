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
            <a-select-option v-for="tag in tag" :key="tag.label.toString()">
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
import gql from "graphql-tag";
import seminarCardRequest from "./seminarCardRequest";

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
      course_title: "",
      faculty_name: "",
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
        query MyQuery($course_title: String!, $faculty_name: String!, $tag_label: [String!]) {
          seminar(
            limit: 10
            where: {
              _and: [
                {
                  course_group: {
                    course: { title: { _similar: $course_title } }
                  }
                }
                {
                  course_group: {
                    faculty: { name: { _similar: $faculty_name } }
                {
                  course_group: {
                    course: { tagged_as: { tag_label: { _in: $tag_label } } }
                  }
                }
              ]
            }
            limit: 3
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
            }
            is_open
          }
        }
      `,
      variables() {
        return {
          course_title: this.course_title ? `%${this.course_title}%` : "%",
          faculty_name: this.faculty_name || "%",
          tag_label: this.tag_label
        };
      }
    },
    faculty_list: {
      query: GET_FACULTY,
      update: data => data.faculty
    },
    tag: {
      query: GET_TAGS
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
