<script setup>
  import { ref } from "vue";

  const props = defineProps(['title', 'storyId', 'createdAt', 'updatedAt']);

</script>
<template>
    <p>{{ title }}</p>
    <p>{{ createdAt }}</p>
    <p>{{ updatedAt }}</p>
</template>
<style scoped>
</style>
