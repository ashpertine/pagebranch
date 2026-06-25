<script setup>
import { ref, computed, onMounted } from "vue";
const props = defineProps(['height', 'width', 'editor-title-content', 'editor-content']);
const emit = defineEmits(['toggle-expand', 'toggle-view', 'content-updated'])

function insertMd(md) {
  const editor = document.querySelector('.pb-editor');
  const posStart = editor.selectionStart;
  const posEnd = editor.selectionEnd;
  const fullMd = `${md} `;
  const newInnerText = editor.value.slice(0, posStart) + fullMd + editor.value.slice(posStart);
  editor.value = newInnerText;

  editor.focus();
  editor.selectionEnd = posEnd + fullMd.length;
}
const editorButtonsDisabled = ref(false);
onMounted(() => {
  const editor = document.querySelector('.pb-editor');
  editor.focus();
})

const startingEditorTitleContent = ref(props.editorTitleContent) // Passing editorTitleContent directly into h1 tag will cause interference
</script>
<template>
  <v-sheet :height="height" :width="width" class="position-absolute right-0 bottom-0 mr-8 mb-8 d-flex flex-column"
    border rounded :elevation="4">
    <v-toolbar>
      <v-toolbar-title>
        <v-btn icon="mdi-format-header-1" @click="insertMd('#')" variant="text" :disabled="editorButtonsDisabled">
        </v-btn>
        <v-btn icon="mdi-format-header-2" @click="insertMd('##')" variant="text" :disabled="editorButtonsDisabled">
        </v-btn>
        <v-btn icon="mdi-format-list-bulleted" @click="insertMd('-')" variant="text" :disabled="editorButtonsDisabled">
        </v-btn>
      </v-toolbar-title>
      <v-btn icon="mdi-fullscreen" variant="text" @click="emit('toggle-expand')"></v-btn>
      <v-btn icon="mdi-window-close" variant="text" @click="emit('toggle-view')"></v-btn>
    </v-toolbar>

    <v-container fluid>
      <h1 contenteditable="true" @focus="editorButtonsDisabled = true" @focusout="editorButtonsDisabled = false"
        @keydown.enter="(event) => event.preventDefault()" class="pb-editor-title"
        @keydown="(event) => emit('content-updated', event.target.innerText)"> {{ startingEditorTitleContent }}</h1>
    </v-container>
    <hr class="pb-editor-seperator">
    <v-container fluid class="d-flex flex-column flex-grow-1 overflow-y-scroll ">
      <textarea class="pb-editor" @keydown="(event) => emit('content-updated', event.target.value)"
        @keydown.escape="emit('toggle-view')"></textarea>
    </v-container>
  </v-sheet>
</template>
<style scoped>
.pb-editor {
  font-size: 1.2rem;
  border: 0;
  outline: 0px solid transparent;
  background-color: transparent;
  height: 100%;
  resize: none;
}

.pb-editor-title {
  border: 0;
  margin: 0;
  outline: 0px solid transparent;
  background-color: transparent;
  height: 100%;
  resize: none;
  overflow-y: scroll;
}

.pb-editor-seperator {
  width: 100%;
  opacity: 30%;
}
</style>
