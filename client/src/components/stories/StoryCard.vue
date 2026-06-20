<script setup>
  import { ref, computed } from "vue";
  import StoryDeleteDialog from './StoryDeleteDialog.vue';
  import StoryUpdateDialog from './StoryUpdateDialog.vue';
  const props = defineProps(['title', 'storyId', 'createdAt', 'updatedAt']);
  const emit = defineEmits(['stories-updated']);
  const deleteDialog = ref(false);
  const updateDialog = ref(false); 

  const titleTruncated = computed(() => { 
    if(props.title.length > 22) {
      return(props.title.slice(0, 22) + "...");
    }else{
      return(props.title);
    }
  })
</script>
<template>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <v-tooltip v-if="title !== titleTruncated" :text="title">
          <template v-slot:activator="{ props }">
            <span class="text-headline-small" v-bind="props"> {{ titleTruncated }} </span>
          </template>
        </v-tooltip>
        <span v-else class="text-headline-small" v-bind="props"> {{ titleTruncated }} </span>
        <v-menu >
          <template v-slot:activator="{ props }">
            <v-icon-btn icon="mdi-dots-vertical" v-bind="props"></v-icon-btn>
          </template>
          <v-list>
            <v-list-item value="update" @click="updateDialog = true">
              <v-list-item-title>
                 Edit Name
              </v-list-item-title>
            </v-list-item>
            <v-list-item value="delete" @click="deleteDialog = true">
              <v-list-item-title>
                Delete 
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-card-title>
      <v-card-subtitle>
        <span class="text-title-small"> Updated: {{ updatedAt }} </span>
      </v-card-subtitle>
      <v-card-actions>
        <v-btn>Click me</v-btn>
      </v-card-actions>
    </v-card>
    <StoryDeleteDialog v-model="deleteDialog" @close-delete-dialog="deleteDialog = false" :story-id="storyId" @stories-updated="$emit('stories-updated')"/>
    <StoryUpdateDialog v-model="updateDialog" @close-update-dialog="updateDialog = false" :story-id="storyId" :current-story-title="title" @stories-updated="$emit('stories-updated')"/>
</template>
<style scoped>
</style>
