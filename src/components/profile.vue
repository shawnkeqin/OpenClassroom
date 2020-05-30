<template>
 
    <div>
 <h1>
    My Profile
  </h1>
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
   <a-button type="primary">
      Edit
    </a-button>
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