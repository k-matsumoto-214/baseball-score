<template>
  <v-container>
    <v-card
      class="mx-auto fill-width pt-7"
      max-width="640"
      flat
    >
      <v-card-text class="pb-0">
        Game
      </v-card-text>
      <v-list three-line>
        <template v-for="(game, idx) in games">
          <v-list-item
            :key="game.id"
            :to="`/game/${game.id}`"
          >
            <v-list-item-content>
              <v-list-item-title>VS {{ game.opponentTeam }}</v-list-item-title>
              <v-list-item-subtitle>日付: {{ game.date }}</v-list-item-subtitle>
              <v-list-item-subtitle>場所: {{ game.field }}</v-list-item-subtitle>
            </v-list-item-content>
            <div class="ml-6 d-flex">
              <p
                v-if="game.resultFlg"
                class="text-h6 text-right mr-3"
                style="width: 5rem;"
              >
                {{ game.topScore }} - {{ game.bottomScore }}
              </p>
              <p
                v-if="game.resultFlg"
                class="text-h6 text-right"
                :style="styleResult(game.result)"
                style="width: 3rem; font-weight: normal;"
              >
                {{ formatResult(game.result) }}
              </p>
            </div>
          </v-list-item>
          <v-divider
            v-if="idx !== (games.length - 1)"
            :key="`second-${idx}`"
          >
          </v-divider>
        </template>
      </v-list>
    </v-card>
    <v-dialog
      v-model="isOpenAddModal"
      max-width="640"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-row justify="center">
          <v-btn
            color="primary"
            dark
            v-bind="attrs"
            v-on="on"
            class="mt-4 mb-2"
          >
            追加
          </v-btn>
        </v-row>
      </template>
      <v-card class="px-6 py-8">
        <v-text-field
          v-model="game.opponentTeam"
          :error-messages="opponentTeamErrors"
          :counter="100"
          outlined
          label="対戦相手"
          required
          @input="$v.game.opponentTeam.$touch()"
          @blur="$v.game.opponentTeam.$touch()"
        ></v-text-field>
        <v-menu
          v-model="isOpenDateModal"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="game.date"
              label="日付"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              :error-messages="dateErrors"
              @input="$v.game.date.$touch()"
              @blur="$v.game.date.$touch()"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="game.date"
            @input="isOpenDateModal = false"
            no-title
            scrollable
            locale="jp-ja"
            :day-format="date => new Date(date).getDate()"
          ></v-date-picker>
        </v-menu>
        <v-radio-group
          v-model="game.topFlg"
          row
        >
          <v-radio
            label='先攻'
            :value="true"
            @change="game.topFlg = true"
          ></v-radio>
          <v-radio
            label='後攻'
            :value="false"
            @change="game.topFlg = false"
          ></v-radio>
        </v-radio-group>
        <v-row justify="center">
          <v-btn
            class="mr-4 mt-4 mb-2"
            color="primary"
            @click="save()"
          >
            追加
          </v-btn>
          <v-btn
            class="mt-4 mb-2"
            @click="cancel()"
          >
            戻る
          </v-btn>
        </v-row>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="isDeleted"
      :timeout=2000
      color="blue accent-2"
    >
      試合を削除しました。
      <template>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, maxLength } from 'vuelidate/lib/validators'
import GameApi from '@/plugins/axios/modules/game'

export default {
  layout: 'loggedIn',
  mixins: [validationMixin],
  validations: {
    game: {
      opponentTeam: { required, maxLength: maxLength(100) },
      date: { required }
    }
  },
  data() {
    return {
      games: [],
      game: {
        id: null,
        teamId: null,
        opponentTeam : null,
        topScore: null,
        bottomScore: null,
        date: null,
        field: null,
        winFlg: null,
        topFlg: true,
        resultFlg: false,
        lineupingFLg: false,
        topLineup: [],
        bottomLineup: []
      },
      defaultLineup: [
        { 'orderNumber': 1,
          'orderDetails': [
            {
            'fieldNumber': 1,
            'playerId': 1000
            }
          ]
        },
        { 'orderNumber': 2,
          'orderDetails': [
            {
            'fieldNumber': 2,
            'playerId': 1001
            }
          ]
        },
        { 'orderNumber': 3,
          'orderDetails': [
            {
            'fieldNumber': 3,
            'playerId': 1002
            }
          ]
        },
        { 'orderNumber': 4,
          'orderDetails': [
            {
            'fieldNumber': 4,
            'playerId': 1003
            }
          ]
        },
        { 'orderNumber': 5,
          'orderDetails': [
            {
            'fieldNumber': 5,
            'playerId': 1004
            }
          ]
        },
        { 'orderNumber': 6,
          'orderDetails': [
            {
            'fieldNumber': 6,
            'playerId': 1005
            }
          ]
        },
        { 'orderNumber': 7,
          'orderDetails': [
            {
            'fieldNumber': 7,
            'playerId': 1006
            }
          ]
        },
        { 'orderNumber': 8,
          'orderDetails': [
            {
            'fieldNumber': 8,
            'playerId': 1007
            }
          ]
        },
        { 'orderNumber': 9,
          'orderDetails': [
            {
            'fieldNumber': 9,
            'playerId': 1008
            }
          ]
        }
      ],
      isOpenAddModal: false,
      isOpenDateModal: false,
      isDeleted: false
    }
  },
  computed: {
    opponentTeamErrors () {
      const errors = []
      if (!this.$v.game.opponentTeam.$dirty) return errors
      !this.$v.game.opponentTeam.required && errors.push('対戦相手は必須です。')
      !this.$v.game.opponentTeam.maxLength && errors.push('対戦相手は100文字以内です。')
      return errors
    },
    dateErrors () {
      const errors = []
      if (!this.$v.game.date.$dirty) return errors
      !this.$v.game.date.required && errors.push('日付は必須です。')
      return errors
    }
  },
  created() {
    if (this.$route.query.isDeleted) {
      this.isDeleted = true
    }
    this.fetchGames()
  },
  methods: {
    fetchGames() {
      GameApi.getGames()
      .then((res) => {
        this.games = res
      })
      .catch((error) => {
        console.log(error)
      })
    },
    formatResult(result) {
      if (result === 0) {
        return 'Win'
      } else if (result === 1) {
        return 'Lose'
      } else {
        return 'Draw'
      }
    },
    styleResult(result) {
      if (result === 0) {
        return 'color: #D81B60'
      } else if (result === 1) {
        return 'color: #0D47A1'
      } else {
        return 'color: #C0CA33'
      }
    },
    save() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        return
      }
      if(this.game.topFlg) {
        this.game.bottomLineup = this.defaultLineup
      } else {
        this.game.topLineup = this.defaultLineup
      }
      GameApi.registerGame(this.game)
      .then((res) => {
        this.$router.push(`/game/${res.id}`)
      })
      .catch((error) => {
        console.log(error)
      })
    },
    cancel() {
      this.isOpenAddModal = false
    }
  },
}
</script>