<template>
  <div id="app">
    <div id="center-container">
      <div id="center">
        <Listing
          v-for="listing in listings"
          :key="listing.item"
          :host="listing.host.username"
          :item="listing.item"
          :price="listing.price"
          :expiry="listing.expiry"
          :quickbuy="listing.quickbuy"
          :finished="listing.finished"
          :topBid="listing.topBid.username"
          :currentUser="currentUser"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Listing from "@/components/Listing.vue";

export default {
  name: "Index",
  components: {
    Listing
  },
  data() {
    return {
      listings: [],
      currentUser: ""
    };
  },
  methods: {
    getListings: function() {
      axios.post("/getListings", {}).then(response => {
        this.listings = response.data.listings;
      });
    },
    isAuthenticated: function() {
      axios.post("/auth").then(response => {
        this.currentUser = response.data.username;
      });
    }
  },
  created() {
    this.isAuthenticated();
    this.getListings();
  }
};
</script>

<style lang="scss" src="@/style/global.scss"></style>
<style lang="scss" src="@/style/listings.scss"></style>
