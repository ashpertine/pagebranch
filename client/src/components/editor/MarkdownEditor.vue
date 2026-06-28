<script setup>
import { ref, watch, onMounted, computed } from "vue";
const props = defineProps(['editor-size', 'editor-title-content', 'editor-content']);
const emit = defineEmits(['toggle-expand', 'content-updated', 'passage-selected', 'toggle-view'])
import { useDisplay } from "vuetify";
import { marked } from "marked";
import DOMPurify from 'dompurify';

const titleEl = ref(null);
const tab = ref('main');

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

const { name } = useDisplay()
const editorWidth = computed(() => {
  if (props.editorSize === 'expandedSize') {
    switch (name.value) {
      case 'xs': return "md-full-width";
      case 'sm': return "md-full-width";
      case 'md': return "md-full-width";
      case 'lg': return "md-expanded-lg-width";
      case 'xl': return "md-expanded-xl-width";
      case 'xxl': return "md-expanded-xxl-width";
    }
  } else {
    switch (name.value) {
      case 'xs': return "md-full-width";
      case 'sm': return "md-full-width";
      case 'md': return "md-lg-width";
      case 'lg': return "md-lg-width";
      case 'xl': return "md-xl-width";
      case 'xxl': return "md-xxl-width";
    }
  }
})

const editorHeight = computed(() => {
  switch (props.editorSize) {
    case 'expandedSize': return "md-full-height"
    default:
      return "md-half-height"
  }
})

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

const previewHtml = computed(() => {
  if (tab.value === 'preview') {
    const contentParsed = marked.parse(props.editorContent);
    return DOMPurify.sanitize(`<h1>${props.editorTitleContent}</h1><br>${contentParsed}`);
  }
})

</script>
<template>
  <v-sheet class="custom-markdown-editor" border rounded :elevation="4" :class="[editorWidth, editorHeight]">
    <v-toolbar>
      <v-toolbar-title v-if="tab === 'main'">
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

    <v-tabs v-model="tab" color="blue" fixed-tabs>
      <v-tab value="main">Editor</v-tab>
      <v-tab value="preview">Preview</v-tab>
      <v-tab value="reorder">Reorder Choices</v-tab>
    </v-tabs>
    <v-divider></v-divider>
    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="main" class="d-flex flex-column flex-grow-1">
        <v-container fluid>
          <h1 ref="titleEl" contenteditable="true" @focus="editorButtonsDisabled = true"
            @focusout="editorButtonsDisabled = false" @keydown.enter="(event) => event.preventDefault()"
            class="pb-editor-title" @keyup="sendContentUpdate"></h1>
        </v-container>
        <hr class="pb-editor-seperator">
        <v-container fluid class="d-flex flex-column flex-grow-1 pb-editor-container">
          <textarea class="pb-editor" @keyup="sendContentUpdate" @keyup.escape="emit('toggle-view')"
            :value="editorContent"></textarea>
        </v-container>
      </v-tabs-window-item>
      <v-tabs-window-item value="preview" class="d-flex flex-column flex-grow-1">
        <v-container fluid class="d-flex flex-column flex-grow-1 pb-preview-wrapper h-0">
          <div v-html="previewHtml" class="pb-preview-container">
          </div>
        </v-container>
      </v-tabs-window-item>
      <v-tabs-window-item value="reorder">
        <v-sheet class="pa-5" color="brown">Three</v-sheet>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-sheet>
</template>
<style scoped>
.custom-markdown-editor {
  position: absolute;
  margin: 16px;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
}

/* Make the tabs window (and its inner container) grow to fill remaining space */
.custom-markdown-editor :deep(.v-window) {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.custom-markdown-editor :deep(.v-window__container) {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.custom-markdown-editor :deep(.v-window-item) {
  flex: 1 1 auto;
  min-height: 0;
}

.custom-markdown-editor.md-full-width {
  left: 0;
}

.custom-markdown-editor.md-lg-width {
  width: 500px;
}

.custom-markdown-editor.md-xl-width,
.custom-markdown-editor.md-xxl-width {
  width: 600px;
}

.custom-markdown-editor.md-expanded-lg-width {
  width: 800px;
}

.custom-markdown-editor.md-expanded-xl-width,
.custom-markdown-editor.md-expanded-xxl-width {
  width: 900px;
}

.custom-markdown-editor.md-half-height {
  height: 55%;
}

.custom-markdown-editor.md-full-height {
  height: 85%;
}

.pb-editor-container {
  min-height: 0;
}

.pb-preview-wrapper {
  min-height: 0;
}

.pb-preview-container {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  word-wrap: break-word;
}


.pb-preview-container :deep(h1),
.pb-preview-container :deep(h2),
.pb-preview-container :deep(h3),
.pb-preview-container :deep(h4),
.pb-preview-container :deep(h5) {
  margin: 0;
}

.pb-editor {
  font-size: 1.2rem;
  border: 0;
  outline: 0px solid transparent;
  background-color: transparent;
  flex: 1 1 auto;
  width: 100%;
  min-height: 0;
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
