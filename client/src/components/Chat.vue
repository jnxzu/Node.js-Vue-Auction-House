<template>
  <div id="chat-container">
    <div v-if="users.length" id="users">
      <div
        v-for="user in users"
        :key="user.username"
        class="user"
        :class="{ selected: user.username === selectedUser }"
        v-on:click="seeChat"
      >{{ user.username }}</div>
    </div>
    <div v-if="users.length" id="chat">
      <div id="messages">
        <div class="message" v-for="(msg, index) in messages" :key="index">
          <div
            class="content"
            :class="{
              my: msg.author.username === currentUser,
              his: msg.author.username !== currentUser,
            }"
          >{{ msg.content }}</div>
        </div>
      </div>
      <div id="sender">
        <input id="sender-input" type="text" v-on:click="reset()" />
        <button v-on:click="sendMessage">Send</button>
      </div>
    </div>
    <div v-else class="nope">sorry, nobody here</div>
  </div>
</template>

<script>
import axios from "axios";
import io from "socket.io-client";

var socket = io();

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
          this.messages = response.data.messages;
        });
    },
    sendMessage: function() {
      var msgInput = document.getElementById("sender-input");
      var msg = msgInput.value;
      if (msg) {
        axios
          .post("/sendMsg", { target: this.selectedUser, content: msg })
          .then(response => {
            msgInput.value = response.data.clear;
          });
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
            this.messages = response.data.messages;
          });
      });
    });
  },
  created() {
    socket.on("updateUsers", () => {
      axios.post("/getUsers", { excluded: this.currentUser }).then(response => {
        this.users = response.data.users;
      });
    });
    socket.on("updateMessages", () => {
      axios
        .post("/getMessages", {
          target: this.selectedUser
        })
        .then(response => {
          this.messages = response.data.messages;
        });
    });
  },
  mounted() {
    this.scrollChat();
  }
};
</script>
