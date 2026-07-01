<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router"
import StoryCreationDialog from "./stories/StoryCreationDialog.vue";
import LogoutButton from "./auth/LogoutButton.vue";
const props = defineProps(["barTitle"]);
const emit = defineEmits(["stories-updated"]);
const router = useRouter();
const drawer = ref(false)

</script>
<template>
  <v-app-bar>
    <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    <v-app-bar-title>{{ barTitle }}</v-app-bar-title>

    <template v-slot:append>
      <v-container class="d-flex ga-2">
        <StoryCreationDialog v-if="barTitle === 'Pagebranch'" @stories-updated="$emit('stories-updated')" />
      </v-container>
    </template>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" temporary>
    <v-list>
      <v-list-item prepend-icon="mdi-home" title="Homepage" @click="router.push({ name: 'Homepage' })"></v-list-item>
      <v-list-item prepend-icon="mdi-cog" title="Settings" @click="router.push({ name: 'Settings' })"></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
