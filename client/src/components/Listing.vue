<template>
  <div class="listing">
    <div class="listing-group">
      <div class="listing-group-top">listed by:</div>
      <div class="listing-group-bot">{{ host }}</div>
    </div>
    <div class="listing-group">
      <div class="listing-group-top">item:</div>
      <div class="listing-group-bot">{{ item }}</div>
    </div>
    <div class="listing-group">
      <div class="listing-group-top" v-if="quickbuy || expired">price:</div>
      <div class="listing-group-top" v-else>current price:</div>
      <div class="listing-group-bot">{{ price }}</div>
    </div>
    <div class="listing-group">
      <div class="listing-group-top" v-if="!finished">top bidder:</div>
      <div class="listing-group-top" v-else>bought by:</div>
      <div class="listing-group-bot" v-if="topBid">{{ topBid }}</div>
      <div class="listing-group-bot cursive" v-else>nobody</div>
    </div>
    <div class="listing-group">
      <div class="listing-group-top" v-if="!finished">expires:</div>
      <div class="listing-group-top" v-else>expired:</div>
      <div class="listing-group-bot">{{ timeFrom }}</div>
    </div>

    <div class="listing-group-action sold" v-if="finished && host===currentUser && topBid">SOLD</div>
    <div class="listing-group-action bought" v-else-if="finished && topBid===currentUser">BOUGHT</div>
    <div class="listing-group-action ended" v-else-if="finished && host===currentUser">EXPIRED</div>
    <div class="listing-group-action owner" v-else-if="!finished && host===currentUser">OWNER</div>
    <div
      class="listing-group-action buy"
      v-else-if="quickbuy && !finished && host!==currentUser"
      v-on:click="bidOrBuy()"
    >BUY</div>
    <div
      class="listing-group-action bid"
      v-else-if="!quickbuy && !finished && host!==currentUser"
      v-on:click="bidOrBuy()"
    >BID</div>
  </div>
</template>

<script>
import moment from "moment";
import axios from "axios";

export default {
  name: "IndexOption",
  props: {
    host: String,
    item: String,
    price: Number,
    expiry: String,
    quickbuy: Boolean,
    currentUser: String,
    topBid: String
  },
  data() {
    return {
      timeFrom: moment(this.$props.expiry).fromNow(),
      finished: moment(this.$props.expiry).isBefore(moment())
    };
  },
  methods: {
    bidOrBuy: function() {
      axios.post("/auth").then(resp => {
        if (resp.data.authenticated) {
          let data = {
            item: this.$props.item,
            quickbuy: this.$props.quickbuy
          };
          axios.post("/bid", data);
        } else window.location = "/signup";
      });
    }
  },
  created() {
    setInterval(() => {
      this.finished = moment(this.$props.expiry).isBefore(moment());
      this.timeFrom = moment(this.$props.expiry).fromNow();
    }, 1000 * 30);
  },
  destroyed() {
    clearInterval();
  }
};
</script>

