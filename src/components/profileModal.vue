<template>
  <div>
    {{ data.foo }}
    <button @click="$emit('close')">Cancel</button>
  </div>
</template>
<script>
export default {
  props: ["user"]
};
</script>
