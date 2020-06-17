<template>
  <div style="background-color: #F5F5F5; padding: 20px;">
    <a-row :gutter="16">
      <a-col :span="8">

        <!-- <a-card v-bind:title="course.title" :bordered="false" :key="course.module_code">
        <p>{{course.module_code}}</p>
        <router-link to='/coursedetails'>Course Details</router-link>
        </a-card> -->
        <a-card v-bind:title="course_group.course.title" :bordered="false">
          <p>{{ course_group.course.module_code }}</p>
          <p>{{ "Group " + course_group.group_code }}</p>
          <p>
            <router-link :to="'/coursedetails/' + course_group.id"
              >Course details</router-link
            >
          </p></a-card
        >
      </a-col>

    </a-row>
  </div>
</template>

<script>
export default {
  name: "courseItem",

  props: ["course_group"]
};



</script>

<style scoped>
table {
  width: 100%;
  border: 1px solid #ccc;
}

td {
  padding: 2px;
  border: 1px solid #ccc;
}

.opened {
  background-color: yellow;
}
</style>
