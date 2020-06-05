<template>
  <div id="parent">
    <a-card title="My Profile" style="width: 1400px">
      <a-avatar shape="square" :size="64" icon="user" />
      <a-descriptions title="User Info">
        <a-descriptions-item label="UserName">
          <!-- <div>{{profile.name}} </div>  -->
          <div class="field">
            <span
              class="field-value"
              v-show="!showField('name')"
              @click="focusField('name')"
              >{{ profile.name }}</span
            >
            <input
              v-model="profile.name"
              v-show="showField('name')"
              id="profile-name"
              type="text"
              class="field-value form-control"
              @focus="focusField('name')"
              @blur="blurField"
            />
          </div>
        </a-descriptions-item>

        <a-descriptions-item label="Staff ID">
          <!-- <div>{{profile.id}}</div> -->
          <div class="field">
            <span
              class="field-value"
              v-show="!showField('id')"
              @click="focusField('id')"
              >{{ profile.id }}</span
            >
            <input
              v-model="profile.id"
              v-show="showField('id')"
              type="id"
              class="field-value form-control"
              @focus="focusField('id')"
              @blur="blurField"
            />
          </div>
        </a-descriptions-item>
        <a-descriptions-item label="Email Address">
          <!-- <div>{{profile.email}}</div> -->
          <div class="field">
            <span
              class="field-value"
              v-show="!showField('email')"
              @click="focusField('email')"
              >{{ profile.email }}</span
            >
            <input
              v-model="profile.email"
              v-show="showField('email')"
              type="email"
              class="field-value form-control"
              @focus="focusField('email')"
              @blur="blurField"
            />
          </div>
        </a-descriptions-item>
      </a-descriptions>
      <a-popover title="Title" trigger="hover">
        <template slot="content">
          <p>Click to Edit!</p>
        </template>

        <a-button type="primary">
          Edit
        </a-button>
      </a-popover>
    </a-card>
    <br />
    <br />
    <br />
    <a-card title="My Preferences">
      <p
        style="fontSize: 14px;color: rgba(0, 0, 0, 0.85); marginBottom: 16px;fontWeight: 500"
      >
        Group title
      </p>
      <a-card title="Inner card title">
        <a slot="extra" href="#">More</a>
        Email me when new observation requests for my seminars are created.
        <a-switch default-checked />
      </a-card>
      <a-card title="Inner card title" :style="{ marginTop: '16px' }">
        <a slot="extra" href="#">More</a>
        Email me when my pending observation requests are accepted/declined.
        <a-switch default-checked />
      </a-card>
      <a-card title="Inner card title" :style="{ marginTop: '16px' }">
        <a slot="extra" href="#">More</a>
        Email me 1 hours before the next observation.
        <a-switch default-checked />
      </a-card>
    </a-card>
  </div>
</template>

<script>
//import {mapState} from 'vuex'
export default {
  name: "Profile",
  components: {},
  // computed: mapState([
  //   'profile'
  // ]),
  data() {
    return {
      profile: {
        name: "Mira Seo",
        id: "yncsjm",
        email: "yncsjm@nus.edu.sg"
      },
      editField: ""
    };
  },
  methods: {
    focusField(name) {
      this.editField = name;
    },
    blurField() {
      this.editField = "";
    },
    showField(name) {
      return this.profile[name] == "" || this.editField == name;
    }
  }
};
</script>

<style scoped>
#parent {
  text-align: center;
}
.center {
  margin: auto;
}
</style>
