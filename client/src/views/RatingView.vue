<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppBar from '@/components/AppBar.vue';
import { createGetRatingsRequest } from '@/api/rating-api';
import { createGetStoryInfoRequest } from "@/api/stories-api";
import { useRatings } from '@/composables/ratings';
import UserRatingCard from "@/components/rating/UserRatingCard.vue";

const { getRatings, ratingContent, ratings, ratingsAvg, ratingsCount } = useRatings();
const route = useRoute();
const router = useRouter();

const storyInfo = ref({
  story_title: "",
  updated_at: "",
  created_at: "",
});

async function getStoryInfo() {
  const storyId = route.params.storyId;
  const response = await createGetStoryInfoRequest(storyId);
  const content = await response.json();
  if (response.responseErr || content.errorMsg) {
    return router.replace({ name: "Error" });
  }
  return content;
}

const createdAtFormatted = computed(() => {
  if (!storyInfo.value.created_at) return "";
  const newDate = new Date(storyInfo.value.created_at);
  return newDate.toLocaleString("en-SG", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
});

const updatedAtFormatted = computed(() => {
  if (!storyInfo.value.updated_at) return "";
  const newDate = new Date(storyInfo.value.updated_at);
  return newDate.toLocaleString("en-SG", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
});

onMounted(async () => {
  const initStoryInfo = await getStoryInfo();
  storyInfo.value = initStoryInfo.results;

  // get ratings only after settings readContent
  const initRatingsContent = await getRatings(route.params.storyId);
  ratingContent.value = initRatingsContent;
})

</script>
<template>
  <v-app>
    <AppBar @stories-updated="" bar-title="Ratings" v-if="ratingContent.is_logged_in" />
    <v-main>
      <v-container class="d-flex justify-center">
        <v-card class="w-100 pa-6" rounded="lg">
          <v-card-title class="text-headline-large font-weight-bold text-center">
            {{ storyInfo.story_title }}
          </v-card-title>

          <v-card-subtitle class="text-title-small text-center">
            Updated: {{ updatedAtFormatted }} (Created: {{ createdAtFormatted }})
          </v-card-subtitle>

          <v-divider class="my-4" />

          <v-card-text class="d-flex flex-column align-center ga-2">
            <v-rating hover :length="5" size="40" half-increments readonly active-color="orange-lighten-1"
              color="orange-lighten-1" :model-value="Number(ratingsAvg)" />
            <div class="text-headline-small text-medium-emphasis">
              {{ ratingsAvg }} <span class="text-title-medium">({{ ratingsCount }} rating{{ ratingsCount === 1 ? '' :
                's' }})</span>
            </div>
          </v-card-text>
        </v-card>
      </v-container>
      <v-container>
        <v-row density="comfortable">
          <v-col v-for="ratingObj in ratingContent.results" xl="3" lg="4" md="6" cols="12" :key="ratingObj.id">
            <UserRatingCard :rating="ratingObj.rating" :description="ratingObj.description"
              :from-user-name="ratingObj.from_user_name" :created-at="ratingObj.created_at" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
<style scoped></style>
