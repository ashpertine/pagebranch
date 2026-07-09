<script setup>
import { onMounted } from 'vue';

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
})
</script>
<template>
  {{ props.label }}
</template>
<style>
.vue-flow__edge-text {
  fill: white !important;
  font-size: 0.9rem !important;
}

.vue-flow__edge-textbg {
  fill: #37474F !important;
}
</style>
