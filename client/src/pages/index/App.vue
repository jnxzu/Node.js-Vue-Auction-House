<template>
  <div id="app">
    <div id="index-options-container">
      <div id="index-options">
        <IndexOption Option="Dashboard" Dest="dashboard" v-if="authenticated" />
        <IndexOption Option="Listings" Dest="listings" />
        <IndexOption Option="History" Dest="history" v-if="authenticated" />
        <IndexOption Option="List" Dest="list" v-if="authenticated" />
        <IndexOption Option="Chat" Dest="chat" v-if="authenticated" />
        <IndexOption Option="Logout" Dest="logout" v-if="authenticated" />
        <IndexOption Option="Login" Dest="login" v-if="!authenticated" />
        <IndexOption Option="Signup" Dest="signup" v-if="!authenticated" />
      </div>
    </div>
  </div>
</template>

<script>
import IndexOption from "@/components/IndexOption.vue";
import axios from "axios";

export default {
  name: "App",
  components: {
    IndexOption
  },
  data() {
    return {
      authenticated: false
    };
  },
  methods: {
    isAuthenticated: function() {
      axios.post("http://localhost:3000/auth").then(response => {
        this.authenticated = response.data.authenticated;
        console.log(this.authenticated);
      });
    }
  },
  mounted() {
    this.isAuthenticated();
  }
};
</script>

<style lang="scss" src="@/style/global.scss"></style>
<style lang="scss" src="@/style/index.scss"></style>
