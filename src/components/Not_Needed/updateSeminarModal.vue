<template>
  <div>
    <a-button type="primary" @click="showModal">
      Update Seminar
    </a-button>
    <a-modal
      v-model="visible"
      title="Modal"
      ok-text="Confirm"
      cancel-text="Cancel"
      @ok="hideModal"
    >
      <div>
        <div>Pick a Date</div>
        <a-date-picker
          v-model="startValue"
          :disabled-date="disabledStartDate"
          show-time
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="Start"
          @openChange="handleStartOpenChange"
        />
        <a-date-picker
          v-model="endValue"
          :disabled-date="disabledEndDate"
          show-time
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="End"
          :open="endOpen"
          @openChange="handleEndOpenChange"
        />
        <a-input
          placeholder="Seminar Title Optional"
          allow-clear
          @change="onChange"
        />
        <br />
        <br />
        <a-textarea
          placeholder="Seminar Descriptin Optional"
          allow-clear
          @change="onChange"
        />
      </div>
      <br /><br />
    </a-modal>

    <br />
    <br />
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "updateSeminarModal",
  computed: {
    ...mapState({
      message: state => state.obj.message
    })
  },
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
    },
    updateMessage(e) {
      this.$store.commit("updateMessage", e.target.value);
    },
    onChange(e) {
      console.log(e);
    }
  }
};
</script>
