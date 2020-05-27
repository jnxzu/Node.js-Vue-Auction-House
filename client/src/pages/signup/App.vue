<template>
  <div id="app">
    <div id="center-container">
      <div id="center">
        <AuthForm isSignup />
      </div>
    </div>
  </div>
</template>

<script>
import AuthForm from "@/components/AuthForm.vue";

export default {
  name: "Login",
  components: {
    AuthForm
  }
};
</script>

<style lang="scss" src="@/style/global.scss"></style>
<style lang="scss" src="@/style/auth.scss"></style>
