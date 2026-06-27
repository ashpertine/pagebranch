<script setup>
import { Handle } from '@vue-flow/core'
import { computed } from "vue";

// props were passed from the slot using `v-bind="customNodeProps"`
const props = defineProps(['id', 'data', 'label', 'sourcePosition', 'targetPosition'])

const isTitlePlaceholder = computed(() => props.data.title.trim().length === 0)
const isDescriptionPlaceholder = computed(() => props.data.description.trim().length === 0)

const title = computed(() =>
  isTitlePlaceholder.value ? 'No title available' : props.data.title
)

const description = computed(() =>
  isDescriptionPlaceholder.value
    ? 'No description available'
    : props.data.description
)
</script>
<template>
  <div>
    <Handle type="source" :position="sourcePosition" />
    <v-card :class="{ 'border-md border-solid border-success': data.isSelected }" :ripple="false">
      <v-card-title :class="{ 'text-disabled': isTitlePlaceholder }">
        {{ title }}
      </v-card-title>

      <v-card-text :class="{ 'text-disabled': isDescriptionPlaceholder }">
        {{ description }}
      </v-card-text>
    </v-card>
    <Handle type="target" :position="targetPosition" />
  </div>
</template>
<style scoped></style>
