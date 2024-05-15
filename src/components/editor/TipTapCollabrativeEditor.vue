<template @keydown.ctrl.alt="toggleFloatInput">
  <div class="editor" v-if="editor" >
    <div class="editor__header__container" @keydown.ctrl.alt="toggleFloatInput">
      <menu-bar class="editor__header" :editor="editor"/>
    </div>
    <editor-content class="editor__content" :editor="editor" @keydown.ctrl.alt="toggleFloatInput"/>
    <div class="editor__footer">
      <div :class="`editor__status editor__status--${status}`">
        <template v-if="status === 'connected'">
          {{ editor.storage.collaborationCursor.users.length }}
          名用户在同时编辑
        </template>
        <template v-else>
          offline
        </template>
      </div>
      <div class="editor__name">
        <button @click="setName">
          {{ currentUser.name }}
        </button>
      </div>
    </div>
  </div>
  <NInput v-show="showFloatInput"
          @keydown.ctrl.alt="toggleFloatInput"
          @keydown.enter="aiGenerate"
          v-model:value="floatInput"
          class="float-input"
          placeholder="输入指令"/>
</template>

<script>

import CharacterCount from '@tiptap/extension-character-count'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import Highlight from '@tiptap/extension-highlight'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import StarterKit from '@tiptap/starter-kit'
import {Editor, EditorContent} from '@tiptap/vue-3'
import * as Y from 'yjs'

import MenuBar from './MenuBar.vue'
import {WebrtcProvider} from "y-webrtc";
import {MyWebsocket} from "../../ws/websocket.js";
import {filePermission, getFileContent, getUserInfo} from "../../api/file.js";
import {router} from "../../router/router.js";
import {BASE_URL, message} from "../../api/api.js";
import {UserFilePermissionEnum} from "../../util/enums.js";
import {NInput} from "naive-ui";


// 获取随机的数组下标，用于获取随机的颜色
const getRandomElement = list => {
  return list[Math.floor(Math.random() * list.length)]
}
export default {

  components: {
    EditorContent,
    MenuBar,
    NInput
  },

  data() {
    return {
      currentUser: {
        name: '',
        id: '',
        color: this.getRandomColor(),
      },
      provider: null,
      editor: null,
      status: 'connecting',
      room: '',
      editable: false,
      showFloatInput: true,
      floatInput: ''
    }
  },

  mounted() {
    // 初始化变量
    const ydoc = new Y.Doc();
    this.room = this.$route.query.fileId;
    getUserInfo(this.room).then(res => {
      this.currentUser.name = res.data.data.username;
      this.currentUser.id = res.data.data.userId;
      this.provider = new WebrtcProvider(this.room, ydoc);
      this.websocketPrivider = new MyWebsocket(
          `ws://localhost:8221/websocket/${this.room}/${this.currentUser.id}`,
          () => this.status = 'connected',
          () => {
          },
          () => console.error("websocket error"),
          () => {
            this.status = 'disconnected';
          }
      );
      this.editor = new Editor({
        editorProps: {
          attributes: {
            class: 'editor__content',
          },
        },
        onUpdate: ({editor}) => {
          this.websocketPrivider.sendMessage(
              JSON.stringify(
                  {
                    "type": "content",
                    "html": editor.getHTML(),
                    "text": editor.getText()
                  }
              ))
        },
        extensions: [
          StarterKit.configure({
            history: false,
          }),
          Highlight,
          TaskList,
          TaskItem,
          Collaboration.configure({
            document: ydoc,
          }),
          CollaborationCursor.configure({
            provider: this.provider,
            user: this.currentUser
          }),
          CharacterCount.configure({
            limit: 10000
          }),
        ],
      });
      filePermission(this.room).then(res => {
        console.log(res.data.data.level)
        if (res.data.data.level <= UserFilePermissionEnum.UNREADABLE) {
          // 回到上一页
          router.go(-1)
          message.error('您没有权限查看该文件')
        }
        if (res.data.data.level <= UserFilePermissionEnum.READ_ONLY) {
          this.editor.commands.setEditable(false)
          message.info('您只有查看权限')
        }
        if (res.data.data.level >= UserFilePermissionEnum.READ_WRITE) {
          this.editable = true
          this.editor.commands.setEditable(true)
          message.success('您有编辑权限')
        }
      })
      getFileContent(this.room).then(res => {
        console.log(res.data.data.html)
        this.editor.commands.setContent(res.data.data.html);
      })
      this.editor.css.append(`
    .ProseMirror:focus {
      border: none;
    }
    `)
    })

  },
  watch: {
    editor: function (newVal, oldVal) {
      console.log("editor changed, oldVal: ", oldVal, "newVal: ", newVal);
    }
  },

  methods: {
    setName() {
      const name = (window.prompt('Name') || '')
          .trim()
          .substring(0, 32)
      if (name) {
        return this.updateCurrentUser({
          name,
        })
      }
    },

    updateCurrentUser(attributes) {
      this.currentUser = {...this.currentUser, ...attributes};
      this.editor.chain().focus().updateUser(this.currentUser).run();
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    },

    getRandomColor() {
      return getRandomElement([
        '#958DF1',
        '#F98181',
        '#FBBC88',
        '#FAF594',
        '#70CFF8',
        '#94FADB',
        '#B9F18D',
      ])
    },

    toggleFloatInput(e) {
      e.preventDefault()
      this.showFloatInput = !this.showFloatInput
    },

    async aiGenerate() {
      const response = await fetch(BASE_URL + '/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({
          prompt: '请你基于我的文章内容和指令进行生成，文章内容为：' + this.editor.getText(),
          content: '指令为:' + this.floatInput
        })
      })
      const reader = response.body.getReader();
      let receivedLength = 0; // received that many bytes at the moment
      let chunks = []; // array of received binary chunks (comprises the body)
      while (true) {
        const {done, value} = await reader.read();

        if (done) {
          break;
        }

        chunks.push(value);
        receivedLength += value.length;

        const chunk = new TextDecoder("utf-8").decode(value, {stream: true});
        if(chunk.startsWith("{\"timestamp\":")){
          continue;
        }
        this.editor.commands.insertContent(chunk, {updateSelection: true});
      }

      // Concatenate all chunks to form the final data
      const chunksAll = new Uint8Array(receivedLength);
      let position = 0;
      for (let chunk of chunks) {
        chunksAll.set(chunk, position);
        position += chunk.length;
      }
      const finalData = new TextDecoder("utf-8").decode(chunksAll);
      console.log("Complete data received:", finalData);
    },

    beforeUnmount() {
      this.editor.destroy()
      this.provider.destroy()
      this.websocketPrivider.closeWebSocketConnection()
    },
  }
}
</script>

