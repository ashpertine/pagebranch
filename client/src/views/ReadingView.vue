<script setup>
import { useRoute } from "vue-router";
const route = useRoute();
</script>
<template>
  <v-app>
    <v-main>
      {{ $route.params.userId }}; {{ $route.params.shareSlug }}
    </v-main>
  </v-app>
</template>
