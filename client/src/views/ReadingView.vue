<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { createGetReadContentRequest } from "../api/story-content-api";
const route = useRoute();
const router = useRouter();

async function getReadContent() {
  const response = await createGetReadContentRequest(route.params.userId, route.params.shareSlug);
  const content = await response.json();
  if (response.responseErr || content.errorMsg) {
    return router.replace({ name: "Error" })
  }
  return content;
}

const readContent = ref({
  passages: [],
  choices: []
});

onMounted(async () => {
  const content = await getReadContent();
  readContent.value = content;
})
</script>
<template>
  <v-app>
    <v-main>
      {{ $route.params.userId }}; {{ $route.params.shareSlug }}
    </v-main>
  </v-app>
</template>
