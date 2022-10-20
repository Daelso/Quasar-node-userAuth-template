<template>
  <div class="q-pa-md" style="max-width: 400px">
    <q-btn
      label="View User"
      v-on:click="onSubmit()"
      type="submit"
      color="primary"
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

    return {
      onSubmit() {
        axios
          .get("http://localhost:5000/posts", {
            withCredentials: true,
          })
          .then((resp) => {
            console.log(resp.data);
          });
      },
    };
  },
};
</script>
