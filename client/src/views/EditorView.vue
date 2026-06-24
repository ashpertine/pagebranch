<script setup>
import Graph from "../components/editor/Graph.vue";
import EditorAppBar from "../components/editor/EditorAppBar.vue";
import { createGetStoryContentRequest, createMakePassageRequest, createUpdatePassagesRequest } from "@/api/story-content-api";
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
    const newContent = await getContent();
    storyContent.value = newContent;
  }
}

async function updatePassagesData(data) {
  const dataFormatted = data.map(x => ({
    id: x.id,
    title: x.title,
    description: x.description,
    pos_x: x.pos_x,
    pos_y: x.pos_y
  }))

  const response = await createUpdatePassagesRequest(route.params.storyId, dataFormatted);
  if (response.ok) {
    const newContent = await getContent();
    storyContent.value = newContent;
  }
}

</script>
<template>
  <v-app>
    <EditorAppBar />
    <v-main>
      <v-container fluid class="w-100 h-100">
        <Graph :story-content="storyContent" @create-new-passage="saveNewPassageData"
          @update-pos-passage="updatePassagesData" />
      </v-container>
    </v-main>
  </v-app>
</template>
