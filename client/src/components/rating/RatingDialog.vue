<script setup>
import { ref } from "vue";
import { createDeleteStoryRequest } from "../../api/stories-api.js";
import { useRouter } from "vue-router";

const errorMsg = ref("");
const router = useRouter();

const rating = ref(3); // default rating
const ratingDesc = ref("");

const emit = defineEmits(["rating-sent", "close-rating-dialog"]);
const props = defineProps(["globalUserId", "viewUserId"]);

const ratingDescRules = [
  value => {
    if (value.length > 1000) return "The description cannot be more than 1000 characters.";
    return true;
  }
]
</script>
<template>
  <v-dialog max-width="500">
    <v-card class="px-4 py-4" v-if="globalUserId !== null">
      <v-card-title>Rate Story</v-card-title>
      <v-card-subtitle>Give this story a rating out of 5 stars</v-card-subtitle>
      <div class="text-title-medium text-red-lighten-2 pb-4 px-5 rounded-md" v-if="errorMsg.length !== 0"> {{ errorMsg
      }}</div>
      <v-form class="px-5">
        <v-rating hover :length="5" size="50" v-model="rating" active-color="orange-lighten-1"
          color="orange-lighten-1" />
        <v-textarea label="Description (optional, max 1000 characters)" :rules="ratingDescRules" v-model="ratingDesc"
          variant="solo-filled" no-resize></v-textarea>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Submit" color="success" size="large" @click="$emit('close-rating-dialog')"></v-btn>
          <v-btn text="Close" color="primary" size="large" @click="$emit('close-rating-dialog')"></v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
    <v-card class="px-4 py-4" v-else>
      <v-card-text>
        Log in to submit a rating.
      </v-card-text>
      <v-card-actions>
        <v-btn text="Login" color="success" size="large" @click="router.replace({ name: 'Login' })"></v-btn>
        <v-btn text="Close" color="primary" size="large" @click="$emit('close-rating-dialog')"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
