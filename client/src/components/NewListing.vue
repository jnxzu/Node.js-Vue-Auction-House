<template>
  <form v-on:submit="listItem">
    <div class="input-group">
      <label for="item">item:</label>
      <br />
      <input
        type="text"
        name="item"
        id="item"
        placeholder="Item"
        v-on:click="reset()"
      />
    </div>
    <div class="input-group">
      <label for="price">price:</label>
      <br />
      <input
        type="number"
        min="1"
        name="price"
        id="price"
        v-on:click="reset()"
      />
    </div>
    <div class="input-group">
      <label for="quickbuy" id="quickbuy-label">quickbuy?:</label>
      <input type="checkbox" name="quickbuy" id="quickbuy" value="quickbuy" />
    </div>
    <div class="input-group">
      <input id="submit" type="submit" value="List" />
    </div>
  </form>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  name: "NewListing",
  data() {
    return {
      timeNow: new Date(),
    };
  },
  props: {
    isSignup: Boolean,
  },
  methods: {
    reset: () => {
      document.getElementById("item").style.border = "none";
      document.getElementById("price").style.border = "none";
    },
    listItem: (e) => {
      e.preventDefault();
      const auction = {
        item: e.target[0].value,
        price: e.target[1].value,
        quickbuy: e.target[3].checked,
        expiry: moment().add(30, "minutes"),
      };
      axios
        .post("/list", auction)
        .then((resp) => {
          if (resp.data.success) window.location = "/";
          else {
            e.target[0].style.border = "1px solid red";
            e.target[1].style.border = "1px solid red";
          }
        })
        .catch(() => {
          e.target[0].style.border = "1px solid red";
          e.target[1].style.border = "1px solid red";
        });
    },
  },
};
</script>
