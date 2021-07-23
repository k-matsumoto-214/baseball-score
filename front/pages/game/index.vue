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
      <v-list three-line>
        <template v-for="(game, idx) in games">
          <v-list-item
            :key="game.id"
            :to="`/game/${game.id}`"
          >
            <v-list-item-content>
              <v-list-item-title>VS {{ game.opponentTeam }}</v-list-item-title>
              <v-list-item-subtitle>{{ game.date }}</v-list-item-subtitle>
              <v-list-item-subtitle>{{ game.field }}</v-list-item-subtitle>
            </v-list-item-content>
            <div class="ml-6 d-flex">
              <p
                v-if="game.result !== null"
                class="text-h6 text-center"
                style="width: 5rem;"
              >
                {{ game.topScore }} - {{ game.bottomScore }}
              </p>
              <p
                v-if="game.result !== null"
                class="text-h6 text-left"
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
      v-model="dialog"
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
          :error-messages="nameErrors"
          :counter="100"
          outlined
          label="対戦相手"
          required
          @input="$v.game.opponentTeam.$touch()"
          @blur="$v.game.opponentTeam.$touch()"
        ></v-text-field>
        <v-text-field
          v-model="player.position"
          :error-messages="positionErrors"
          :counter="100"
          outlined
          label="ポジション"
          required
          @input="$v.player.position.$touch()"
          @blur="$v.player.position.$touch()"
        ></v-text-field>
        <v-text-field
          v-model="player.number"
          :error-messages="numberErrors"
          outlined
          label="背番号"
          required
          @input="$v.player.number.$touch()"
          @blur="$v.player.number.$touch()"
        ></v-text-field>
        <v-text-field
          v-model="player.comment"
          :error-messages="commentErrors"
          :counter="200"
          outlined
          label="コメント"
          required
          @input="$v.player.comment.$touch()"
          @blur="$v.player.comment.$touch()"
        ></v-text-field>
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
  </v-container>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, maxLength, numeric } from 'vuelidate/lib/validators'
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
        topFlg: null
      }
    }
  },
  created() {
    if (this.$route.query.isDeleted) {
      this.isDeleted = true
    }
  },
  mounted() {
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
    }
  },
}
</script>