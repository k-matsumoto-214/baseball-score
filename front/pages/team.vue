<template>
  <v-container>
    <v-card
      class="mx-auto fill-width pt-7"
      max-width="640"
      flat
    >
      <v-card-text class="pb-0">
        Team
      </v-card-text>
      <div v-if="!isEdit">
        <v-img
          :src="team.image ? team.image : 'noimage-team.jpg'"
        ></v-img>
        <v-card-title>
          {{ team.name}}
        </v-card-title>
        <v-card-subtitle>
          {{ team.comment}}
        </v-card-subtitle>
      </div>
      <div v-else>
        <v-img v-if="team.image" :src="team.image"></v-img>
        <v-file-input
          label="クリックして画像を変更"
          accept="image/*"
          prepend-icon="mdi-image"
          v-model="inputImage"
          @change="pushImage"
        ></v-file-input>
        <v-text-field
          v-model="team.name"
          :error-messages="nameErrors"
          :counter="100"
          outlined
          label="チーム名"
          required
          @input="$v.team.name.$touch()"
          @blur="$v.team.name.$touch()"
        ></v-text-field>
        <v-text-field
          v-model="team.comment"
          :error-messages="commentErrors"
          :counter="200"
          outlined
          label="コメント"
          required
          @input="$v.team.comment.$touch()"
          @blur="$v.team.comment.$touch()"
        ></v-text-field>
      </div>
    </v-card>
    <v-row justify="center">
      <v-btn
        v-if="!isEdit"
        class="mt-4 mb-2"
        color="primary"
        @click="isEdit = true"
      >
        編集
      </v-btn>
      <div v-else>
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
      </div>
    </v-row>
    <v-snackbar
      v-model="isSuccess"
      :timeout=2000
      color="blue accent-2"
    >
      {{ successMessage }}
      <template>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, maxLength } from 'vuelidate/lib/validators'
import TeamApi from '@/plugins/axios/modules/team'

export default {
  layout: 'loggedIn',
  mixins: [validationMixin],
  validations: {
    team: {
      name: { required, maxLength: maxLength(100) },
      comment: { maxLength: maxLength(200) }
    }
  },
  data() {
    return {
      team: {
        name: null,
        comment: null,
        image: null
      },
      isEdit: false,
      inputImage: null,
      isSuccess: false,
      successMessage: null
    }
  },
  created() {
    this.fetchTeam()
  },
  computed: {
    nameErrors () {
      const errors = []
      if (!this.$v.team.name.$dirty) return errors
      !this.$v.team.name.required && errors.push('チーム名は必須です。')
      !this.$v.team.name.maxLength && errors.push('チーム名は100文字以内です。')
      return errors
    },
    commentErrors () {
      const errors = []
      if (!this.$v.team.comment.$dirty) return errors
      !this.$v.team.comment.maxLength && errors.push('コメントは200文字以内です。')
      return errors
    }
  },
  methods: {
    save() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        return
      }
      TeamApi.updateTeam(this.team)
      .then(() => {
        this.fetchTeam()
        this.isEdit = false
        this.isSuccess = true
        this.successMessage = 'チーム情報を更新しました。'
      })
      .catch((error) => console.log(error))
    },
    cancel() {
      this.fetchTeam()
      this.isEdit = false
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
    pushImage(image) {
      if (image !== undefined && image !== null) {
        if (image.name.lastIndexOf('.') <= 0) {
          return
        }
        const fr = new FileReader()
        fr.readAsDataURL(image)
        fr.addEventListener('load', () => {
          this.team.image = fr.result
        })
      } else {
        this.team.image = null
      }
    }
  }
}
</script>