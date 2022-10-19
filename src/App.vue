<template>
  <router-view />
</template>

<script>
import { defineComponent } from "vue";
import axios from "axios";

//Generates a new access token on every page from existing refresh token
axios.get("http://localhost:3000/user/token", {
  withCredentials: true,
});

axios.get("http://localhost:3000/posts", {
  withCredentials: true,
});

export default defineComponent({
  name: "App",
});
</script>
