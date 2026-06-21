<script setup></script>

<template>
  <RouterView v-slot="{ Component }">
    <v-slide-y-reverse-transition hide-on-leave>
      <component :is="Component" />
    </v-slide-y-reverse-transition>
  </RouterView>
</template>

<style scoped></style>
