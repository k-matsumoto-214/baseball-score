<template>
  <v-container>
    <v-card
      class="mx-auto fill-width pt-10"
      flat
      max-width="640"
    >
      <v-card-actions>
        <v-btn color="primary" block @click="$router.push('/team')">Team</v-btn>
      </v-card-actions>
      <v-card-actions>
        <v-btn color="primary" block @click="$router.push('/game')">Game</v-btn>
      </v-card-actions>
      <v-card-actions>
        <v-btn color="primary" block @click="$router.push('/player')">Player</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import PlayerApi from '@/plugins/axios/modules/player'
export default {
  layout: 'loggedIn',
  methods: {
    token() {
      this.$auth.logout();
    },
    getPlayers() {
      PlayerApi.getPlayers().then((res) => {
        console.log(res)
      }).catch((error) => {
        console.log(error)
      })
    },
    getPlayer(id) {
      PlayerApi.getPlayer(id).then((res) => {
        console.log(res)
      }).catch((error) => {
         console.log(error)
      })
    }
  }
}
</script>