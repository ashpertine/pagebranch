<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { createGetStartPassageRequest, createGetReadContentRequest } from "../api/story-content-api";
import { marked } from "marked";
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
  metadata: {},
  passages: [],
  choices: []
});

const currentPassage = ref(null);
const passageHistory = ref([]);

const currentContent = computed(() => {
  if (currentPassage.value === null) {
    return null;
  }
  const choiceOptions = readContent.value.choices.filter(choice => choice.from_passage_id === currentPassage.value.id);

  return {
    title: currentPassage.value.title,
    description: marked.parse(currentPassage.value.description),
    choiceOptions: choiceOptions.map(choice => ({
      label: choice.label,
      to_passage_id: choice.to_passage_id
    }))
  }
})

const prevBtnEnabled = computed(() => {
  const choices = readContent.value.choices.filter(choice => choice.to_passage_id === currentPassage.value.id);
  for (const choice of choices) {
    const historyHasPassage = passageHistory.value.includes(choice.to_passage_id);
    if (historyHasPassage) return true
  }

  return false;
})

const nextBtnEnabled = computed(() => {
  if (passageHistory.value[passageHistory.value.length - 1] === currentPassage.value.id) return false;
  const choices = readContent.value.choices.filter(choice => choice.from_passage_id === currentPassage.value.id);
  for (const choice of choices) {
    const historyHasPassage = passageHistory.value.includes(choice.from_passage_id);
    if (historyHasPassage) return true
  }
  return false;
})


function readPassage(passage_id) {
  const passage = readContent.value.passages.find(passage => passage.id === passage_id);
  currentPassage.value = passage;
  passageHistory.value.push(passage.id);
}

function prevPassage() {
  const choices = readContent.value.choices.filter(choice => choice.to_passage_id === currentPassage.value.id);
  if (choices.length === 0) return;
  const matchingPassagesWithIndex = choices.map(choice => {
    const historyIndex = passageHistory.value.lastIndexOf(Number(choice.from_passage_id));
    return {
      passage_id: choice.from_passage_id,
      index: historyIndex
    }
  });

  const latestPassageIndex = Math.max(...matchingPassagesWithIndex.map(passage => passage.index));
  const latestPassage = readContent.value.passages.find(passage => passage.id === (matchingPassagesWithIndex.find(passage => passage.index === latestPassageIndex)).passage_id);

  currentPassage.value = latestPassage;
}

function nextPassage() {
  const choices = readContent.value.choices.filter(choice => choice.from_passage_id === currentPassage.value.id);
  if (choices.length === 0) return;
  const matchingPassagesWithIndex = choices.map(choice => {
    const historyIndex = passageHistory.value.lastIndexOf(Number(choice.to_passage_id));
    return {
      passage_id: choice.to_passage_id,
      index: historyIndex
    }
  });

  const latestPassageIndex = Math.max(...matchingPassagesWithIndex.map(passage => passage.index));
  const latestPassage = readContent.value.passages.find(passage => passage.id === (matchingPassagesWithIndex.find(passage => passage.index === latestPassageIndex)).passage_id);

  currentPassage.value = latestPassage;
}

onMounted(async () => {
  const content = await getReadContent();
  readContent.value = content;
})
</script>
<template>
  <v-app>
    <v-main>
      <v-container class="d-flex justify-center align-center w-100 h-100 cover-page" v-if="currentPassage === null">
        <v-sheet :elevation="2" rounded="lg"
          class="w-lg-50 w-md-75 w-sm-100 w-100 d-flex flex-column align-center justify-space-between pa-12"
          height="520">
          <v-icon icon="mdi-book-open-variant" size="48" color="primary" />

          <div class="d-flex flex-column align-center ga-4 text-center">
            <div class="text-display-medium font-weight-light">{{ readContent.metadata.title }}</div>
            <v-divider class="w-25" />
            <div class="text-headline-medium text-medium-emphasis">by {{ readContent.metadata.author }}</div>
          </div>

          <v-btn variant="tonal" color="primary" size="large" append-icon="mdi-arrow-right"
            @click="readPassage(readContent.metadata.start_passage)">
            Begin Reading
          </v-btn>
        </v-sheet>
      </v-container>
      <v-container v-else class="d-flex justify-center flex-column py-12 w-xxl-25 w-50">
        <div class="nav-buttons align-self-start"
          style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 16px;">
          <v-icon-btn icon="mdi-arrow-left" variant="tonal" @click="prevPassage"
            :disabled="!prevBtnEnabled"></v-icon-btn>
          <v-icon-btn icon="mdi-arrow-right" variant="tonal" @click="nextPassage"
            :disabled="!nextBtnEnabled"></v-icon-btn>
        </div>
        <div class="passage-title text-h4 font-weight-medium mb-8">
          {{ currentContent.title }}
        </div>

        <div v-html="currentContent.description" class="passage-body mb-10" />

        <template v-if="currentContent.choiceOptions.length > 0">
          <v-divider class="mb-4" />
          <div class="text-body-2 text-medium-emphasis mb-3">Pick an option</div>
          <div class="d-flex flex-column ga-2">
            <v-btn v-for="choice in currentContent.choiceOptions" :key="choice.to_passage_id" variant="tonal"
              color="primary" class="justify-space-between" append-icon="mdi-arrow-right"
              @click="readPassage(choice.to_passage_id)">
              {{ choice.label }}
            </v-btn>
          </div>
        </template>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.passage-title {
  border-left: 3px solid rgb(var(--v-theme-info));
  padding-left: 16px;
  margin: 0;
}

.passage-body {
  line-height: 1.85;
  font-size: 1.0625rem;
}

.passage-body :deep(p) {
  margin-bottom: 1rem;
}

.passage-body :deep(p:last-child) {
  margin-bottom: 0;
}
</style>
