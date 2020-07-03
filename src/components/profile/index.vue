<template>
  <div class="page-wrapper">
    <div class="content-block-wrapper">
      <h1>My profile</h1>
      <a-card style="width: 40rem">
        <a-row type="flex" align="middle" :gutter="20">
          <a-col :xs="24" :sm="8" align="middle" justify="center">
            <a-avatar
              :size="160"
              src="https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80"
            />
          </a-col>
          <a-col>
            <h5>Name</h5>
            <p>{{ faculty.name }}</p>
            <h5>Staff ID</h5>
            <p>{{ faculty.id }}</p>
            <h5>Email</h5>
            <p style="margin: 0">{{ faculty.email }}</p>
          </a-col>
        </a-row>
      </a-card>
    </div>
    <div class="content-block-wrapper">
      <h2>My Preferences</h2>
      <a-card style="width: 40rem" bodyStyle="padding: 0">
        <a-list item-layout="horizontal" size="small">
          <a-list-item class="preference-item">
            <p>Email me when new requests for my seminars are created</p>
            <a-switch default-checked />
          </a-list-item>
          <a-list-item
            class="preference-item"
            style="background-color: #F6F6F6"
          >
            <p>Email me when my pending requests are accepted/declined</p>
            <a-switch default-checked />
          </a-list-item>
          <a-list-item class="preference-item">
            <p>Email me 1 hour before the next visit</p>
            <a-switch default-checked />
          </a-list-item>
        </a-list>
      </a-card>
    </div>
  </div>
</template>

<script>
import queries from "@/graphql/queries.gql";
import constants from "@/utils/constants";

export default {
  name: "Profile",
  data() {
    return {
      faculty: {}
    };
  },
  apollo: {
    faculty: {
      query: queries.getFacultyById,
      variables: {
        faculty_id: constants.TEST_FACULTY_ID
      },
      update: data => data.faculty_by_pk
    }
  }
};
</script>

<style scoped>
#profile-card-container {
  display: flex;
  flex-direction: row;
}
#profile-details {
  margin-left: 30px;
}
.preference-item {
  padding: 10px 20px 10px 20px;
}
.preference-item p {
  margin: 0;
}
</style>
