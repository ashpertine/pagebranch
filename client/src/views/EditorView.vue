<script setup>
import Graph from "../components/editor/Graph.vue";
import EditorAppBar from "../components/editor/EditorAppBar.vue";
import { createGetStoryContentRequest, createMakePassageRequest, createUpdatePassagesRequest, createDeletePassageRequest, createMakeChoiceRequest, createUpdateChoiceRequest, createDeleteChoiceRequest } from "@/api/story-content-api";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Position } from "@vue-flow/core";

const newNodeData = {
  position: { x: 120, y: 120 },
  type: "passage",
  label: `Untitled Passage`,
  data: { title: `Untitled Passage`, description: '' },
  sourcePosition: Position.Bottom,
  targetPosition: Position.Top,
}

const router = useRouter();
const route = useRoute();

const storyContent = ref({
  passages: [],
  choices: []
});

function editPassageData(passage_id, options) {
  for (let passage of storyContent.value.passages) {
    if (passage.id === passage_id) {
      for (const [option, value] of Object.entries(options)) {
        passage[option] = value;
      }
    }
  }
}

const editorSelectedPassage = ref(0);

function setSelectedPassage(propData) {
  const { passageId } = propData;
  editorSelectedPassage.value = Number(passageId);
}

function setPosition(propData) {
  const { passageId, pos_x, pos_y } = propData;
  editPassageData(passageId, {
    "pos_x": pos_x,
    "pos_y": pos_y
  })
}

function setPassageContent(propData) {
  const { title, description } = propData;
  editPassageData(editorSelectedPassage.value, {
    "title": title,
    "description": description,
  })
}

async function getContent() {
  const response = await createGetStoryContentRequest(route.params.storyId);
  const content = await response.json();
  if (response.responseErr) {
    return router.replace({ name: "Error" })
  }
  return content;
}

onMounted(async () => {
  const content = await getContent()
  if (content.errorMsg) {
    return router.replace({ name: "ErrorEditor" });
  }

  storyContent.value = content;
})


async function saveNewPassageData() {
  const response = await createMakePassageRequest(route.params.storyId, newNodeData.data.title, newNodeData.data.description);
  if (response.ok) {
    const content = await getContent()
    if (content.errorMsg) {
      return router.replace({ name: "ErrorEditor" });
    }
    storyContent.value = content;
  }
}

async function saveUpdatedPassages() {
  const response = await createUpdatePassagesRequest(route.params.storyId, storyContent.value.passages);
}

async function saveDeletePassage() {
  const passageDeleted = editorSelectedPassage.value;
  editorSelectedPassage.value = 0;
  const response = await createDeletePassageRequest(route.params.storyId, passageDeleted);
  if (response.ok) {
    const content = await getContent()
    if (content.errorMsg) {
      return router.replace({ name: "ErrorEditor" });
    }
    storyContent.value = content;
  }
}


async function saveNewChoiceData(propData) {
  const defaultLabel = "Untitled Label";
  const response = await createMakeChoiceRequest(route.params.storyId, defaultLabel, propData.source, propData.target);
  if (response.ok) {
    const content = await getContent()
    if (content.errorMsg) {
      return router.replace({ name: "ErrorEditor" });
    }
    storyContent.value = content;
  }
}


async function saveUpdateChoiceData(propData) {
  const { id, newLabel } = propData;
  const targetChoice = storyContent.value.choices.find(choice => Number(choice.id) === Number(id));
  const fromPassageId = targetChoice.from_passage_id;
  const toPassageId = targetChoice.to_passage_id;
  const response = await createUpdateChoiceRequest(route.params.storyId, targetChoice.id, newLabel, fromPassageId, toPassageId);
  if (response.ok) {
    const content = await getContent()
    if (content.errorMsg) {
      return router.replace({ name: "ErrorEditor" });
    }
    storyContent.value = content;
  }
}


async function saveDeleteChoiceData(propData) {
  const { id } = propData;
  const response = await createDeleteChoiceRequest(route.params.storyId, id);
  if (response.ok) {
    const content = await getContent()
    if (content.errorMsg) {
      return router.replace({ name: "ErrorEditor" });
    }
    storyContent.value = content;
  }
}

</script>
<template>
  <v-app>
    <EditorAppBar />
    <v-main>
      <v-container fluid class="w-100 h-100">
        <Graph :story-content="storyContent" :editor-selected-passage="editorSelectedPassage"
          @create-new-passage="saveNewPassageData" @save-content="saveUpdatedPassages"
          @select-passage="setSelectedPassage" @position-modified="setPosition" @update-passage="setPassageContent"
          @delete-passage="saveDeletePassage" @create-new-choice="saveNewChoiceData"
          @update-choice="saveUpdateChoiceData" @delete-choice="saveDeleteChoiceData" />
      </v-container>
    </v-main>
  </v-app>
</template>
