<script setup>
  import Graph from "../components/editor/Graph.vue";
  import EditorAppBar from "../components/editor/EditorAppBar.vue";
</script>
<template>
  <v-app>
    <EditorAppBar />
    <v-main>
      <v-container fluid class="w-100 h-100">
        <Graph />
      </v-container>
    </v-main>
  </v-app>
</template>
