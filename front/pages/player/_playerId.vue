<template>
  <v-container>
    <div v-if="!player.deleteFlg">
      <v-card
        class="mx-auto fill-width pt-7"
        max-width="640"
        flat
      >
        <v-card-text>
          Player
        </v-card-text>
        <div v-if="!isEdit">
          <v-img
            :src="player.image !== null ? player.image : '../noimage.png'"
          ></v-img>
          <v-card-title>
            {{ player.name }}
          </v-card-title>
          <v-card-subtitle>
            ポジション:　{{ player.position }} <br>
            背番号:　{{ player.number }} <br>
            コメント:　{{ player.comment }}
          </v-card-subtitle>
        </div>
        <div v-else>
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
        </div>
        <v-row v-if="!isEdit" justify="center">
          <v-btn
            class="mr-4 mt-4 mb-2"
            color="primary"
            @click="isEdit = true"
          >
            編集
          </v-btn>
          <v-btn
            class="mt-4 mb-2"
            @click="$router.push('/player')"
          >
            一覧へ
          </v-btn>
        </v-row>
        <v-row v-else justify="center">
          <v-btn
            class="mr-4 mt-4 mb-2"
            color="primary"
            @click="save()"
          >
            更新
          </v-btn>
          <v-btn
            class="mt-4 mb-2"
            @click="cancel()"
          >
            戻る
          </v-btn>
        </v-row>
        <v-dialog v-if="isEdit" v-model="isOpenDeleteModal" max-width="640">
          <template v-slot:activator="{ on, attrs }">
            <p 
              class="text-caption text-right"
              style="margin-top: -30px; color: #F06292;"
              @click="isOpenDeleteModal = true"
              v-bind="attrs"
              v-on="on"
            >
              削除
            </p>
          </template>
          <v-card class="px-6 py-8">
            <v-card-text>「{{ player.name }}」を削除します。一度削除した選手は復元できません。<br>本当に削除しますか？</v-card-text>
            <v-row justify="center">
              <v-btn color="pink lighten-2" @click="deletePlayer()" class="mr-4 mt-4 white--text">削除</v-btn>
              <v-btn @click="isOpenDeleteModal = false" class="mt-4">戻る</v-btn>
            </v-row>
          </v-card>
        </v-dialog>
      </v-card>
      <v-snackbar
        v-model="isSuccess"
        :timeout=1000
        color="blue accent-2"
      >
        {{ successMessage }}
        <template>
        </template>
      </v-snackbar>
    </div>
    <div v-else>
      <v-card
        class="mx-auto fill-width pt-7"
        max-width="640"
        flat
      >
        <v-card-text>
          Player
        </v-card-text>
        <div class="text-center mt-5">
          <p> 削除されている選手です。</p>
        </div>
      </v-card>
    </div>
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
        id: null,
        name: null,
        number: null,
        position: null,
        image: null,
        comment: null
      },
      isEdit: false,
      inputImage: null,
      isSuccess: false,
      successMessage: null,
      isOpenDeleteModal: false
    }
  },
  created() {
    this.player.id = Number(this.$route.params.playerId)
    this.fetchPlayer()
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
      PlayerApi.updatePlayer(this.player)
      .then(() => {
        this.fetchPlayer()
        this.isEdit = false
        this.isSuccess = true
        this.successMessage = '選手情報を更新しました。'
      })
      .catch((error) => console.log(error))
    },
    cancel() {
      this.fetchPlayer()
      this.isEdit = false
    },
    fetchPlayer() {
      PlayerApi.getPlayer(this.player.id)
      .then((res) => {
        this.player = res
      })
      .catch((error) => {
        console.log(error)
      })
    },
    deletePlayer() {
      PlayerApi.deletePlayer(this.player.id)
      .then(() => {
        this.$router.push({ path: '/player' , query : { isDeleted: true } })
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