<script setup>
  import StoryCreationWindow from "./stories/StoryCreationWindow.vue";
  import LogoutButton from "./LogoutButton.vue";
  const emit = defineEmits(["stories-updated"]);
</script>
<template>
  <v-app-bar>
    <v-app-bar-nav-icon></v-app-bar-nav-icon>
    <v-app-bar-title>Pagebranch</v-app-bar-title>

    <template v-slot:append> 
      <v-container class="d-flex ga-2">
        <StoryCreationWindow @stories-updated="$emit('stories-updated')"/>
        <LogoutButton />
      </v-container>
    </template>
  </v-app-bar>
</template>
