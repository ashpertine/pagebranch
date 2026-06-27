<script setup>
import { ref, computed } from 'vue';
import PassageNode from "./PassageNode.vue";
import MarkdownEditor from "./MarkdownEditor.vue";
import { Background } from '@vue-flow/background'
import { useVueFlow, VueFlow, Panel, Position } from '@vue-flow/core';

const { onNodeClick, onNodeDragStop, onNodeDragStart } = useVueFlow();
const props = defineProps(["story-content", "editor-selected-passage"]);
const emit = defineEmits(["create-new-passage", "update-passage", "save-content", "select-passage", "position-modified", "delete-passage"]);

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
  if (props.editorSelectedPassage !== 0) {
    const passage = props.storyContent.passages.find(p => Number(p.id) === Number(props.editorSelectedPassage));
    return {
      title: passage.title,
      description: passage.description
    }
  } else {
    return {
      title: '',
      description: ''
    }
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

function deleteNode() {
  editorState.value.hidden = true;
  emit('delete-passage');
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
  if (props.editorSelectedPassage === Number(event.node.id)) {
    if (!editorState.value.hidden) {
      editorState.value.hidden = true
    }
    emit('select-passage', {
      passageId: 0
    });
  } else {
    if (editorState.value.hidden) {
      editorState.value.hidden = false
    }
    emit('select-passage', {
      passageId: Number(event.node.id)
    });
  }
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
        <v-btn type="button" @click="addNode" color="primary" icon="mdi-plus">
        </v-btn>
        <v-dialog max-width="500">
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn type="button" v-bind="activatorProps" icon="mdi-delete" color="error"
              :readonly="editorSelectedPassage === 0" :variant="editorSelectedPassage === 0 ? 'outlined' : 'flat'">
            </v-btn>
          </template>
          <template v-slot:default="{ isActive }">
            <v-card title="Delete Passage">
              <v-card-text>
                Are you sure you want to delete this passage? This action is irreversible.
              </v-card-text>

              <v-card-actions>
                <v-btn text="Close" @click="isActive.value = false" size="large"></v-btn>
                <v-btn text="Yes" size="large" variant="tonal" color="error"
                  @click="isActive.value = false; emit('delete-passage')"></v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
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
