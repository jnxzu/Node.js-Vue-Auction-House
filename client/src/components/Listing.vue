<template>
  <div class='listing'>
    <div class='listing-group'>
      <div class='listing-group-top'>listed by:</div>
      <div class='listing-group-bot'>{{ host }}</div>
    </div>
    <div class='listing-group'>
      <div class='listing-group-top'>item:</div>
      <div class='listing-group-bot'>{{ item }}</div>
    </div>
    <div class='listing-group'>
      <div
        class='listing-group-top'
        v-if='status === "bid" || status === "ownerA"'
      >
        current price:
      </div>
      <div class='listing-group-top' v-else>price:</div>
      <div class='listing-group-bot'>{{ price }}</div>
    </div>
    <div class='listing-group'>
      <div
        class='listing-group-top'
        v-if='status === "bid" || status === "ownerA"'
      >
        top bidder:
      </div>
      <div class='listing-group-top' v-else>bought by:</div>
      <div class='listing-group-bot' v-if='topBid'>{{ topBid }}</div>
      <div class='listing-group-bot cursive' v-else>nobody</div>
    </div>
    <div class='listing-group'>
      <div
        class='listing-group-top'
        v-if='status === "bought" || status === "sold"'
      >
        was bought:
      </div>
      <div class='listing-group-top' v-else-if='status === "expired"'>
        expired:
      </div>
      <div class='listing-group-top' v-else>expires:</div>
      <div class='listing-group-bot'>{{ timediff }}</div>
    </div>
    <div class='listing-group-action sold' v-if='status === "sold"'>SOLD</div>
    <div class='listing-group-action bought' v-else-if='status === "bought"'>
      BOUGHT
    </div>
    <div class='listing-group-action ended' v-else-if='status === "expired"'>
      EXPIRED
    </div>
    <div
      class='listing-group-action owner'
      v-else-if='status === "ownerA" || status === "ownerQ"'
    >
      OWNER
    </div>
    <div
      class='listing-group-action buy'
      v-else-if='status === "buy"'
      v-on:click='bidOrBuy()'
    >
      BUY
    </div>
    <div
      class='listing-group-action bid'
      v-else-if='status === "bid"'
      v-on:click='bidOrBuy()'
    >
      <!-- <input
        type='number'
        id='bid-amount'
        :min='newPrice'
        v-model='newPrice'
        v-if='currentUser'
      /> -->
      BID
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io();

export default {
  name: 'IndexOption',
  props: {
    host: String,
    item: String,
    price: Number,
    expiry: String,
    quickbuy: Boolean,
    currentUser: String,
    topBid: String,
    finished: Boolean,
  },
  data() {
    return {
      newPrice: this.price + 1,
      timediff: moment(this.expiry).fromNow(),
      timer: '',
      status: this.quickbuy
        ? this.host === this.currentUser
          ? 'ownerQ'
          : 'buy'
        : this.host === this.currentUser
          ? 'ownerA'
          : 'bid',
    };
  },
  created() {
    socket.on('updateListing', (item, bidder, price) => {
      if (item === this.$props.item) {
        this.$props.price = price;
        this.$props.topBid = bidder;
      }
    });

    this.updateStatus();
    this.timer = setInterval(this.updateStatus, 1000 * 5);
  },
  methods: {
    bidOrBuy() {
      socket.emit(
        'bidOrBuy',
        this.$props.item,
        this.$props.quickbuy,
        this.newPrice,
        this.$props.currentUser,
        this.$props.topBid,
      );
    },
    updateStatus() {
      this.timediff = moment(this.expiry).fromNow();
      const isOwner = this.host === this.currentUser;
      const timeUp = moment(this.expiry).isBefore(moment());
      if (
        this.status === 'bought'
        || this.status === 'expired'
        || this.status === 'sold'
      ) return 0;
      if (timeUp) {
        if (!this.finished) {
          axios.post('/timeOutAuction', { item: this.item });
        }
        if (isOwner) {
          if (this.topBid) this.status = 'sold';
          else this.status = 'expired';
        } else if (this.topBid === this.currentUser) this.status = 'bought';
        else this.status = '';
      } else if (isOwner) {
        if (this.quickbuy) this.status = 'ownerQ';
        else this.status = 'ownerA';
      } else if (this.quickbuy) this.status = 'buy';
      else this.status = 'bid';
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>
