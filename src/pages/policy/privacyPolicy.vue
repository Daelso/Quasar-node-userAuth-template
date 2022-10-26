<template>
  <q-page class="flex flex-center"> Activating your account... </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "accountActivation",
  setup() {
    const $q = useQuasar();
    const axios = require("axios");
    const router = useRouter();
    let baseUrl = "";
    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }
  },
});
</script>
