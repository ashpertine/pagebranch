<script setup>  
  import { ref, computed, onMounted } from "vue";
  const props = defineProps(['height', 'width']);
  const emit = defineEmits(['toggle-expand', 'toggle-view'])
  const editorContent = ref("");

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

  onMounted(() => {
    const editor = document.querySelector('.pb-editor');
    editor.focus(); 
  })
</script>
<template>
    <v-sheet :height="height" :width="width" 
    class="position-absolute right-0 bottom-0 mr-8 mb-8 d-flex flex-column" border rounded :elevation="4">
      <v-toolbar>
        <v-toolbar-title>
          <v-btn
            icon="mdi-format-header-1" 
            @click="insertMd('#')"
            variant="text"
            >
          </v-btn>
          <v-btn
            icon="mdi-format-header-2" 
            @click="insertMd('##')"
            variant="text"
            >
          </v-btn>
          <v-btn
            icon="mdi-format-list-bulleted" 
            @click="insertMd('-')"
            variant="text"
            >
          </v-btn>
        </v-toolbar-title>
        <v-btn icon="mdi-fullscreen" variant="text" @click="emit('toggle-expand')"</v-btn>
      </v-toolbar>
      <v-container fluid class="d-flex flex-column flex-grow-1 overflow-y-scroll ">
        <textarea class="pb-editor" v-model="editorContent" @keyup="console.log(editorContent)" @keydown.escape="emit('toggle-view')"></textarea>
      </v-container>
      <v-container fluid>
        <v-btn>Hello</v-btn>
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
</style>
