<script setup>
  const emit = defineEmits(['popup-delete-modal'])
</script>
<template>
  <button type="button" @click="$emit('popup-delete-modal')">Delete</button>
</template>
<style scoped>
  button {
    background-color: var(--color-error);
    color: #fff;
    border-radius: 10px;
    padding: 0.8em 1em;
    border: 0;
    font-size: 1rem;
    cursor: pointer;
    align-self: flex-start;
  }
</style>
