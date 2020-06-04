<template>
  <div id="app">
    <div id="center-container">
      <div id="center">
        <NewListing />
      </div>
    </div>
  </div>
</template>

<script>
import NewListing from "@/components/NewListing.vue";
import axios from "axios";

export default {
  name: "Index",
  components: {
    NewListing
  },
  data() {
    return {
      submitter: ""
    };
  },
  mounted() {
    axios.post("/auth").then(response => {
      this.submitter = response.data.username;
    });
  }
};
</script>

<style lang="scss" src="@/style/global.scss"></style>
<style lang="scss" src="@/style/forms.scss"></style>
