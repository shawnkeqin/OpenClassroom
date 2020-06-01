<template>
<div>
   <h1>
     My Courses
  </h1>
  <a-tabs>
    <a-tab-pane key="1" tab="Course A">
     <a-card title="Manage Course Information">
    <p style="fontSize: 14px;color: rgba(0, 0, 0, 0.85); marginBottom: 16px;fontWeight: 500">
      Group 1
    </p>
  <h2>Module Description: </h2>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
   <h2>Schedule Description:</h2>
  <p>This course meets for seminars {} and {} in {}, {}.</p>
     <h2>Module Syllabus:</h2>
  <a-textarea placeholder="This syllabus will be visible to all potential observers" :rows="4" />
  <h2>Additional Notes for Observers:</h2>
  <a-textarea placeholder="Please use this space for notes or announcements relevant to all potential observers of this course. For notes specific to individual sessions or observers, please use the chat functions. " :rows="4" />
    <br />
  <br />
    <a-popover trigger="hover">
      <template slot="content">
        <p>Edit Module</p>
      </template>
      <a-button type="primary">
        Edit
      </a-button>
    </a-popover>
       <br />
    <br />
    <h2>Manage Seminars </h2>
<p>Update Seminar scheduling, observation status and view observation requests/upcoming observations for this course.</p>

    <a-card size="small" title="Small size card" style="width: 1400px">
      <a slot="extra" href="#">more</a>
     <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">  
    <a-form-model-item label="Date">
      <a-date-picker
        v-model="form.date1"
        show-time
        type="date"
        placeholder="Pick a date"
        style="width: 100%;"
      />
      <br />
       <a-range-picker label="Time"
      :show-time="{ format: 'HH:mm' }"
      format="YYYY-MM-DD HH:mm"
      :placeholder="['Start Time', 'End Time']"
      @change="onChange"
      @ok="onOk"
    />
    </a-form-model-item>
  <a-input placeholder="Sminar Title (Optional)" />
<br />
<br />
    <a-input size="large" placeholder="Seminar Description (Optional)" />
    <br />
      <br />
    <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmit">
        Create
      </a-button>
      <a-button style="margin-left: 10px;">
        Cancel
      </a-button>
    </a-form-model-item>
  </a-form-model>
    </a-card>
  </a-card>
    </a-tab-pane>
    <a-tab-pane key="2" tab="Course B Group 1">
          <a-card title="Manage Course Information">
    <p style="fontSize: 14px;color: rgba(0, 0, 0, 0.85); marginBottom: 16px;fontWeight: 500">
      Group 1
    </p>
     <h2>Module Description: </h2>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
   <h2>Schedule Description:</h2>
  <p>This course meets for seminars {} and {} in {}, {}.</p>
     <h2>Module Syllabus:</h2>
  <a-textarea placeholder="This syllabus will be visible to all potential observers" :rows="4" />
  <h2>Additional Notes for Observers:</h2>
  <a-textarea placeholder="Please use this space for notes or announcements relevant to all potential observers of this course. For notes specific to individual sessions or observers, please use the chat functions. " :rows="4" />
    <br />
  <br />
    <a-popover trigger="hover">
      <template slot="content">
        <p>Edit Module</p>
      </template>
      <a-button type="primary">
        Edit
      </a-button>
    </a-popover>
       <br />
    <br />
    <h2>Manage Seminars </h2>
<p>Update Seminar scheduling, observation status and view observation requests/upcoming observations for this course.</p>

    <a-card size="small" title="Small size card" style="width: 1400px">
      <a slot="extra" href="#">more</a>
       <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">  
    <a-form-model-item label="Date">
      <a-date-picker
        v-model="form.date1"
        show-time
        type="date"
        placeholder="Pick a date"
        style="width: 100%;"
      />
      <br />
       <a-range-picker label="Time"
      :show-time="{ format: 'HH:mm' }"
      format="YYYY-MM-DD HH:mm"
      :placeholder="['Start Time', 'End Time']"
      @change="onChange"
      @ok="onOk"
    />
    </a-form-model-item>
  <a-input placeholder="Sminar Title (Optional)" />
<br />
<br />
    <a-input size="large" placeholder="Seminar Description (Optional)" />
    <br />
      <br />
    <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmit">
        Create
      </a-button>
      <a-button style="margin-left: 10px;">
        Cancel
      </a-button>
    </a-form-model-item>
  </a-form-model>
    </a-card>
  </a-card>
    </a-tab-pane>
    <a-tab-pane key="3" tab="Course B Group 2">
     <a-card title="Manage Course Information">
    <p style="fontSize: 14px;color: rgba(0, 0, 0, 0.85); marginBottom: 16px;fontWeight: 500">
      Group 2
    </p>
  <h2>Module Description: </h2>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
   <h2>Schedule Description:</h2>
  <p>This course meets for seminars {} and {} in {}, {}.</p>
     <h2>Module Syllabus:</h2>
  <a-textarea placeholder="This syllabus will be visible to all potential observers" :rows="4" />
  <h2>Additional Notes for Observers:</h2>
  <a-textarea placeholder="Please use this space for notes or announcements relevant to all potential observers of this course. For notes specific to individual sessions or observers, please use the chat functions. " :rows="4" />
  <br />
  <br />
    <a-popover trigger="hover">
      <template slot="content">
        <p>Edit Module</p>
      </template>
      <a-button type="primary">
        Edit
      </a-button>
    </a-popover>
    <br />
    <br />
    <h2>Manage Seminars </h2>
<p>Update Seminar scheduling, observation status and view observation requests/upcoming observations for this course.</p>

    <a-card size="small" title="Small size card" style="width: 1400px">
      <a slot="extra" href="#">more</a>
        <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">  
    <a-form-model-item label="Date">
      <a-date-picker
        v-model="form.date1"
        show-time
        type="date"
        placeholder="Pick a date"
        style="width: 100%;"
      />
      <br />
       <a-range-picker label="Time"
      :show-time="{ format: 'HH:mm' }"
      format="YYYY-MM-DD HH:mm"
      :placeholder="['Start Time', 'End Time']"
      @change="onChange"
      @ok="onOk"
    />
    </a-form-model-item>
  <a-input placeholder="Sminar Title (Optional)" />
<br />
<br />
    <a-input size="large" placeholder="Seminar Description (Optional)" />
    <br />
      <br />
    <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmit">
        Create
      </a-button>
      <a-button style="margin-left: 10px;">
        Cancel
      </a-button>
    </a-form-model-item>
  </a-form-model>
    </a-card>
  </a-card>

    </a-tab-pane>
    <a-button slot="tabBarExtraContent">
      Extra Action
    </a-button>
  </a-tabs>
  </div>
</template>
<script>
export default {
  data() {
    return {
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
    };
  },
  methods: {
    onSubmit() {
      console.log('submit!', this.form);
    },
  },
};
</script>
