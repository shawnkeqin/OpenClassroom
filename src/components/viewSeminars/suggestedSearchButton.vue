<template>
  <div v-if="selected" class="option option-selected">
    {{ label }}
    <a-icon type="close" class="option-close" @click="onSelectToggle(false)" />
  </div>
  <div v-else class="option option-unselected" @click="onSelectToggle(true)">
    {{ label }}
    <a-icon
      type="close"
      class="option-close"
      style="opacity: 0"
      @click="onSelectToggle(false)"
    />
  </div>
</template>
<script>
export default {
  props: {
    id: String,
    label: String,
    selected: Boolean
  },
  data() {
    return {};
  },
  methods: {
    onSelectToggle(value) {
      this.$emit("select-toggled", { id: this.id, value });
    }
  }
};
</script>
<style scoped>
.option {
  font-size: 20px;
  display: inline-block;
  border-radius: 30px;
  width: auto;
  padding: 5px 15px 6px 15px;
  cursor: pointer;
}
.option-selected {
  background-color: #007bff;
  color: white;
}
.option-unselected {
  margin-right: 0px;
}
.option-close {
  font-size: 14px;
  bottom: 0.3em;
  position: relative;
  padding-left: 3px;
}
</style>
