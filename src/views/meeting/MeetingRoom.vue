<template>
  <div @keydown.ctrl.alt="handleKeyDown">
    <Basic @keydown.ctrl.alt="handleKeyDown"/>
  </div>
</template>

<script>
import MeetingReact from "./react_app/MeetingReact.jsx";
import {applyPureReactInVue, applyReactInVue} from "veaury";

export default {
  components: {
    Basic: applyPureReactInVue(MeetingReact)
  },
  methods: {
    handleKeyDown(event){
      event.preventDefault();
      console.log('Ctrl + Alt + Keydown')
    }
  }
}
</script>