<style lang="scss">
.float-input {
  position: absolute;
  top: 40%; /* Adjust as needed */
  left: 50%; /* Center the input box */
  transform: translateX(-50%); /* Ensure the input box remains centered */
  z-index: 1000; /* Ensure the input box floats above other elements */
  height: 3em;
  width: 20em;
  /*展示在最上方*/
}

.editor__header__container {
  /*元素垂直剧中*/
  display: flex;
  flex-direction: column;
  justify-content: center;
  /*元素横向居中*/
  align-items: center;
  width: 100vw;

  background: #0D0D0D;

}

.editor {
  background-color: #FFF;
  border: 3px solid #0D0D0D;
  border-radius: 0.75rem;
  color: #0D0D0D;
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-height: 100vh;

  &__header {
    align-items: center;
    background: #0d0d0d;
    border-bottom: 3px solid #0d0d0d;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    display: flex;
    flex: 0 0 auto;
    flex-wrap: wrap;
    padding: 0.25rem;
  }

  &__content {
    flex: 1 1 auto;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 1.25rem 1rem;
    -webkit-overflow-scrolling: touch;
  }

  &__footer {
    align-items: center;
    border-top: 3px solid #0D0D0D;
    color: #0D0D0D;
    display: flex;
    flex: 0 0 auto;
    flex-wrap: wrap;
    font-size: 12px;
    font-weight: 600;
    justify-content: space-between;
    padding: 0.25rem 0.75rem;
    white-space: nowrap;
  }

  /* Some information about the status */
  &__status {
    align-items: center;
    border-radius: 5px;
    display: flex;

    &::before {
      background: rgba(#0D0D0D, 0.5);
      border-radius: 50%;
      content: ' ';
      display: inline-block;
      flex: 0 0 auto;
      height: 0.5rem;
      margin-right: 0.5rem;
      width: 0.5rem;
    }

    &--connecting::before {
      background: #616161;
    }

    &--connected::before {
      background: #B9F18D;
    }
  }

  &__name {
    button {
      background: none;
      border: none;
      border-radius: 0.4rem;
      color: #0D0D0D;
      font: inherit;
      font-size: 12px;
      font-weight: 600;
      padding: 0.25rem 0.5rem;

      &:hover {
        background-color: #0D0D0D;
        color: #FFF;
      }
    }
  }
}

/* Give a remote user a caret */
.collaboration-cursor__caret {
  border-left: 1px solid #0D0D0D;
  border-right: 1px solid #0D0D0D;
  margin-left: -1px;
  margin-right: -1px;
  pointer-events: none;
  position: relative;
  word-break: normal;
}

/* Render the username above the caret */
.collaboration-cursor__label {
  border-radius: 3px 3px 3px 0;
  color: #0D0D0D;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  left: -1px;
  line-height: normal;
  padding: 0.1rem 0.3rem;
  position: absolute;
  top: -1.4em;
  user-select: none;
  white-space: nowrap;
}

/* Basic editor styles */
.tiptap {
  > * + * {
    margin-top: 0.75em;
  }

  ul,
  ol {
    padding: 0 1rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }

  pre {
    background: #0D0D0D;
    border-radius: 0.5rem;
    color: #FFF;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;

    code {
      background: none;
      color: inherit;
      font-size: 0.8rem;
      padding: 0;
    }
  }

  mark {
    background-color: #FAF594;
  }

  img {
    height: auto;
    max-width: 100%;
  }

  hr {
    margin: 1rem 0;
  }

  blockquote {
    border-left: 2px solid rgba(#0D0D0D, 0.1);
    padding-left: 1rem;
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0D0D0D, 0.1);
    margin: 2rem 0;
  }

  ul[data-type="taskList"] {
    list-style: none;
    padding: 0;

    li {
      align-items: center;
      display: flex;

      > label {
        flex: 0 0 auto;
        margin-right: 0.5rem;
        user-select: none;
      }

      > div {
        flex: 1 1 auto;
      }
    }
  }
}


.editor__content :focus-visible {
  outline: none;
}
</style>
