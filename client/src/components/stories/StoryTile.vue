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
  p:first-child {
    font-size: 1.1rem;
    font-weight: 500;
    margin: 0 0 0.25rem 0;
  }

  p {
    margin: 0;
    font-size: 0.8rem;
    color: var(--light-color-text-muted, #888);
  }

  @media (prefers-color-scheme: dark) {
    p {
      color: var(--dark-color-text-muted, #aaa);
    }
  }
</style>
