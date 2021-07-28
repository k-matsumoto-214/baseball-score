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
      <div v-if="!game.resultFlg">
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
        <div v-else-if="game.lineupingStatus === 2">
          <v-row>
            <v-col cols="2" style="padding: 0px;">
              <v-simple-table class="grey lighten-3">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">
                        Team
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        {{ game.topFlg ? team.name : game.opponentTeam }}
                      </td>
                    </tr>
                    <tr>
                      <td style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        {{ !game.topFlg ? team.name : game.opponentTeam }}
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
            <v-col cols="9" style="padding: 0 1px;">
              <v-simple-table class="grey lighten-3">
                <template v-slot:default>
                  <thead>
                    <tr class="text-center">
                      <th class="inningHeader  ">1</th>
                      <th class="inningHeader  ">2</th>
                      <th class="inningHeader  ">3</th>
                      <th class="inningHeader  ">4</th>
                      <th class="inningHeader  ">5</th>
                      <th class="inningHeader  ">6</th>
                      <th class="inningHeader  ">7</th>
                    </tr>
                  </thead>
                  <tbody>
                  <tr class="text-center">
                    <td class="inning  " data-score="0">0</td>
                    <td class="inning  " data-score="0">0</td>
                    <td class="inning  " data-score="0">0</td>
                    <td class="inning  " data-score="1">1</td>
                    <td class="inning  " data-score="0">0</td>
                    <td class="inning  " data-score="0">0</td>
                    <td class="inning  " data-score="0">0</td>
                  </tr>
                  <tr class="home">
                    <td class="inning  " data-score="0">0</td>
                    <td class="inning  " data-score="0">0</td>
                    <td class="inning  " data-score="0">0</td>
                    <td class="inning  " data-score="0">0</td>
                    <td class="inning  " data-score="0">0</td>
                    <td class="inning  " data-score="1">1</td>
                    <td class="inning  " data-score="0">0</td>
                  </tr>
                </tbody>
                </template>
              </v-simple-table>
            </v-col>
            <v-col cols="1" style="padding: 0px;">
              <v-simple-table class="grey lighten-3">
                <template v-slot:default>
                  <thead>
                    <tr class="text-center">
                      <th class="inningHeader">R</th>
                      <th class="inningHeader">H</th>
                      <th class="inningHeader">E</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="text-center">
                      <td class="inning  " data-score="0">0</td>
                      <td class="inning  " data-score="0">0</td>
                      <td class="inning  " data-score="0">0</td>
                    </tr>
                    <tr class="home">
                      <td class="inning  " data-score="0">0</td>
                      <td class="inning  " data-score="0">0</td>
                      <td class="inning  " data-score="0">0</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
          </v-row>
          <div v-if="nowBatter !== null">
            <inning-info :atBat="atBat" />
            <v-row justify="center">
              <v-col cols="12">
                <pitcher-info
                  :nowPitcher="nowPitcher"
                />
                <batter-info 
                  :nowBatter="nowBatter"
                  class="mt-3"
                />
              </v-col>
            </v-row>
          </div>
          
        </div>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import GameApi from '@/plugins/axios/modules/game'
import PlayerApi from '@/plugins/axios/modules/player'
import TeamApi from '@/plugins/axios/modules/team'
import AtBatApi from '@/plugins/axios/modules/atBat'
import draggable from 'vuedraggable'
import lineupList from '@/components/lineupList.vue'
import fieldList from '@/components/fieldList.vue'
import batterInfo from '@/components/batterInfo.vue'
import pitcherInfo from '@/components/pitcherInfo.vue'
import inningInfo from '@/components/inningInfo.vue'

