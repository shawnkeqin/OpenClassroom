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
  <p>This module targets students who have completed the Beginning Spanish sequence or have had significant experience with the language (e.g., Study Abroad during their first summer at Yale-NUS or studied Spanish in high school). It offers a combination of listening and speaking practice with a review of key concepts of Spanish grammar via targeted reading and writing activities. This module continues to incorporate Hispanic cultural elements through representative texts and audiovisual materials from the Spanish-speaking world.</p>
   <h2>Schedule Description:</h2>
  <p>This course meets for seminars Mondays and Thursdays in LT1, 230-4pm.</p>
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
      <p>card content</p>
      <p>card content</p>
      <p>card content</p>
    </a-card>
  </a-card>
    </a-tab-pane>
    <a-tab-pane key="2" tab="Course B Group 1">
          <a-card title="Manage Course Information">
    <p style="fontSize: 14px;color: rgba(0, 0, 0, 0.85); marginBottom: 16px;fontWeight: 500">
      Group 1
    </p>
     <h2>Module Description: </h2>
  <p>This module targets students who have completed the Beginning Spanish sequence or have had significant experience with the language (e.g., Study Abroad during their first summer at Yale-NUS or studied Spanish in high school). It offers a combination of listening and speaking practice with a review of key concepts of Spanish grammar via targeted reading and writing activities. This module continues to incorporate Hispanic cultural elements through representative texts and audiovisual materials from the Spanish-speaking world.</p>
   <h2>Schedule Description:</h2>
  <p>This course meets for seminars Mondays and Thursdays in LT1, 230-4pm.</p>
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
      <p>card content</p>
      <p>card content</p>
      <p>card content</p>
    </a-card>
  </a-card>
    </a-tab-pane>
    <a-tab-pane key="3" tab="Course B Group 2">
     <a-card title="Manage Course Information">
    <p style="fontSize: 14px;color: rgba(0, 0, 0, 0.85); marginBottom: 16px;fontWeight: 500">
      Group 2
    </p>
  <h2>Module Description: </h2>
  <p>This module targets students who have completed the Beginning Spanish sequence or have had significant experience with the language (e.g., Study Abroad during their first summer at Yale-NUS or studied Spanish in high school). It offers a combination of listening and speaking practice with a review of key concepts of Spanish grammar via targeted reading and writing activities. This module continues to incorporate Hispanic cultural elements through representative texts and audiovisual materials from the Spanish-speaking world.</p>
   <h2>Schedule Description:</h2>
  <p>This course meets for seminars Mondays and Thursdays in LT1, 230-4pm.</p>
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
      <p>card content</p>
      <p>card content</p>
      <p>card content</p>
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

</script>
