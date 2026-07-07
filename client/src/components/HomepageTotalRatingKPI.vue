<script setup>
import { ref, computed } from "vue";
const props = defineProps(['ratings'])

const avgRatings = computed(() => props.ratings.length > 0 ? (props.ratings.reduce((acc, ratingObj) => acc + ratingObj.rating, 0) / props.ratings.length).toFixed(2) : null);
const totalRatings = computed(() => props.ratings.length); 
</script>
<template>
  <div>
    <v-card class="d-flex flex-column align-center" height="320px">
      <v-card-title class="text-headline-medium text-medium-emphasis">All Ratings</v-card-title>
      <div></div>
      <div class="d-flex flex-column align-center justify-center h-100">
        <v-rating :model-value="avgRatings" color="orange-lighten-1" readonly></v-rating>
        <div class="text-display-small"> {{ avgRatings === null ? "No Ratings" : avgRatings }}</div>
        <div class="text-headline-small text-medium-emphasis">Total Ratings: {{ totalRatings }}</div>
      </div>
    </v-card>
  </div>
</template>
<style scoped></style>
