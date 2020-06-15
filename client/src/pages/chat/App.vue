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
import io from "socket.io-client";

var socket = io();

export default {
  name: "Index",
  components: {
    Chat,
  },
  created() {
    socket.on("outBid", (oldLead, item, newLead) => {
      if (this.currentUser === oldLead) {
        alert(`${newLead} outbid you in the auction for ${item}`);
      }
    });
  },
};
</script>

<style lang="scss" src="@/style/global.scss"></style>
<style lang="scss" src="@/style/chat.scss"></style>
