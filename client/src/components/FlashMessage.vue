<script setup>
import { ref, onMounted } from 'vue';
import { useFlash } from '../composables/flash.js';
const { consumeFlash } = useFlash();

const currentType = ref("");
const currentMessage = ref("");

onMounted(() => {
  const current = consumeFlash();
  if (current.type && current.message) {
    currentType.value = current.type;
    currentMessage.value = current.message;
  }
})
</script>

<template>
  <v-card :title="currentType === 'error' ? 'Error' : 'Success'" variant="outlined"
    class="text-title-medium opacity-80 mb-2" :text="currentMessage" v-if="currentMessage" id="flash-message"
    :class="{ 'text-red-lighten-2 ': currentType === 'error', 'text-green-lighten-2': currentType === 'success' }">
  </v-card>
</template>
