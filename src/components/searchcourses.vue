<template>
<div>
  <a-card title="Search Courses" style="width: 1400px">
   <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-model-item label="Course Title" >
      <a-input v-model="form.name" placeholder="Please select your course title"/>
    </a-form-model-item>
    <a-form-model-item label="Location">
      <a-select v-model="form.region" placeholder="Please select your Location">
        <a-select-option value="shanghai">
          Y-CR21
        </a-select-option>
        <a-select-option value="beijing">
          Y-CR22
        </a-select-option>
      </a-select>
    </a-form-model-item>
     <a-form-model-item label="Instructors">
      <a-input v-model="form.name" placeholder="Please select your instructors"/>
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
      <a-select v-model="form.region" placeholder="Please select which days">
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
 <a-table :columns="columns" :data-source="data">
    <a slot="name" slot-scope="text">{{ text }}</a>
    <span slot="customTitle"><a-icon type="smile-o" /> Name</span>
    <span slot="tags" slot-scope="tags">
      <a-tag
        v-for="tag in tags"
        :key="tag"
        :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
      >
        {{ tag.toUpperCase() }}
      </a-tag>
    </span>
    <span slot="action" slot-scope="text, record">
      <a>Invite 一 {{ record.name }}</a>
      <a-divider type="vertical" />
      <a>Delete</a>
      <a-divider type="vertical" />
      <a class="ant-dropdown-link"> More actions <a-icon type="down" /> </a>
    </span>
  </a-table>
   </a-card>
  </div>
 
</template>

<script>
const columns = [
  {
    dataIndex: 'name',
    key: 'name',
    slots: { title: 'customTitle' },
    scopedSlots: { customRender: 'name' },
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    scopedSlots: { customRender: 'tags' },
  },
  {
    title: 'Action',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

export default {
 name: 'searchcourses',
  data() {
    return {
      data,
      columns,
       labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        name: '',
        region: undefined,
        date1: undefined,
        delivery: false,
        type: [],
        resource: '',
        desc: '',
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
      checked12: false,
  };
},
 methods: {
    onSubmit() {
      console.log('submit!', this.form);
    },
      handleChange(checked) {
      console.log(checked);
    },
  },
};
</script>
