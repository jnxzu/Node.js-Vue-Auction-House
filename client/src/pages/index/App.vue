<template>
  <div id="app">
    <div id="center-container">
      <div id="center">
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
  name: "Index",
  components: {
    IndexOption
  },
  data() {
    return {
      authenticated: false
    };
  },
  mounted() {
    axios.post("/auth").then(response => {
      this.authenticated = response.data.authenticated;
    });
  }
};
</script>

<style lang="scss" src="@/style/global.scss"></style>
<style lang="scss" src="@/style/index.scss"></style>
