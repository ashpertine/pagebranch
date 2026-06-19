<script setup>
  const emit = defineEmits(['popup-delete-modal'])
</script>
<template>
  <button type="button" @click="$emit('popup-delete-modal')">Delete</button>
</template>
<style scoped>
</style>
