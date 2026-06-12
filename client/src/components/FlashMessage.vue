<script setup>
  import { ref, onMounted } from 'vue';
  import { useFlash } from '../composables/useFlash.js';
  const { consumeFlash } = useFlash();

  const currentType = ref("");
  const currentMessage = ref("");

  onMounted(() => {
    const current = consumeFlash();
    if(current.type && current.message) {
      currentType.value = current.type;
      currentMessage.value = current.message;
    }
  })
</script>

<template>
  <p v-if="currentMessage" id="flash-message" :class="{ 'flash-error': currentType === 'error', 'flash-success': currentType === 'success' }">
    {{ currentMessage }}
  </p>
</template>

<style scoped>
  #flash-message {
    padding: 20px 10px;
    display: inline-block;
  }
  #flash-message.flash-success {
    border: 2px solid green;
    background: lightgreen;
    color: green;
  }
  #flash-message.flash-error {
    border: 2px solid darkred;
    background: lightcoral;
    color: darkred;
  }
</style>
