<template>
  <v-container>
      <v-card-text>
        選手一覧
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" block @click="token()">ボタン</v-btn>
      </v-card-actions>
      <v-card-actions>
        <v-btn color="primary" block @click="getPlayers()">選手リスト取得</v-btn>
      </v-card-actions>
      <v-card-actions>
        <v-btn color="primary" block @click="getPlayer(2)">選手ID2取得</v-btn>
      </v-card-actions>
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