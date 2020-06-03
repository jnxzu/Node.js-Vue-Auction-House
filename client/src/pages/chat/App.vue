<template>
  <div id="app">
    <div id="center-container">
      <div id="center">
        <Chat />
      </div>
    </div>
  </div>
</template>

<script>
import Chat from "@/components/Chat.vue";

export default {
  name: "Index",
  components: {
    Chat
  }
};
</script>

<style lang="scss" src="@/style/global.scss"></style>
<style lang="scss" src="@/style/chat.scss"></style>
