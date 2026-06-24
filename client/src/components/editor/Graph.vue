<script setup>
import { ref, onMounted, computed } from 'vue';
import PassageNode from "./PassageNode.vue";
import MarkdownEditor from "./MarkdownEditor.vue";
import { Background } from '@vue-flow/background'
import { useVueFlow, VueFlow, Panel, Position } from '@vue-flow/core';

const { addEdges, addNodes, onNodeDragStop, onNodeDragStart } = useVueFlow();
const props = defineProps(["storyContent"]);
const emit = defineEmits(["create-new-passage", "update-pos-passage"]);


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


function toggleEditorExpand() {
  editorState.value.expandedState = editorState.value.expandedState === 'expandedSize' ? 'smallSize' : 'expandedSize';
}

// Current data. These should not change during the session until user saves.
const nodes = computed(() =>
  props.storyContent.passages.map(passage => ({
    id: `${passage.id}`,
    position: { x: passage.pos_x ?? 50, y: passage.pos_y ?? 50 },
    type: "passage",
    label: passage.title,
    data: { title: passage.title, description: passage.description },
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
      emit('update-pos-passage', updatedNodes.value);
      updatedNodes.value = [];
    }, 750);

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
        <v-btn type="button" color="orange" @click="editorState.hidden = !editorState.hidden">
          Editor
        </v-btn>
      </v-container>
    </Panel>
  </VueFlow>
  <v-slide-y-reverse-transition>
    <MarkdownEditor v-if="!editorState.hidden" :height="editorState[editorState.expandedState].height"
      :width="editorState[editorState.expandedState].width" @toggle-expand="toggleEditorExpand"
      @toggle-view="editorState.hidden = !editorState.hidden" />
  </v-slide-y-reverse-transition>
</template>
<style>
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css'
</style>
