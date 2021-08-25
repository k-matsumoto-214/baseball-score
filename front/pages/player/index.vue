<template>
  <v-container>
    <v-card
      class="mx-auto fill-width pt-7"
      max-width="640"
      flat
    >
      <v-card-text class="pb-0">
        Player
      </v-card-text>
      <v-list three-line>
        <template v-for="(player, idx) in players">
          <v-list-item
            v-if="!player.deleteFlg"
            :key="player.id"
            :to="`/player/${player.id}`"
          >
            <v-list-item-avatar>
              <v-img :src="player.image ? player.image : 'noimage.png'"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ player.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ player.position }}</v-list-item-subtitle>
            </v-list-item-content>
            <p class="text-subtitle-1">{{ player.number }}</p>
          </v-list-item>
          <v-divider
            v-if="idx !== (players.length - 1)"
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
        <v-img v-if="player.image" :src="player.image"></v-img>
        <v-file-input
          label="クリックして画像を変更"
          accept="image/*"
          prepend-icon="mdi-image"
          v-model="inputImage"
          @change="pushImage"
        ></v-file-input>
        <v-text-field
          v-model="player.name"
          :error-messages="nameErrors"
          :counter="100"
          outlined
          label="選手名"
          required
          @input="$v.player.name.$touch()"
          @blur="$v.player.name.$touch()"
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
    <v-snackbar
      v-model="isSuccess"
      :timeout=2000
      color="blue accent-2"
    >
      {{ successMessage }}
      <template>
      </template>
    </v-snackbar>
    <v-snackbar
      v-model="isDeleted"
      :timeout=2000
      color="blue accent-2"
    >
      選手を削除しました。
      <template>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, maxLength, numeric } from 'vuelidate/lib/validators'
import PlayerApi from '@/plugins/axios/modules/player'

export default {
  layout: 'loggedIn',
  mixins: [validationMixin],
  validations: {
    player: {
      name: { required, maxLength: maxLength(100) },
      comment: { maxLength: maxLength(200) },
      number: { numeric },
      position: { maxLength: maxLength(100) }
    }
  },
  data() {
    return {
      player: {
        name: null,
        number: null,
        position: null,
        image: null,
        comment: null
      },
      players: [],
      dialog: false,
      inputImage: null,
      isSuccess: false,
      successMessage: null,
      isDeleted: false
    }
  },
  created() {
    if (this.$route.query.isDeleted) {
      this.isDeleted = true
    }
    this.fetchPlayers()
  },
  computed: {
    nameErrors () {
      const errors = []
      if (!this.$v.player.name.$dirty) return errors
      !this.$v.player.name.required && errors.push('選手名は必須です。')
      !this.$v.player.name.maxLength && errors.push('選手名は100文字以内です。')
      return errors
    },
    commentErrors () {
      const errors = []
      if (!this.$v.player.comment.$dirty) return errors
      !this.$v.player.comment.maxLength && errors.push('コメントは200文字以内です。')
      return errors
    },
    numberErrors () {
      const errors = []
      if (!this.$v.player.number.$dirty) return errors
      !this.$v.player.number.numeric && errors.push('背番号は数字のみです。')
      return errors
    },
    positionErrors () {
      const errors = []
      if (!this.$v.player.position.$dirty) return errors
      !this.$v.player.position.maxLength && errors.push('ポジションは100文字以内です。')
      return errors
    },
  },
  methods: {
    save() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        return
      }
      PlayerApi.registerPlayer(this.player)
      .then(() => {
        this.fetchPlayers()
        this.dialog = false
        this.player = {}
        this.isSuccess = true
        this.successMessage = '選手を追加しました。'
      })
      .catch((error) => console.log(error))
    },
    cancel() {
      this.dialog = false
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
    pushImage(image) {
      if (image !== undefined && image !== null) {
        if (image.name.lastIndexOf('.') <= 0) {
          return
        }
        const fr = new FileReader()
        fr.readAsDataURL(image)
        fr.addEventListener('load', () => {
          this.player.image = fr.result
        })
      } else {
        this.player.image = null
      }
    }
  }
}
</script>