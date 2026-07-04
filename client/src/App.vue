<script setup>
import { onMounted } from "vue";
import { useSettings } from "./composables/settings.js";

import { useTheme } from "vuetify";
const { initSettings, localSettings, storeCurrentUser } = useSettings();

const theme = useTheme();

onMounted(async () => {
  await initSettings();
  const userTheme = localSettings.value.theme ?? "dark";
  theme.change(userTheme);
})
</script>

<template>
  <RouterView v-slot="{ Component }">
    <v-slide-y-reverse-transition hide-on-leave>
      <component :is="Component" />
    </v-slide-y-reverse-transition>
  </RouterView>
</template>

<style scoped></style>
