<script setup>
  import StoryCreationDialog from "./stories/StoryCreationDialog.vue";
  import LogoutButton from "./auth/LogoutButton.vue";
  const emit = defineEmits(["stories-updated"]);
</script>
<template>
  <v-app-bar>
    <v-app-bar-nav-icon></v-app-bar-nav-icon>
    <v-app-bar-title>Pagebranch</v-app-bar-title>

    <template v-slot:append> 
      <v-container class="d-flex ga-2">
        <StoryCreationDialog @stories-updated="$emit('stories-updated')"/>
        <LogoutButton />
      </v-container>
    </template>
  </v-app-bar>
</template>
