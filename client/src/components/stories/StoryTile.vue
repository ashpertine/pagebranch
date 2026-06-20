<script setup>
  import { ref } from "vue";

  const props = defineProps(['title', 'storyId', 'createdAt', 'updatedAt']);

</script>
<template>
    <v-card :title="title" :subtitle="`Updated: ${updatedAt}`">
      <v-card-actions>
        <v-btn>Click me</v-btn>
      </v-card-actions>
    </v-card>
</template>
<style scoped>
</style>
