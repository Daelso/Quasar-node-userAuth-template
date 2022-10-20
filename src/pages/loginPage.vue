<template>
  <q-page class="flex flex-center">
    <LoginForm />
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import LoginForm from "src/components/loginForm.vue";

export default defineComponent({
  name: "loginPage",
  components: { LoginForm },
});
</script>
