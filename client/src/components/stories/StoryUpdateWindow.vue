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
    display: inline-block;
    padding: 20px;
    border: 1px solid var(--light-color-border);
    border-radius: 5px;
    background-color: var(--light-background-muted);
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  input {
    padding: 0.75rem 1rem;
    font-size: 1rem;
    background-color: var(--light-background-bright);
    border-radius: 5px;
    border: 1px solid var(--light-color-border);
  }

  button {
    background-color: var(--light-color-primary);
    color: var(--light-color-text);
    border-radius: 10px;
    padding: 0.8em 1em;
    border: 0;
    font-size: 1rem;
    cursor: pointer;
    align-self: flex-start;
  }

  .error-msg {
    color: var(--color-error);
    font-size: 0.85rem;
  }

  .input-error {
    border: 2px solid var(--color-error);
    color: var(--color-error);
  }

  @media (prefers-color-scheme: dark) {
    .window {
      background-color: var(--dark-background-muted);
      border: 1px solid var(--dark-color-border);
    }

    input {
      background-color: var(--dark-background);
      color: var(--dark-color-text);
      border: 1px solid var(--dark-color-border);
    }

    button {
      background-color: var(--dark-color-primary);
      color: var(--dark-color-text);
    }
  }
</style>
