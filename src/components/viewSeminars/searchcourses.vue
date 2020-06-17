<template>
  <div>
    <a-card title="Search Courses" style="width: 1400px">
      <a-form-model
        :model="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="Course Title">
          <a-input
            v-model="form.name"
            placeholder="Please select your course title"
          />
        </a-form-model-item>
        <a-form-model-item label="Location">
          <a-select
            v-model="form.region"
            placeholder="Please select your Location"
          >
            <a-select-option value="shanghai">
              Y-CR21
            </a-select-option>
            <a-select-option value="beijing">
              Y-CR22
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="Instructors">
          <a-input
            v-model="form.name"
            placeholder="Please select your instructors"
          />
        </a-form-model-item>
        <a-form-model-item label="Date">
          <a-date-picker
            v-model="form.date1"
            show-time
            type="date"
            placeholder="Pick a date"
            style="width: 100%;"
          />
        </a-form-model-item>
        <a-form-model-item label="Days">
          <a-select
            v-model="form.region"
            placeholder="Please select which days"
          >
            <a-select-option value="shanghai">
              Everyday
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="Tags">
          <a-input v-model="form.desc" type="textarea" />
        </a-form-model-item>
        <div>
          <a-checkable-tag v-model="checked1" @change="handleChange">
            Tag1
          </a-checkable-tag>
          <a-checkable-tag v-model="checked2" @change="handleChange">
            Tag2
          </a-checkable-tag>
          <a-checkable-tag v-model="checked3" @change="handleChange">
            Tag3
          </a-checkable-tag>
          <a-checkable-tag v-model="checked4" @change="handleChange">
            Tag4
          </a-checkable-tag>
          <a-checkable-tag v-model="checked5" @change="handleChange">
            Tag5
          </a-checkable-tag>
          <a-checkable-tag v-model="checked6" @change="handleChange">
            Tag6
          </a-checkable-tag>
          <a-checkable-tag v-model="checked7" @change="handleChange">
            Tag7
          </a-checkable-tag>
          <a-checkable-tag v-model="checked8" @change="handleChange">
            Tag8
          </a-checkable-tag>
          <a-checkable-tag v-model="checked9" @change="handleChange">
            Tag9
          </a-checkable-tag>
          <a-checkable-tag v-model="checked10" @change="handleChange">
            Tag10
          </a-checkable-tag>
          <a-checkable-tag v-model="checked11" @change="handleChange">
            Tag11
          </a-checkable-tag>
          <a-checkable-tag v-model="checked12" @change="handleChange">
            Tag12
          </a-checkable-tag>
        </div>
        <br />

        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="onSubmit">
            Apply Filers
          </a-button>
          <a-button style="margin-left: 10px;">
            Clear All
          </a-button>
        </a-form-model-item>
      </a-form-model>
      <br />

      <h1>Results</h1>
      <!-- <div class = "seminars">
    <div v-for="seminar in allSeminars" :key="seminar.id" class = "seminar">{{seminar.title}}
           <searchCoursesModal /> </div>

    </div> -->
      <facultiesList />
      <!--
 <a-table :columns="columns" :data-source="data" :scroll="{ x: 1300 }">
   <br />
    <a slot="action" slot-scope="" href="javascript:;">
       
    </a>
  </a-table> -->
    </a-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import facultiesList from "./facultiesList";
//import searchCoursesModal from './searchCoursesModal'
const columns = [
  {
    title: "Full Name",
    width: 100,
    dataIndex: "name",
    key: "name",
    fixed: "left"
  },
  { title: "Age", width: 100, dataIndex: "age", key: "age", fixed: "left" },
  { title: "Column 1", dataIndex: "address", key: "1" },
  { title: "Column 2", dataIndex: "address", key: "2" },
  { title: "Column 3", dataIndex: "address", key: "3" },
  { title: "Column 4", dataIndex: "address", key: "4" },
  { title: "Column 5", dataIndex: "address", key: "5" },
  { title: "Column 6", dataIndex: "address", key: "6" },
  { title: "Column 7", dataIndex: "address", key: "7" },
  { title: "Column 8", dataIndex: "address", key: "8" },
  {
    title: "Action",
    key: "operation",
    fixed: "right",
    width: 100,
    scopedSlots: { customRender: "action" }
  }
];

const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York Park"
  },
  {
    key: "2",
    name: "Jim Green",
    age: 40,
    address: "London Park"
  }
];

export default {
  name: "searchcourses",
  components: {
    facultiesList
    //  searchCoursesModal
  },
  data() {
    return {
      data,
      columns,
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
      checked1: false,
      checked2: false,
      checked3: false,
      checked4: false,
      checked5: false,
      checked6: false,
      checked7: false,
      checked8: false,
      checked9: false,
      checked10: false,
      checked11: false,
      checked12: false
    };
  },
  methods: {
    ...mapActions(["fetchSeminars"]),
    onSubmit() {
      console.log("submit!", this.form);
    },
    handleChange(checked) {
      console.log(checked);
    }
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
