<script setup>
import {useEditor, EditorContent, Editor} from "@tiptap/vue-3";
import StarterKit from '@tiptap/starter-kit'


import {onMounted, onUnmounted, ref} from "vue";
import {backupFileContent} from "../api/backup.js";
import {useRoute} from "vue-router";

const route = useRoute()
const content = ref('');

//
// const provider = new WebrtcProvider('file123', ydoc)
const editor = new Editor({
  content: content,
  editable: false,
  extensions: [
    StarterKit.configure({
      history: false,
    }),
  ],
})
onMounted( () => {
  const id = route.params.id
  console.log(route.params)
  console.log(id)
  backupFileContent(id).then(
      res => {
        console.log(res.data)
        editor.commands.setContent(res.data.data)
      }
  )
})


// onUnmounted(() => {
//   websocket.closeWebSocketConnection()
// })

</script>

<template>
  <editor-content class="editor" :editor="editor"></editor-content>
</template>

<style scoped>

</style>
