<script setup>
  import { ref } from "vue";
  import { createMakeStoryRequest } from "../../api/stories-api.js";

  const emit = defineEmits(["stories-updated"]);

  const errorMsg = ref("");
  const storyTitle = ref("");
  const isHidden = ref(true);

  async function makeStory(story_title) {
    const response = await createMakeStoryRequest(story_title);
    if(response.errorMsg) {
      errorMsg.value = response.responseErr;
    }

    const body = await response.json();
    if(response.ok) {
      isHidden.value = true;
      emit("stories-updated");
    }else {
      errorMsg.value =  body.errorMsg;
    }
  }

  function validateStoryTitle() {
    if(storyTitle.value.length > 80) {
      errorMsg.value = "The title should not be more than 80 characters.";
      console.log(errorMsg.value);
      return true;
    }else {
      errorMsg.value = ''
      return false;
    }
  }

  async function verifyAndSubmit() {
    let error = validateStoryTitle()
    if(error) return;

    await makeStory(storyTitle.value);
  }
</script>
<template>
  <button type="button" @click="isHidden = !isHidden">Add new story</button>
  <div class="window story-create" v-if="!isHidden">
    <button type="button" @click="isHidden = true">Close</button>
    <form>
      <span class="error-msg" v-if="errorMsg.length !== 0">{{ errorMsg }}</span>
      <div class="form-field">
        <label for="story-title">Story Title: </label>
        <input type="text" id="story-title" name="story-title" v-model="storyTitle" @input="validateStoryTitle" :class="{'input-error': errorMsg.length !== 0}">
      </div>
      <button type="submit" @click.prevent="verifyAndSubmit" :disabled="errorMsg.length !== 0">Add</button>
    </form>
  </div>
  <div class="overlay" @click="isHidden = !isHidden" v-if="!isHidden">
  </div>
</template>
<style scoped>
</style>
