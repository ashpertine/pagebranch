<script setup>
  import { ref } from "vue";
  import { createDeleteStoryRequest } from "../../api/stories-api.js";

  const errorMsg = ref("");
  const emit = defineEmits(["stories-updated", "close-delete-modal"]);
  const props = defineProps(["isHidden", "storyId"]);

  async function deleteStory(story_id) {
    const response = await createDeleteStoryRequest(story_id);
    if(response.responseErr) {
      errorMsg.value = response.responseErr;
    }
    const body = await response.json();

    if(response.ok) {
      emit("close-delete-modal");
      emit("stories-updated");
    }else {
      errorMsg.value = body.errorMsg;
    }
  }

</script>
<template>
  <div class="modal story-delete" v-if="!isHidden">
    <button type="button" @click="$emit('close-delete-modal')">Close</button>
    <span>Are you sure you want to delete this story?</span>
    <span class="error-msg" v-if="errorMsg.length !== 0">{{ errorMsg }}</span>
    <button type="submit" @click.prevent="deleteStory(storyId)" :disabled="errorMsg.length !== 0" @click="$emit('close-delete-modal')">Yes</button>
  </div>
</template>
<style scoped>
</style>
