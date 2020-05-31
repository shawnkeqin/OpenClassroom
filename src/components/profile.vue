<template>
 
    <div>
      <a-card title="My Profile" style="width: 1400px">
      <a-avatar shape="square" :size="64" icon="user" />
       <a-descriptions title="User Info">
    <a-descriptions-item label="UserName">
      Zhou Maomao
    </a-descriptions-item>
    <a-descriptions-item label="Telephone">
      1810000000
    </a-descriptions-item>
    <a-descriptions-item label="Live">
      Hangzhou, Zhejiang
    </a-descriptions-item>
    <a-descriptions-item label="Remark">
      empty
    </a-descriptions-item>
    <a-descriptions-item label="Faculty">
      Literature
    </a-descriptions-item>
      <a-descriptions-item label="Age">
     32
    </a-descriptions-item>
  </a-descriptions>
    <a-popover title="Title" trigger="hover">
      <template slot="content">
        <p>Edit Profile</p>
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
    <p style="fontSize: 14px;color: rgba(0, 0, 0, 0.85); marginBottom: 16px;fontWeight: 500">
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
export default {
  name: 'Profile',
  data() {
    return {
      their_name: this.$route.params.name
    }
  }
}
</script>