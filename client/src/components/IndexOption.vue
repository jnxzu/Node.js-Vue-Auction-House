<template>
  <div class="index-option" v-on:click="myRedirect()">
    <h3>{{Option}}</h3>
  </div>
</template>

<script>
export default {
  name: "IndexOption",
  props: {
    Option: String,
    Dest: String
  },
  methods: {
    myRedirect: function() {
      console.log("test");
      window.location.href = this.$props.Dest;
    }
  }
};
</script>