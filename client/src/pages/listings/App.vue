<template>
  <div id="app">
    <div id="center-container">
      <div id="center"></div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Index",
  components: {},
  data() {
    return {
      authenticated: false
    };
  },
  methods: {
    isAuthenticated: function() {
      axios.post("/auth").then(response => {
        this.authenticated = response.data.authenticated;
      });
    }
  },
  mounted() {
    this.isAuthenticated();
  }
};
</script>

<style lang="scss" src="@/style/global.scss"></style>
<style lang="scss" src="@/style/listings.scss"></style>
