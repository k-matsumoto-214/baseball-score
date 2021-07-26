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
      <div v-if="game.lineupingStatus === 0">
        <v-card-text>
          <p class="text-subtitle-1">スタメンを登録してください</p>
        </v-card-text>
        <v-row justify="center">
          <v-col cols="5">
            <p>選手一覧</p>
            <draggable v-model="players" group="starters" :animation="300" :delay="50"
              style="padding:5px 0; height: 550px; overflow-y: scroll;"
            >
              <lineup-list
                v-for="player in players"
                :key="player.id"
                :player="player"
              />
            </draggable>
          </v-col>
          <v-col cols="7">         
            <p>スタメン</p>
            <v-row justify="center">
              <v-col cols="9">
                <draggable v-model="starters" group="starters" :animation="300" :delay="50" style="padding:5px 0">
                  <lineup-list
                    v-for="(starter,idx) in starters"
                    :key="starter.id"
                    :player="starter"
                    :number="idx + 1"
                  />
                  <p v-if="starters.length === 0" class="grey lighten-2 py-1 px-2 rounded-pill text-center">ここにドラッグ</p>
                </draggable>
              </v-col>
              <v-col cols="3">
                <draggable v-model="fields" :animation="300" :delay="50" style="padding:5px 0">
                  <field-list
                    v-for="(field,idx) in fields"
                    :key="idx"
                    :fieldNumber="field"
                  />
                </draggable>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <p class="text-center" style="color: #FF4081">{{ errorMessage }}</p>
        <v-row justify="center">
          <v-btn
            class="mr-4 mt-4 mb-2"
            color="primary"
            @click="saveStarters()"
          >
            確定
          </v-btn>
        </v-row>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import GameApi from '@/plugins/axios/modules/game'
import PlayerApi from '@/plugins/axios/modules/player'
import draggable from 'vuedraggable'
import lineupList from '@/components/lineupList.vue'
import fieldList from '@/components/fieldList.vue'

export default {
  components: {
    draggable,
    lineupList,
    fieldList
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
        lineupingStatus: null,
        topLineup: null,
        bottomLineup: null
      },
      players: [],
      starters: [],
      fields: [],
      defaultFields: [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
      errorMessage: '',
      isDeleted: false
    }
  },
  created() {
    this.game.id = Number(this.$route.params.gameId)
    this.fetchGame()
    this.fetchPlayers()
  },
  mounted() {
    this.addMobPlayers()
  },
 watch: {
    starters: function() {
      this.errorMessage = ''
      if (this.starters.length <= 9) {
        this.fields = this.defaultFields.filter((number) => number <= this.starters.length)
      } else {
        this.fields = [...this.defaultFields]
        for (let i = 0; i < (this.starters.length - 9); i++)
        this.fields.push(this.starters.length - i)
      }
    },
    players: function() {
      if (this.starters.length === 0) {
        this.addMobPlayers()
      }
    }
  },
  methods: {
    saveStarters() {
      this.errorMessage = ''
      if (this.starters.length < 9) {
        this.errorMessage = 'スタメンが9人未満です。'
        return
      }
      if (this.game.topFlg) {
        this.game.topLineup = this.createOrders()
      } else {
        this.game.bottomLineup = this.createOrders()
      }
      this.game.lineupingStatus = 2
      this.updateGame()
      location.reload()
    },
    createOrders() {
      let lineup = []
      for(let i = 1; i <= this.starters.length; i++) {
        lineup.push( 
          { 
            'orderNumber': i ,
            'orderDetail': {
              'fieldNumber': this.fields[(i - 1)],
              'playerId': this.starters[(i - 1)].id
            }
          }
        )
      }
      return lineup
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
    updateGame() {
      GameApi.updateGame(this.game)
      .then(() => {
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
    },
    addMobPlayers() {
      if(this.players.some(player => player.id === 1000)) return
      this.players.push(
        { 'id': 1000, 'name': 'mob1' },  { 'id': 1001, 'name': 'mob2'},  { 'id': 1002, 'name': 'mob3' },  
        { 'id': 1003, 'name': 'mob4' },  { 'id': 1004, 'name': 'mob5' }, { 'id': 1005, 'name': 'mob6' }, 
        { 'id': 1006, 'name': 'mob7' },  { 'id': 1007, 'name': 'mob8' }, { 'id': 1008, 'name': 'mob9' },
      )
    }
  }
}
</script>