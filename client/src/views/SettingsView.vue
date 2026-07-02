<script setup>
import { ref } from "vue";
import AppBar from "../components/AppBar.vue";
import LogoutButton from "@/components/auth/LogoutButton.vue";
import { useTheme } from "vuetify";

import { useSettings } from "../composables/settings.js";
const { saveUpdateSettings, localSettings } = useSettings();
const theme = useTheme();

const themes = ['system', 'dark', 'light'];
const selectedTheme = ref(localSettings.value.theme ?? 'dark');

function changeTheme(variant) {
  theme.change(variant);
  localSettings.value.theme = variant;
  saveUpdateSettings();
}
</script>
<template>
  <v-app>
    <AppBar bar-title="Settings" />
    <v-main>
      <v-container>
        <v-select label="Theme" :items="themes" @update:modelValue="value => changeTheme(value)" v-model="selectedTheme"
          variant="solo-filled">
        </v-select>
        <LogoutButton />
      </v-container>
    </v-main>
  </v-app>
</template>
<style scoped></style>
