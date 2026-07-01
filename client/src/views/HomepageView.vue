<script setup>
import { ref, onMounted, computed } from "vue";

// Components 
import StoryCard from "../components/stories/StoryCard.vue";
import AppBar from "../components/AppBar.vue";

// API Request functions
import { createLogoutRequest } from "../api/auth-api.js";
import { createMakeStoryRequest, createGetStoriesRequest } from "../api/stories-api.js";

const stories = ref([]);
const globalErrorMsg = ref("");

async function getStories() {
  const response = await createGetStoriesRequest();
  if (response.responseErr) {
    globalErrorMsg.value = response.responseErr;
  }
  const body = await response.json();
  if (response.ok) {
    stories.value = body;
  } else {
    globalErrorMsg.value = response.responseErr;
  }
}

const pinnedStories = computed(() => {
  return stories.value.filter((story) => story.is_pinned);
})

const nonPinnedStories = computed(() => {
  return stories.value.filter((story) => !story.is_pinned);
})

onMounted(async () => {
  await getStories();
})

</script>
<template>
  <v-app>
    <AppBar @stories-updated="getStories" />
    <v-main>
      <v-container fluid v-if="pinnedStories.length > 0">
        <div class="text-title-large mb-4 text-medium-emphasis font-weight-semibold">Pinned Stories</div>
        <v-row density="comfortable">
          <v-col v-for="story in pinnedStories" xl="3" lg="4" md="6" cols="12" :key="story.id">
            <StoryCard :title="story.story_title" :story-id="story.id" :created-at=story.created_at
              :is-pinned="story.is_pinned" :updated-at=story.updated_at @stories-updated="getStories" />
          </v-col>
        </v-row>
      </v-container>
      <v-divider></v-divider>
      <v-container fluid>
        <v-row density="comfortable">
          <v-col v-for="story in nonPinnedStories" xl="3" lg="4" md="6" cols="12" :key="story.id">
            <StoryCard :title="story.story_title" :story-id="story.id" :created-at=story.created_at
              :is-pinned="story.is_pinned" :updated-at=story.updated_at @stories-updated="getStories" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
<style scoped></style>
