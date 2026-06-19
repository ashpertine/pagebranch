<script setup>
  import { ref, onMounted } from 'vue';
  import { useFlash } from '../composables/flash.js';
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
