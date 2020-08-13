<template>
  <form v-on:submit="signup" v-if="isSignup">
    <div class="input-group">
      <label for="username">username:</label>
      <br />
      <input type="text" name="username" id="username" placeholder="User" v-on:click="reset()" />
    </div>
    <div class="input-group">
      <label for="password">password:</label>
      <br />
      <input
        type="password"
        name="password"
        id="password"
        placeholder="Password"
        v-on:click="reset()"
      />
    </div>
    <div class="input-group">
      <input id="submit" type="submit" value="Signup" />
    </div>
  </form>
  <form v-on:submit="login" v-else>
    <div class="input-group">
      <label for="username">username:</label>
      <br />
      <input type="text" name="username" id="username" placeholder="User" v-on:click="reset()" />
    </div>
    <div class="input-group">
      <label for="password">password:</label>
      <br />
      <input
        type="password"
        name="password"
        id="password"
        placeholder="Password"
        v-on:click="reset()"
      />
    </div>
    <div class="input-group">
      <input id="submit" type="submit" value="Login" />
    </div>
  </form>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AuthForm',
  props: {
    isSignup: Boolean,
  },
  methods: {
    reset: () => {
      document.getElementById('username').style.border = 'none';
      document.getElementById('password').style.border = 'none';
    },
    login: (e) => {
      e.preventDefault();
      const login = () => {
        const data = {
          username: e.target[0].value,
          password: e.target[1].value,
        };
        axios
          .post('/login', data)
          .then(() => {
            axios.post('/auth').then((response) => {
              if (response.data.authenticated) window.location = '/';
              else {
                e.target[0].style.border = '1px solid red';
                e.target[1].style.border = '1px solid red';
              }
            });
          })
          .catch(() => {
            e.target[0].style.border = '1px solid red';
            e.target[1].style.border = '1px solid red';
          });
      };
      login();
    },
    signup: (e) => {
      e.preventDefault();
      const signup = () => {
        const data = {
          username: e.target[0].value,
          password: e.target[1].value,
        };
        axios
          .post('/signup', data)
          .then(() => {
            axios.post('/auth').then((response) => {
              if (response.data.authenticated) window.location = '/';
              else {
                e.target[0].style.border = '1px solid red';
                e.target[1].style.border = '1px solid red';
              }
            });
          })
          .catch(() => {
            e.target[0].style.border = '1px solid red';
            e.target[1].style.border = '1px solid red';
          });
      };
      signup();
    },
  },
};
</script>
