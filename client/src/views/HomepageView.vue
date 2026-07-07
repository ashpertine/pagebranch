<script setup>
import { ref, onMounted, computed } from "vue";
import { useSettings } from "../composables/settings.js"

// Components 
import StoryCard from "../components/stories/StoryCard.vue";
import HomepagePieChart from "../components/HomepagePieChart.vue";
import HomepageTotalRatingKPI from "../components/HomepageTotalRatingKPI.vue";
import AppBar from "../components/AppBar.vue";

// API Request functions
import { createLogoutRequest } from "../api/auth-api.js";
import { createMakeStoryRequest, createGetStoriesRequest } from "../api/stories-api.js";
import { createGetTotalRatingStatRequest } from "../api/rating-api.js";

const stories = ref([]);
const ratingTotalStats = ref([]);
const globalErrorMsg = ref("");

const { localSettings } = useSettings();

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

async function getTotalStats() {
  const response = await createGetTotalRatingStatRequest();
  const body = await response.json();
  if (response.ok) {
    ratingTotalStats.value = body.results;
  }
}

const pinnedStories = computed(() => {
  return stories.value.filter((story) => story.is_pinned);
})

const nonPinnedStories = computed(() => {
  return stories.value.filter((story) => !story.is_pinned);
})

const exactTheme = computed(() => {
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  if (localSettings.value.theme === 'system') {
    return mql.matches ? 'dark' : 'light';
  }

  return localSettings.value.theme || 'dark';
})

onMounted(async () => {
  await getStories();
  await getTotalStats();
  console.log(stories.value);
  console.log(ratingTotalStats.value);
})

</script>
<template>
  <v-app>
    <AppBar @stories-updated="getStories" bar-title="Pagebranch" />
    <v-main v-if="stories.length > 0">
      <v-container>
        <v-row density="comfortable">
          <v-col xl="6" lg="6" md="12" cols="12">
            <v-sheet :elevation="1">
              <HomepagePieChart :theme="exactTheme" :stories="stories" />
            </v-sheet>
          </v-col>
          <v-col xl="6" lg="6" md="12" cols="12">
            <HomepageTotalRatingKPI :ratings="ratingTotalStats" />
          </v-col>
        </v-row>
      </v-container>
      <v-container v-if="pinnedStories.length > 0">
        <div class="text-title-large mb-4 text-medium-emphasis font-weight-semibold">Pinned Stories</div>
        <v-row density="comfortable">
          <v-col v-for="story in pinnedStories" xl="3" lg="4" md="6" cols="12" :key="story.id">
            <StoryCard :title="story.story_title" :story-id="story.id" :created-at=story.created_at
              :is-pinned="story.is_pinned" :updated-at=story.updated_at @stories-updated="getStories"
              :is-private="story.is_private" :start-passage-id="story.start_passage_id" :author-id="story.author_id"
              :share-slug="story.share_slug" />
          </v-col>
        </v-row>
      </v-container>
      <v-divider></v-divider>
      <v-container>
        <v-row density="comfortable">
          <v-col v-for="story in nonPinnedStories" xl="3" lg="4" md="6" cols="12" :key="story.id">
            <StoryCard :title="story.story_title" :story-id="story.id" :created-at=story.created_at
              :is-pinned="story.is_pinned" :updated-at=story.updated_at @stories-updated="getStories"
              :is-private="story.is_private" :start-passage-id="story.start_passage_id" :author-id="story.author_id"
              :share-slug="story.share_slug" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-main v-else>
      <v-container class="d-flex flex-column justify-center align-center h-100 ga-6">
        <div class="text-display-medium text-medium-emphasis">No stories yet. Make one by clicking the button at the
          top.</div>
      </v-container>
    </v-main>
  </v-app>
</template>
<style scoped></style>
