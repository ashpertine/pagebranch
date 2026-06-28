<template>
  <v-sheet :height="40" :width="150" border color="success" class="d-flex justify-center align-center" rounded>
    <div class="chat-extend"></div>
    <text-display-small>This is the start.</text-display-small>
  </v-sheet>
</template>
<style scoped>
.chat-extend {
  width: 20px;
  background-color: transparent;
  height: 20px;
  position: absolute;
  right: -20px;
  top: 10px;
  border-right: 10px solid transparent;
  border-top: 10px solid transparent;
  border-left: 10px solid #45c69d;
  border-bottom: 10px solid transparent;
}
</style>
