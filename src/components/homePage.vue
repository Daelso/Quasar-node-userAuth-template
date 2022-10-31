<template>
  <div class="q-pa-md" style="max-width: 400px">
    <q-btn
      label="View Current User"
      v-on:click="onSubmit()"
      type="submit"
      color="secondary"
      text-color="primary"
      style="font-weight: bold"
    />
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";

export default {
  setup() {
    const $q = useQuasar();
    const axios = require("axios");

    let baseUrl = "";
    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }

    return {
      async onSubmit() {
        let meme = await axios
          .get(baseUrl + "/user/currentUser", {
            withCredentials: true,
          })
          .then((resp) => {
            return resp.data;
          });
        console.log(meme);
      },
    };
  },
};
</script>
