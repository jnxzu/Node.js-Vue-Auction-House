<template>
  <div id="app">
    <div id="center-container">
      <div id="center">
        <Listing
          :currentUser="currentUser"
          v-for="listing in listings"
          :key="listing.item"
          :host="listing.host.username"
          :item="listing.item"
          :price="listing.price"
          :expiry="listing.expiry"
          :quickbuy="listing.quickbuy"
          :finished="listing.finished"
          :topBid="!!listing.topBid ? listing.topBid.username : false"
        />
        <div v-if="!listings.length" class="nope">sorry, nothing here</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import io from 'socket.io-client';
import Listing from '../../components/Listing.vue';

const socket = io();

export default {
  name: 'Index',
  components: {
    Listing,
  },
  data() {
    return {
      listings: [],
      currentUser: '',
    };
  },
  // created() {
  //   socket.on('updateListings', () => {
  //     axios.post('/getListings', { query: 'dash' }).then(response => {
  //       this.listings = response.data.listings;
  //     });
  //   });
  // },
  created() {
    socket.on('outBid', (oldLead, item, newLead) => {
      if (this.currentUser === oldLead) {
        alert(`${newLead} outbid you in the auction for ${item}`);
      }
    });
  },
  mounted() {
    axios.post('/auth').then((response) => {
      this.currentUser = response.data.username;
    });
    axios.post('/getListings', { query: 'dash' }).then((response) => {
      this.listings = response.data.listings;
    });
  },
};
</script>

<style lang='scss' src='@/style/global.scss'></style>
<style lang='scss' src='@/style/listings.scss'></style>
