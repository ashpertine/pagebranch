<script setup>
  import { ref } from "vue";
  import { createDeleteStoryRequest } from "../../api/stories-api.js";

  const errorMsg = ref("");

  const emit = defineEmits(["stories-updated", "close-delete-dialog"]);
  const props = defineProps(["storyId"]);

  async function deleteStory(story_id) {
    const response = await createDeleteStoryRequest(story_id);
    if(response.responseErr) {
      errorMsg.value = response.responseErr;
    }
    const body = await response.json();

    if(response.ok) {
      emit("close-delete-dialog");
      emit("stories-updated");
    }else {
      errorMsg.value = body.errorMsg;
    }
  }
</script>
<template>
  <v-dialog max-width="500">
    <v-card>
      <v-card-title>Delete Story</v-card-title>
      <v-card-subtitle>Are you sure you want to delete this story?</v-card-subtitle>
      <div class="text-title-medium text-red-lighten-2 pb-4 px-5 rounded-md"  v-if="errorMsg.length !== 0"> {{ errorMsg }}</div>
      <v-form class="px-5" @submit.prevent="deleteStory(storyId)">
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text="Close"
            color="primary"
            size="large"
            @click="$emit('close-delete-dialog')"
          ></v-btn>
          <v-btn variant="tonal" size="large" type="submit" append-icon="mdi-delete" color="red" >Delete</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<style scoped>
</style>
