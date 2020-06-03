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
import axios from "axios";
import Chat from "@/components/Chat.vue";

export default {
  name: "Index",
  components: {
    Chat,
  },
  data() {
    return {
      authenticated: false,
    };
  },
  methods: {
    isAuthenticated: function() {
      axios.post("/auth").then((response) => {
        this.authenticated = response.data.authenticated;
      });
    },
  },
  mounted() {
    this.isAuthenticated();
  },
};
</script>

<style lang="scss" src="@/style/global.scss"></style>
<style lang="scss" src="@/style/chat.scss"></style>
