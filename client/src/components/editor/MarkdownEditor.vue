<script setup>  
  const props = defineProps(['height', 'width']);
</script>
<template>
    <v-sheet :height="height" :width="width" 
    class="position-absolute right-0 bottom-0 mr-8 mb-8 d-flex flex-column" border rounded :elevation="4">
      <v-toolbar title="Editor"></v-toolbar>
      <v-container fluid class="d-flex flex-column flex-grow-1 overflow-y-scroll ">
        <v-sheet class="flex-grow-1 overflow-x-scroll">
          <div contenteditable=true class="custom--editor-area">
          </div>
        </v-sheet>
      </v-container>
      <v-container fluid>
        <v-btn>Hello</v-btn>
      </v-container>
    </v-sheet>
</template>
<style scoped>
  .custom--editor-area,
  .custom--editor-area:focus{
    border: 0;
    outline-width: 0;
    outline: 0px solid transparent;
    color: #DBDBDB;
    height: 100%;
    overflow-y: scroll;
    font-size: 1.2rem;
  }

</style>
