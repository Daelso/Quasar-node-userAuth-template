<template>
  <div class="q-pa-md" style="max-width: 400px">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-input
        filled
        v-model="email"
        type="email"
        label="Your email *"
        lazy-rules
        :rules="[
          (val) =>
            (val && val.length > 6 && val.length <= 64) ||
            'Please enter a valid email address.',
          (val) =>
            (val &&
              val.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) ||
            'Please enter a valid email address.',
        ]"
      />

      <q-input
        filled
        v-model="password"
        type="password"
        label="Your password *"
      />

      <div>
        <q-btn label="Submit" type="submit" color="primary" />
        <q-btn
          label="Reset"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
    </q-form>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";

export default {
  setup() {
    const $q = useQuasar();
    const axios = require("axios");
    const email = ref(null);
    const password = ref(null);

    return {
      email,
      password,

      onSubmit() {
        let loginInfo = {
          email: email.value,
          password: password.value,
        };
        axios
          .post("http://localhost:5000/user/login", loginInfo, {
            withCredentials: true,
          })
          .then(() =>
            $q.notify({
              color: "green-4",
              textColor: "white",
              icon: "cloud_done",
              message: "Account successfully created!",
            })
          )
          .catch(() =>
            $q.notify({
              color: "red-5",
              textColor: "white",
              icon: "warning",
              message: "Email or username already taken!",
            })
          );
      },
    };
  },
};
</script>
