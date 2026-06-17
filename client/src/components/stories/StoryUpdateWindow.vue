<script setup>
  import { ref, onMounted } from "vue";
  import { createUpdateStoryRequest } from "../../api/stories-api.js";

  const emit = defineEmits(["stories-updated"]);
  const props = defineProps(['storyId', 'currentStoryTitle'])

  const errorMsg = ref("");
  const storyTitle = ref("");
  const isHidden = ref(true);

  async function updateStory(story_title, story_id) {
    const response = await createUpdateStoryRequest(story_title, story_id)
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

    await updateStory(storyTitle.value, props.storyId);
  }

  onMounted(() => {
    storyTitle.value = props.currentStoryTitle;
  })
</script>
<template>
  <button type="button" @click="isHidden = !isHidden">Update Story</button>
  <div class="window story-update" v-if="!isHidden">
    <button type="button" @click="isHidden = true">Close</button>
    <form>
      <span class="error-msg" v-if="errorMsg.length !== 0">{{ errorMsg }}</span>
      <div class="form-field">
        <label for="story-title">Story Title: </label>
        <input type="text" id="story-title" name="story-title" v-model="storyTitle" @input="validateStoryTitle" :class="{'input-error': errorMsg.length !== 0}" :value="storyTitle">
      </div>
      <button type="submit" @click.prevent="verifyAndSubmit" :disabled="errorMsg.length !== 0">Update</button>
    </form>
  </div>
</template>
<style scoped>
  .window {
    border: 2px solid black;
    display: inline-block;
    padding: 20px;
  }

  .error-msg {
    color: red;
    font-size: 0.85rem;
  }

  .input-error {
    border: 1px solid red;
    background-color: lightcoral;
    color: darkred;
  }
</style>
