<script setup>
import { ref } from "vue";
import StoryCreationDialog from "./stories/StoryCreationDialog.vue";
import LogoutButton from "./auth/LogoutButton.vue";
const emit = defineEmits(["stories-updated"]);
const drawer = ref(false)

</script>
<template>
  <v-app-bar>
    <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    <v-app-bar-title class="">Pagebranch</v-app-bar-title>

    <template v-slot:append>
      <v-container class="d-flex ga-2">
        <StoryCreationDialog @stories-updated="$emit('stories-updated')" />
        <LogoutButton />
      </v-container>
    </template>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" temporary>
    <v-list>
      <v-list-item prepend-icon="mdi-home" title="Homepage"></v-list-item>
      <v-list-item prepend-icon="mdi-cog" title="Settings"></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
