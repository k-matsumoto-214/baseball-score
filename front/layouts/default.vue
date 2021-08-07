<template>
  <v-app id="app">
    <nuxt />
  </v-app>
</template>

<script>
export default {
  middleware({ store, redirect, $auth }) {
    if(store.$auth.loggedIn) {
      $auth.logout()
    }
  }
}
</script>