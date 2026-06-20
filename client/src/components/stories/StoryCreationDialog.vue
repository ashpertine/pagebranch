<script setup>
  import { ref } from "vue";
  import { createMakeStoryRequest } from "../../api/stories-api.js";

  const emit = defineEmits(["stories-updated"]);

  const errorMsg = ref("");
  const storyTitle = ref("");
  const dialog = ref(false);
  const form = ref();

  async function makeStory(story_title) {
    const { valid } = await form.value.validate(); 
    if(!valid) {
      return;
    }
    
    const response = await createMakeStoryRequest(story_title);
    if(response.errorMsg) {
      errorMsg.value = response.responseErr;
    }

    const body = await response.json();
    if(response.ok) {
      dialog.value = false;
      emit("stories-updated");
    }else {
      errorMsg.value =  body.errorMsg;
    }
  }

  const titleRules = [
    value => {
      if(value) return true;
      return 'Story title must not be empty.'
    }
  ]
</script>
<template> 
  <v-icon-btn @click="dialog = true"
    color="primary"
    icon="mdi-plus"
    variant="flat"
  ></v-icon-btn>
  <v-dialog max-width="500" v-model="dialog">
    <v-card title="Add new story">
      <div class="text-title-medium text-red-lighten-2 pb-4 px-5 rounded-md"  v-if="errorMsg.length !== 0"> {{ errorMsg }}</div>
      <v-form class="px-5" @submit.prevent="makeStory(storyTitle)" ref="form">
        <v-text-field label="Title" v-model="storyTitle" :rules="titleRules"></v-text-field>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text="Close"
            color="primary"
            size="large"
            @click="dialog = false"
          ></v-btn>
          <v-btn variant="tonal" size="large" type="submit" append-icon="mdi-plus" color="green" >Add</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<style scoped>
</style>
