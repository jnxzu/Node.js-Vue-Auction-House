<template>
  <div id="chat-container">
    <div id="users">
      <div class="user">username</div>
    </div>
    <div id="chat">
      <div id="messages">
        <div class="message">
          <div class="content my">policje</div>
        </div>
        <div class="message">
          <div class="content his">nalezy pierdolic wiadomo</div>
        </div>
      </div>
      <div id="sender">
        <input type="text" />
        <button>Send</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Chat",
  props: {
    isSignup: Boolean
  },
  data() {
    return {
      currentUser: ""
    };
  },
  methods: {
    scrollChat() {
      var chatDiv = document.getElementById("messages");
      chatDiv.scrollTop = chatDiv.scrollHeight;
    }
  },
  mounted() {
    axios.post("/auth").then(response => {
      this.currentUser = response.data.username;
    });

    this.scrollChat();
  }
};
</script>
