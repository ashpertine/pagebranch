<script setup>
import { ref, watch, onMounted } from "vue";
const props = defineProps(['height', 'width', 'editor-title-content', 'editor-content']);
const emit = defineEmits(['toggle-expand', 'content-updated', 'passage-selected', 'toggle-view'])

const titleEl = ref(null);

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

function sendContentUpdate() {
  const title = titleEl.value.innerText;
  const description = document.querySelector('.pb-editor').value;

  emit('content-updated', { title, description });
}

// Only update the h1 DOM content FROM THE PROP when the element isn't focused
// (i.e. when switching to a different passage, not while the user is typing)
watch(() => props.editorTitleContent, (newVal) => {
  if (titleEl.value && document.activeElement !== titleEl.value) {
    titleEl.value.innerText = newVal;
  }
});

onMounted(() => {
  if (titleEl.value) {
    titleEl.value.innerText = props.editorTitleContent ?? '';
  }
  const editor = document.querySelector('.pb-editor');
  editor.focus();
})

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
      <h1 ref="titleEl" contenteditable="true" @focus="editorButtonsDisabled = true"
        @focusout="editorButtonsDisabled = false" @keydown.enter="(event) => event.preventDefault()"
        class="pb-editor-title" @keyup="sendContentUpdate"></h1>
    </v-container>
    <hr class="pb-editor-seperator">
    <v-container fluid class="d-flex flex-column flex-grow-1 overflow-y-scroll ">
      <textarea class="pb-editor" @keyup="sendContentUpdate" @keyup.escape="emit('toggle-view')"
        :value="editorContent"></textarea>
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
