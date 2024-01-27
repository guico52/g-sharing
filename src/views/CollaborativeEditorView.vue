<script setup>
import {useEditor, EditorContent} from "@tiptap/vue-3";
import StarterKit from '@tiptap/starter-kit'
import * as Y from "yjs";
import {WebrtcProvider} from "y-webrtc";
import {Collaboration} from "@tiptap/extension-collaboration";
import {MyWebsocket} from "../ws/websocket.js";
import {useRoute} from "vue-router";
import {onUnmounted} from "vue";


const route = useRoute()
const fileId = route.query.fileId
const userId = Math.random().toString(36).substr(2)
// const websocket = new MyWebsocket(`ws://localhost:8221/websocket/${fileId}/${userId}`)
const ydoc = new Y.Doc()



const provider = new WebrtcProvider('file123', ydoc)
const editor = useEditor({
  content: '123',
  extensions: [
    StarterKit.configure({
      history: false,
    }),
    Collaboration.configure({
      document: ydoc,
      field: 'content'
    })
  ],

  // onUpdate: ({editor}) => {
  //   websocket.sendMessage(JSON.stringify(editor.getJSON()))
  // },
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
