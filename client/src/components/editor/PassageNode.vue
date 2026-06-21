<script setup>
import { Handle } from '@vue-flow/core'

// props were passed from the slot using `v-bind="customNodeProps"`
const props = defineProps(['data', 'label', 'sourcePosition', 'targetPosition'])
</script>
<template>
  <div>
    <Handle type="source" :position="sourcePosition" />
    <v-card>
      <v-card-title>{{ data.title }}</v-card-title>
      <v-card-text>
        {{ data.description }}
      </v-card-text>
    </v-card>
    <Handle type="target" :position="targetPosition" />
  </div>
</template>
