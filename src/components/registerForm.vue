<template>
  <div class="q-pa-md" style="max-width: 400px">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-input
        filled
        v-model="userName"
        label="Your username *"
        hint="What do we call you?"
        lazy-rules
        :rules="[
          (val) =>
            (val && val.length > 3 && val.length <= 15) ||
            'Please use between 3-15 characters.',
          (val) =>
            (val && val.match(/^[a-zA-Z0-9]+$/)) ||
            'No special characters allowed.',
        ]"
      />

      <q-input
        filled
        v-model="email"
        type="email"
        label="Your email *"
        hint="Make sure you will have long term access for account recovery!"
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
        hint="Never share this with anyone!"
        lazy-rules
        :rules="[
          (val) =>
            (val && val.length >= 8 && val.length <= 25) ||
            'We require between 8-25 characters.',
          (val) =>
            (val &&
              (val === this.passwordVerify || this.passwordVerify === null)) ||
            'Passwords do not match!',
        ]"
      />

      <q-input
        filled
        v-model="passwordVerify"
        type="password"
        label="Type password again *"
        hint="Just making sure..."
        lazy-rules
        :rules="[
          (val) =>
            (val && val.length >= 8 && val.length <= 25) ||
            'We require between 8-25 characters.',
          (val) =>
            (val && (val === this.password || this.password === null)) ||
            'Passwords do not match!',
        ]"
      />

      <q-input
        filled
        type="number"
        v-model="age"
        hint="Strictly 18+"
        label="Your age *"
        lazy-rules
        :rules="[
          (val) => (val !== null && val !== '') || 'Please type your age',
          (val) =>
            (val >= 18 && val < 100) ||
            'We accept users between the ages of 18-100',
        ]"
      />

      <q-toggle
        v-model="accept"
        label="I hereby certify that I am above the age of 18 and will obey site-wide rules or risk the loss of my account."
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
    const userName = ref(null);
    const email = ref(null);
    const password = ref(null);
    const passwordVerify = ref(null);
    const age = ref(null);
    const accept = ref(false);

    return {
      userName,
      email,
      password,
      passwordVerify,
      age,
      accept,

      onSubmit() {
        if (accept.value !== true) {
          $q.notify({
            color: "red-5",
            textColor: "white",
            icon: "warning",
            message:
              "You need to agree to the terms of account creation first!",
          });
        } else {
          $q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "Account successfully created!",
          });
          let registryInfo = {
            username: userName.value,
            age: age.value,
            email: email.value,
            password: password.value,
            acceptance: accept.value,
          };

          console.log(registryInfo);

          axios
            .post("https://localhost:3000/register", registryInfo)
            .then((response) => console.log(response));
        }
      },

      onReset() {
        userName.value = null;
        email.value = null;
        password.value = null;
        passwordVerify.value = null;
        age.value = null;
        accept.value = false;
      },
    };
  },
};
</script>
