<script setup>
import { ref } from "vue";
import { createUpdateStoryRequest } from "../../api/stories-api.js";

const emit = defineEmits(["stories-updated", "close-update-dialog"]);
const props = defineProps(['storyId', 'currentStoryTitle'])

const errorMsg = ref("");
const storyTitle = ref(props.currentStoryTitle);
const form = ref();

async function updateStory(story_title, story_id) {
  const { valid } = await form.value.validate();
  if (!valid) {
    return;
  }

  const response = await createUpdateStoryRequest(story_title, story_id)
  if (response.errorMsg) {
    errorMsg.value = response.responseErr;
  }

  const body = await response.json();
  if (response.ok) {
    emit("close-update-dialog");
    emit("stories-updated");
  } else {
    errorMsg.value = body.errorMsg;
  }
}

const titleRules = [
  value => {
    if (value.length === 0) return 'Story title must not be empty.';
    if (value === props.currentStoryTitle) return 'Story title is unchanged.'
    return true;
  }
]
</script>
<template>
  <v-dialog max-width="500">
    <v-card>
      <v-card-title>Edit Name</v-card-title>
      <v-card-subtitle>Enter a new name.</v-card-subtitle>
      <div class="text-title-medium text-red-lighten-2 pb-4 px-5 rounded-md" v-if="errorMsg.length !== 0"> {{ errorMsg
      }}</div>
      <v-form class="px-4 py-4" @submit.prevent="updateStory(storyTitle, storyId)" ref="form">
        <v-text-field label="Title" v-model="storyTitle" :rules="titleRules"></v-text-field>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Close" color="primary" size="large" @click="$emit('close-update-dialog')"></v-btn>
          <v-btn variant="tonal" size="large" type="submit" append-icon="mdi-pencil-outline"
            color="green">Update</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<style scoped></style>
