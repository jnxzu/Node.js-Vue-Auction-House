<template>
  <div id="chat-container">
    <div id="users">
      <div
        v-for="user in users"
        :key="user.username"
        class="user"
        :class="{selected: user.username===selectedUser}"
        v-on:click="seeChat"
      >{{ user.username }}</div>
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
        <input id="sender-input" type="text" v-on:click="reset()" />
        <button v-on:click="sendMessage">Send</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Chat",
  data() {
    return {
      currentUser: "",
      users: [],
      selectedUser: "",
      messages: []
    };
  },
  methods: {
    scrollChat() {
      var chatDiv = document.getElementById("messages");
      chatDiv.scrollTop = chatDiv.scrollHeight;
    },
    seeChat: function(event) {
      this.selectedUser = event.target.innerText;
      axios
        .post("/getMessages", {
          target: this.selectedUser
        })
        .then(response => {
          this.messages = response.messages;
        });
    },
    sendMessage: function() {
      var msgInput = document.getElementById("sender-input");
      var msg = msgInput.value;
      if (msg) {
        axios.post("/sendMsg", { target: this.selectedUser, content: msg });
      } else {
        msgInput.style.border = "1px solid red";
      }
    },
    reset: () => {
      document.getElementById("sender-input").style.border = "none";
    }
  },
  beforeCreate() {
    axios.post("/auth").then(response => {
      this.currentUser = response.data.username;
      axios.post("/getUsers", { excluded: this.currentUser }).then(response => {
        this.users = response.data.users;
        this.selectedUser = this.users[0].username;
        axios
          .post("/getMessages", {
            target: this.selectedUser
          })
          .then(response => {
            this.messages = response.messages;
          });
      });
    });
  },
  mounted() {
    this.scrollChat();
  }
};
</script>
