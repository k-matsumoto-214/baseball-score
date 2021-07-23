<template>
  <v-container>
    <v-card
      class="mx-auto fill-width pt-7"
      max-width="640"
      flat
    >
      <v-card-text>
        Game
      </v-card-text>
      <v-card-title>
        VS {{ game.opponentTeam }}
      </v-card-title>
      <v-card-subtitle>
        日付:　{{ game.date }} <br>
        場所:　{{ game.field }}
      </v-card-subtitle>
      <div v-if="game.lineupingFlg">
        <v-card-text>
          <p>スタメンを登録してください</p>
        </v-card-text>
      </div>
      <v-row justify="center">
        <v-col cols="6">
          <p>選手一覧</p>
          <draggable v-model="players" draggable=".drag" group="order" style="padding:5px">
            <div v-for="player in players" :key="player.id" class="drag">{{ player.name }}</div>
          </draggable>
        </v-col>
        <v-col cols="6">         
          <p>スタメン</p>
          <v-row justify="center">
            <v-col cols="2">
              <div style="padding:5px">
                <span v-for="(order, idx) in orders" :key="idx" style="display: block;">{{ idx + 1 }}</span>
              </div>
            </v-col>
            <v-col cols="10">
              <draggable v-model="orders" draggable=".drag" group="order" style="padding:5px">
                <div v-for="(order, idx) in orders" :key="idx" class="drag">{{ order.name }}</div>
                <span v-if="orders.length === 0">ここにドラッグ</span>
              </draggable>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import GameApi from '@/plugins/axios/modules/game'
import PlayerApi from '@/plugins/axios/modules/player'
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  layout: 'loggedIn',
  data() {
    return {
      game: {
        id: null,
        teamId: null,
        opponentTeam : null,
        topScore: null,
        bottomScore: null,
        date: null,
        field: null,
        winFlg: null,
        topFlg: null,
        resultFlg: false,
        lineupingFlg: false
      },
      numbers:[ 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
      players: [],
      orders: [],
      fields: [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
      isDeleted: false
    }
  },
  created() {
    this.game.id = Number(this.$route.params.gameId)
    this.fetchGame()
    this.fetchPlayers()
  },
  methods: {
    save() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        return
      }
      // PlayerApi.updatePlayer(this.player)
      // .then(() => {
      //   this.fetchPlayer()
      //   this.isEdit = false
      //   this.isSuccess = true
      //   this.successMessage = '選手情報を更新しました。'
      // })
      // .catch((error) => console.log(error))
    },
    fetchGame() {
      GameApi.getGame(this.game.id)
      .then((res) => {
        this.game = res
      })
      .catch((error) => {
        console.log(error)
      })
    },
    fetchPlayers() {
      PlayerApi.getPlayers()
      .then((res) => {
        this.players = res
      })
      .catch((error) => {
        console.log(error)
      })
    },
    deleteGame() {
      GameApi.deleteGame(this.player.id)
      .then(() => {
        this.$router.push({ path: '/game' , query : { isDeleted: true } })
      })
      .catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>