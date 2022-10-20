<template>
  <router-view />
</template>

<script>
import { defineComponent } from "vue";
import axios from "axios";

//Generates a new access token on every page from existing refresh token
console.log(window.location.origin);
let baseUrl = window.location.origin;
axios.post(
  baseUrl + "/user/token",
  {},
  {
    withCredentials: true,
  }
);

axios.get(baseUrl + "posts", {
  withCredentials: true,
});

export default defineComponent({
  name: "App",
});
</script>
