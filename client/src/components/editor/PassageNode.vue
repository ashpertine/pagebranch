<script setup>
import { Handle } from '@vue-flow/core'
import { computed } from "vue";

// props were passed from the slot using `v-bind="customNodeProps"`
const props = defineProps(['id', 'data', 'label', 'sourcePosition', 'targetPosition'])
const maxLengthTitle = 20;
const maxLengthContent = 30;

const isTitlePlaceholder = computed(() => props.data.title.trim().length === 0)
const isDescriptionPlaceholder = computed(() => props.data.description.trim().length === 0)

const titlePreview = computed(() => {
  const baseTitle = isTitlePlaceholder.value ? 'No title available' : props.data.title;
  const afterTruncate = baseTitle.trim().length > maxLengthTitle ? baseTitle.slice(0, maxLengthTitle) + "..." : baseTitle;
  return afterTruncate;
}
)

const descriptionPreview = computed(() => {
  const baseDesc = isDescriptionPlaceholder.value ? 'No description available' : props.data.description;
  const afterTruncate = baseDesc.trim().length > maxLengthContent ? baseDesc.slice(0, maxLengthContent) + "..." : baseDesc;
  return afterTruncate;
}
)
</script>
<template>
  <div>
    <Handle type="source" :position="sourcePosition" />
    <v-card :class="{ 'border-md border-solid border-success': data.isSelected }" :ripple="false">
      <v-card-title :class="{ 'text-disabled': isTitlePlaceholder }">
        {{ id }}: {{ titlePreview }}
      </v-card-title>

      <v-card-text :class="{ 'text-disabled': isDescriptionPlaceholder }">
        {{ descriptionPreview }}
      </v-card-text>
    </v-card>
    <Handle type="target" :position="targetPosition" />
  </div>
</template>
<style scoped>
.vue-flow__handle-bottom {
  width: 28px;
  height: 28px;
}
</style>
