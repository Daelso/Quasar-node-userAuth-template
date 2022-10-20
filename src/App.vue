<template>
  <router-view />
</template>

<script>
import { defineComponent } from "vue";
import axios from "axios";

let baseUrl = "";
if (window.location.href.includes("localhost")) {
  baseUrl = "http://localhost:5000";
} else {
  baseUrl = window.location.origin;
}

//Generates a new access token on every page from existing refresh token
axios.post(
  baseUrl + "/user/token",
  {},
  {
    withCredentials: true,
  }
);

export default defineComponent({
  name: "App",
});
</script>
