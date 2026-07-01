<script setup>
import AppBar from "../components/AppBar.vue";
import LogoutButton from "@/components/auth/LogoutButton.vue";
</script>
<template>
  <v-app>
    <AppBar bar-title="Settings" />
    <v-main>
      <v-container>
        <v-select label="Theme" :items="['System', 'Dark', 'Light']" variant="solo-filled"></v-select>
        <LogoutButton />
      </v-container>
    </v-main>
  </v-app>
</template>
<style scoped></style>
