<script setup>
  import { ref, onMounted, computed } from 'vue';
  import PassageNode from "./PassageNode.vue";
  import MarkdownEditor from "./MarkdownEditor.vue";
  import { Background } from '@vue-flow/background'
  import { useVueFlow, VueFlow, Panel, Position } from '@vue-flow/core';

  const { addEdges, addNodes } = useVueFlow();
  const count = ref(2);
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

  const initialNodes = ref([
    { 
      id: '1', // must be a string
      position: { x: 50, y: 50 },
      type: "passage",
      label: `Node ${count.value}`,
      data: { title: `Node 1`, description: `Node 1 description`},
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    },
    { 
      id: String(count.value), // must be a string
      position: { x: 50, y: 50 },
      type: "passage",
      label: `Node ${count.value}`,
      data: { title: `Node ${count.value}`, description: `Node ${count.value} description`},
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    }
  ])

  const initialEdges = ref([
    {
      id: `e1->2`,
      source: '1',
      target: '2',
    }
  ])


  function addNode() {
    count.value++;
    const newNode = {
      id: String(count.value),
      position: { x: 150, y: 50 },
      type: "passage",
      label: `Node ${count.value}`,
      data: { title: `Node ${count.value}`, description: `Node ${count.value} description`},
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    }

    addNodes(newNode)
  }
  
  addEdges([
    {
      source: '1',
      target: '2',
    }
  ])
</script>
<template>
  <VueFlow :nodes="initialNodes" :edges="initialEdges"> 
    <Background variant="dots"/>
    <template #node-passage="props">
      <PassageNode v-bind="props"/>
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
    <MarkdownEditor v-if="!editorState.hidden"
    :height="editorState[editorState.expandedState].height"
    :width="editorState[editorState.expandedState].width"
    @toggle-expand="toggleEditorExpand"
    />
  </v-slide-y-reverse-transition>
</template>
<style>
  @import '@vue-flow/core/dist/style.css';
  @import '@vue-flow/core/dist/theme-default.css'
</style>
