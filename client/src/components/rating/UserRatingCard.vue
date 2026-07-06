<script setup>
import { ref, computed } from "vue";
const props = defineProps(['rating', 'description', 'fromUserName', "createdAt"])

const expandedDialog = ref(false);
const maxDescLength = 65;

function formatRatingDescription(description) {
  const formattedDescription = description.length > maxDescLength ? description.slice(0, maxDescLength) + '...' : description;

  return formattedDescription
}

function formatRatingSubmitDate(date_str) {
  const newDate = new Date(date_str);
  return newDate.toLocaleString("en-SG", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}

const isTooLong = computed(() => props.description.length > maxDescLength);

</script>
<template>
  <div>
    <v-card class="d-flex flex-column align-center" height="140px">
      <v-rating :model-value="rating" color="orange-lighten-1" readonly></v-rating>
      <v-card-subtitle>
        from {{ fromUserName }} (Submitted: {{ formatRatingSubmitDate(createdAt) }})
      </v-card-subtitle>
      <v-card-text style="max-width: 100%;">{{ formatRatingDescription(description) }}<v-btn v-if="isTooLong"
          variant="text" color="blue" size="small" @click="expandedDialog = true">more</v-btn>
      </v-card-text>
    </v-card>
    <v-dialog max-width="500" v-model="expandedDialog">
      <v-card class="px-4 py-4">
        <v-card-subtitle>
          from {{ fromUserName }} (Submitted: {{ createdAt }})
        </v-card-subtitle>
        <v-card-text>{{ description }}</v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<style scoped></style>
