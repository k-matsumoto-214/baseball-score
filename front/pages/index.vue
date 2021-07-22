<template>
  <v-container>
    <v-card>
      <v-card-title class="font-weight-bold">タイトル</v-card-title>
      <v-card-text>
        テキストテキストテキスト <br>
        テキストテキストテキスト
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
    </v-card>
  <v-card
    color="grey lighten-4"
    flat
    tile
  >
    <v-toolbar dense>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title>Title</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-toolbar>
  </v-card>
  </v-container>
</template>

<script>
import PlayerApi from '@/plugins/axios/modules/player'
export default {
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