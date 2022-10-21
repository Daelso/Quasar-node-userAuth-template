<template>
  <div class="q-pa-md" style="max-width: 400px">
    <q-btn
      label="View Current User"
      v-on:click="onSubmit()"
      type="submit"
      color="primary"
    />
    <q-btn
      label="Send Test Email"
      v-on:click="sendEmail()"
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

    let baseUrl = "";
    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }

    return {
      onSubmit() {
        axios
          .get(baseUrl + "/posts", {
            withCredentials: true,
          })
          .then((resp) => {
            console.log(resp.data);
          });
      },

      sendEmail() {
        axios
          .post(
            baseUrl + "/user/passwordReset",
            { email: "chasemurtaugh@gmail.com" },
            {
              withCredentials: true,
            }
          )
          .then(() =>
            $q.notify({
              color: "green-4",
              textColor: "white",
              icon: "cloud_done",
              message: "Email sent!",
            })
          )
          .catch(() =>
            $q.notify({
              color: "red-5",
              textColor: "white",
              icon: "warning",
              message: "Email failed to send!",
            })
          );
      },
    };
  },
};
</script>
