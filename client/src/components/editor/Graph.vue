<script setup>
import { ref, onMounted, computed } from 'vue';
import PassageNode from "./PassageNode.vue";
import MarkdownEditor from "./MarkdownEditor.vue";
import { Background } from '@vue-flow/background'
import { useVueFlow, VueFlow, Panel, Position } from '@vue-flow/core';

const { addEdges, addNodes, onNodeClick, onNodeDragStop, onNodeDragStart } = useVueFlow();
const props = defineProps(["storyContent"]);
const emit = defineEmits(["create-new-passage", "update-passage"]);

// Current data. These should not change during the session until user saves.
const nodes = computed(() =>
  props.storyContent.passages.map(passage => ({
    id: `${passage.id}`,
    position: { x: passage.pos_x ?? 120, y: passage.pos_y ?? 120 },
    type: "passage",
    label: passage.title,
    data: { title: passage.title, description: passage.description, isSelected: Number(passage.id) === Number(selectedPassage.value) },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top
  }))
)

const edges = computed(() =>
  props.storyContent.choices.map(choice => ({
    id: `${choice.id}`,
    source: `${choice.from_passage_id}`,
    target: `${choice.to_passage_id}`
  }))
)



const editorState = ref({
  hidden: true,
  expandedState: 'smallSize',
  expandedSize: {
    height: "1200",
    width: "1500"
  },
  smallSize: {
    height: "800",
    width: "500"
  }
})
const editorContent = ref("");
const editorTitleContent = ref("");
const selectedPassage = ref(0);

function toggleEditorExpand() {
  editorState.value.expandedState = editorState.value.expandedState === 'expandedSize' ? 'smallSize' : 'expandedSize';
}

function updateEditorContent(propData) {
  editorTitleContent.value = propData;
  const selectedPassageNode = nodes.value.find((passageNode) => Number(passageNode.id) === Number(selectedPassage.value));
  updatedNodes.value.push({
    id: selectedPassageNode.id,
    title: editorTitleContent.value,
    description: editorContent.value,
    pos_x: selectedPassageNode.position.x,
    pos_y: selectedPassageNode.position.y
  })

  Debounce.saveDebounce()
}

function setSelectedPassage(passageId, nodeData) {
  if (editorState.value.hidden) {
    editorState.value.hidden = false
  }
  editorTitleContent.value = nodeData.title
  editorContent.value = nodeData.description;
  selectedPassage.value = passageId;
}

// Temporarily Store new or updated data
const updatedNodes = ref([]);

function addNode() {
  emit('create-new-passage');
}

class Debounce {
  constructor() {
    this.timeoutId = null;
  }
  static saveDebounce() {
    this.timeoutId = setTimeout(() => {
      emit('update-passage', updatedNodes.value);
      updatedNodes.value = [];
    }, 200);
  }

  static cancelDebounce() {
    clearTimeout(this.timeoutId);
  }
}

onNodeDragStop((event) => {
  updatedNodes.value.push({
    id: event.node.id,
    title: event.node.data.title,
    description: event.node.data.description,
    pos_x: event.node.position.x,
    pos_y: event.node.position.y
  })
  Debounce.saveDebounce();
})

onNodeDragStart((event) => {
  Debounce.cancelDebounce();
})

onNodeClick((event) => {
  const passageId = event.node.id;
  const data = event.node.data;
  setSelectedPassage(passageId, data);
})

</script>
<template>
  <VueFlow :nodes="nodes" :edges="edges">
    <Background variant="dots" />
    <template #node-passage="props">
      <PassageNode v-bind="props" />
    </template>
    <Panel>
      <v-container class="d-flex ga-4">
        <v-btn type="button" @click="addNode" color="primary">
          Add
        </v-btn>
      </v-container>
    </Panel>
  </VueFlow>
  <v-slide-y-reverse-transition>
    <MarkdownEditor v-if="!editorState.hidden" :height="editorState[editorState.expandedState].height"
      :width="editorState[editorState.expandedState].width" @toggle-expand="toggleEditorExpand"
      :editor-title-content="editorTitleContent" :editor-content="editorContent"
      @toggle-view="editorState.hidden = !editorState.hidden; selectedPassage = 0"
      @content-updated="updateEditorContent" />
  </v-slide-y-reverse-transition>
</template>
<style>
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css'
</style>
