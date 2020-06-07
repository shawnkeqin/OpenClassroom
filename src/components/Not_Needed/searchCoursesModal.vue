<template>
  <div>
    <a-button type="primary" @click="showModal">
      Confirm
    </a-button>
    <a-modal
      v-model="visible"
      title="Modal"
      ok-text="Confirm"
      cancel-text="Cancel"
      @ok="hideModal"
    >
      <p>Confirm Attendance?</p>
    </a-modal>
    <br />
    <br />
  </div>
</template>
<script>
export default {
  name: "searchCoursesModal",
  data() {
    return {
      visible: false
    };
  },
  methods: {
    showModal() {
      this.visible = true;
    },
    hideModal() {
      this.visible = false;
    },
    confirm() {
      this.$confirm({
        title: "Confirm",
        content: "Bla bla ...",
        okText: "确认",
        cancelText: "取消"
      });
    }
  }
};
</script>
