<script setup>
import { ref, computed } from 'vue';
import PassageNode from "./PassageNode.vue";
import MarkdownEditor from "./MarkdownEditor.vue";
import { Background } from '@vue-flow/background'
import { useVueFlow, VueFlow, Panel, Position } from '@vue-flow/core';

const { onNodeClick, onNodeDragStop, onNodeDragStart } = useVueFlow();
const props = defineProps(["story-content", "editor-selected-passage"]);
const emit = defineEmits(["create-new-passage", "update-passage", "save-content", "select-passage", "position-modified"]);

const nodes = computed(() =>
  props.storyContent.passages.map(passage => ({
    id: `${passage.id}`,
    position: { x: passage.pos_x ?? 120, y: passage.pos_y ?? 120 },
    type: "passage",
    label: passage.title,
    data: { title: passage.title, description: passage.description, isSelected: props.editorSelectedPassage === passage.id },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  }))
)

const edges = computed(() =>
  props.storyContent.choices.map(choice => ({
    id: `${choice.id}`,
    source: `${choice.from_passage_id}`,
    target: `${choice.to_passage_id}`
  }))
)

const currentlySelectedPassageData = computed(() => {
  const passage = props.storyContent.passages.find(p => Number(p.id) === Number(props.editorSelectedPassage));
  return {
    title: passage.title,
    description: passage.description
  }
})

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

function updateEditorContent(editorData) {
  Debounce.cancelDebounce();
  emit('update-passage', {
    title: editorData.title,
    description: editorData.description
  })
  Debounce.saveDebounce(1000);
}

function addNode() {
  emit('create-new-passage');
}

class Debounce {
  static timeoutId = null;;

  static saveDebounce(debounce_time) {
    this.timeoutId = setTimeout(() => {
      emit('save-content');
    }, debounce_time);
  }

  static cancelDebounce() {
    clearTimeout(this.timeoutId);
  }
}

onNodeDragStop((event) => {
  emit('position-modified', {
    passageId: Number(event.node.id),
    pos_x: event.node.position.x,
    pos_y: event.node.position.y
  });
  Debounce.saveDebounce(200);
})

onNodeDragStart(() => {
  Debounce.cancelDebounce();
})

onNodeClick((event) => {
  if (editorState.value.hidden) {
    editorState.value.hidden = false
  }
  emit('select-passage', {
    passageId: Number(event.node.id)
  });
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
      :editor-title-content="currentlySelectedPassageData.title"
      :editor-content="currentlySelectedPassageData.description"
      @toggle-view="editorState.hidden = !editorState.hidden; emit('select-passage', { passageId: 0 })"
      @content-updated="updateEditorContent" />
  </v-slide-y-reverse-transition>
</template>
<style>
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css'
</style>
