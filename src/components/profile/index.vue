<template>
  <div>
    <div class="content-block-wrapper">
      <h1>My profile</h1>
      <a-card style="width: 700px">
        <div style="display: flex">
          <a-avatar :size="160" src="https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80" />
          <div id="profile-details">
            <h5>Name</h5>
            <p>{{ faculty.name }}</p>
            <h5>Staff ID</h5>
            <p>{{ faculty.id }}</p>
            <h5>Email</h5>
            <p style="margin: 0">{{ faculty.email }}</p>
          </div>
        </div>
      </a-card>
    </div>
    <div class="content-block-wrapper">
      <h2>My Preferences</h2>
      <a-card style="width: 700px" bodyStyle="padding: 0">
        <a-list item-layout="horizontal" size="small">
          <a-list-item class="preference-item">
            <p>Email me when new requests for my seminars are created</p>
            <a-switch default-checked />
          </a-list-item>
          <a-list-item class="preference-item" style="background-color: #F6F6F6">
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

export default {
  name: "Profile",
  data() {
    return {
      faculty: {}
    };
  },
  apollo: {
    faculty: {
      query: queries.findFaculty,
      variables: {
        faculty_id: "yncsjm1"
      },
      update: data => data.faculty[0]
    }
  }
};
</script>

<style scoped>
.content-block-wrapper {
  padding-bottom: 50px
}
#profile-card-container {
  display: flex;
  flex-direction: row;
}
#profile-details {
  margin-left: 30px;
}
.avatar {
  background-image: url("https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80");
  width: 160x;
  height: 160px;
  background-size: cover;
  background-position: top center;
  border-radius: 50%;
}
.preference-item {
  padding: 10px 20px 10px 20px;
}
.preference-item p {
  margin: 0;
}
</style>