export default {
  components: {
    draggable,
    lineupList,
    fieldList,
    batterInfo,
    pitcherInfo,
    inningInfo
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
      team: {},
      players: [],
      starters: [],
      opponentTeamId: 1000,
      fields: [],
      defaultFields: [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
      atBats: [],
      atBat: {
        id: null,
        teamId: null,
        gameId: null,
        lineupNumber: null,
        batterId: null,
        pitcherId: null,
        inning: null,
        outCount: null,
        firstRunnerId: null,
        secondRunnerId: null,
        thirdRunnerId: null,
        playerChangeFlg: false,
        direction: null,
        completeFlg: false,
        comment: null,
        result: null,
        angle: null,
        lineupNumber: null,
        topFlg: false
      },
      nowBatter: null,
      nowPitcher: null,
      errorMessage: '',
      isDeleted: false,
      isStarted: true
    }
  },
  created() {
    this.game.id = Number(this.$route.params.gameId)
    this.fetchGame()
    PlayerApi.getPlayers(this.game.id)
    .then((res) => {
      this.players = res
      this.addMobPlayers()
      this.fetchAtBats()
    })
    this.fetchTeam()
  },
 watch: {
    players: function() {
      this.errorMessage = ''
      if (this.starters.length <= 9) {
        this.fields = this.defaultFields.filter((number) => number <= this.starters.length)
      } else {
        this.fields = [...this.defaultFields]
        for (let i = 0; i < (this.starters.length - 9); i++)
        this.fields.push(this.starters.length - i)
      }
    },
    atBats: function() {
      if (this.game.lineupingStatus === 0) {
        return
      }
      let nowAtBat = null
      let nowBatterId = null
      let nowPitcherId = null
      if (this.isStarted) {
        nowAtBat = this.atBats.slice(-1)[0]
        // バッター情報
        nowBatterId = nowAtBat.batterId
        this.nowBatter = this.players.filter((player) => player.id === nowBatterId)[0]
        this.nowBatter.lineupNumber = nowAtBat.lineupNumber

        // ピッチャー情報
        nowPitcherId = nowAtBat.pitcherId
        this.nowPitcher = this.players.filter((player) => player.id === nowPitcherId)[0]

      } else {
        // バッター情報
        nowBatterId = this.game.topLineup[0].orderDetails.slice(-1)[0].playerId
        this.nowBatter = this.players.filter((player) => player.id === nowBatterId)[0]
        this.nowBatter.lineupNumber = 1

        // ピッチャー情報
        nowPitcherId = this.game.bottomLineup.filter((lineup) => {
          return lineup.orderDetails.slice(-1)[0].fieldNumber === 1
        })[0].orderDetails.slice(-1)[0].playerId
        this.nowPitcher = this.players.filter((player) => player.id === nowPitcherId)[0]
      }
      this.atBat.batterId = this.nowBatter.id
      this.atBat.pitcherId = this.nowPitcher.id
      this.atBat.outCount = nowAtBat === null ? 0 : nowAtBat.outCount
      this.atBat.inning = nowAtBat === null ? 1 : nowAtBat.inning
      this.atBat.topFlg = nowAtBat === null ? 1 : nowAtBat.topFlg
      // 走者情報
      this.atBat.firstRunnerId = nowAtBat === null ? null : nowAtBat.firstRunnerId
      this.atBat.secondRunnerId = nowAtBat === null ? null : nowAtBat.secondRunnerId
      this.atBat.thirdRunnerId = nowAtBat === null ? null : nowAtBat.thirdRunnerId
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
      location.reload();
    },
    createOrders() {
      let lineup = []
      for(let i = 1; i <= this.starters.length; i++) {
        lineup.push( 
          { 
            'orderNumber': i ,
            'orderDetails': [
              {
                'fieldNumber': this.fields[(i - 1)],
                'playerId': this.starters[(i - 1)].id
              }
            ]
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
    fetchTeam() {
      TeamApi.getTeam()
      .then((res) => {
        this.team = res
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
      if (this.players.some(player => player.id === 1000) ) return
      this.players.push(
        { 'id': 1000, 'name': 'mob1', 'image': null },  { 'id': 1001, 'name': 'mob2', 'image': null},  { 'id': 1002, 'name': 'mob3', 'image': null},  
        { 'id': 1003, 'name': 'mob4', 'image': null },  { 'id': 1004, 'name': 'mob5', 'image': null }, { 'id': 1005, 'name': 'mob6', 'image': null }, 
        { 'id': 1006, 'name': 'mob7', 'image': null },  { 'id': 1007, 'name': 'mob8', 'image': null }, { 'id': 1008, 'name': 'mob9', 'image': null },
      )
    },
    fetchAtBats() {
      AtBatApi.getAtBatsByGameId(this.game.id)
      .then((res) => {
        this.atBats = res
      })
      .catch((error) => {
        if (error.status === 404) {
          this.isStarted = false
          this.atBats = []
        } else {
          console.log(error)
        }
      })
    }
  }
}
</script>