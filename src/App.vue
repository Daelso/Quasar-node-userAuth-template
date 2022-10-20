<template>
  <router-view />
</template>

<script>
import { defineComponent } from "vue";
import axios from "axios";

//Generates a new access token on every page from existing refresh token
axios.post(
  "http://localhost:5000/user/token",
  {},
  {
    withCredentials: true,
  }
);

axios.get("http://localhost:5000/posts", {
  withCredentials: true,
});

export default defineComponent({
  name: "App",
});
</script>
