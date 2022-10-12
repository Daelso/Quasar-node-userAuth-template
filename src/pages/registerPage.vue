<template>
  <q-page class="flex flex-center">
    <registerForm />
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import registerForm from '../components/registerForm.vue'

export default defineComponent({
  name: 'registerPage',
  components: {registerForm}
})
</script>
