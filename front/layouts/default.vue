<template>
  <v-app id="app">
    <nuxt />
  </v-app>
</template>

<script>
export default {
  middleware({ store, redirect }) {
    if(store.$auth.loggedIn) {
      redirect('/');
    }
  }
}
</script>