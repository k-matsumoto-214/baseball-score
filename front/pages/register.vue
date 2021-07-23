<template>
<div>
  <v-card
      class="mx-auto fill-width"
      flat
      max-width="640"
  >
    <v-card-title class="text-center pa-8">
      <h4 class="fill-width">新規登録</h4>
    </v-card-title>
    <v-divider> </v-divider>
    <div class="px-6 py-8">
      <div style="max-width:344px" class="mx-auto">
        <v-text-field
          v-model="team.accountId"
          :error-messages="accountIdErrors"
          :counter="100"
          outlined
          label="アカウントID"
          required
          @input="$v.team.accountId.$touch()"
          @blur="$v.team.accountId.$touch()"
        ></v-text-field>
        <v-text-field
          v-model="team.password"
          :error-messages="passwordErrors"
          :counter="100"
          :type="'password'"
          outlined
          label="パスワード"
          required
          @input="$v.team.password.$touch()"
          @blur="$v.team.password.$touch()"
        ></v-text-field>
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
        <v-row justify="center">
          <v-btn
            class="mr-4 mt-4"
            color="primary"
            @click="register()"
          >
            登録
          </v-btn>
          <v-btn
            to="/login"
            nuxt 
            class="mt-4"
          >
            戻る
          </v-btn>
        </v-row>
        <v-snackbar
          v-model="isError"
          :timeout=5000
          color="red accent-2"
        >
          {{ errorMessage }}
          <template>
          </template>
        </v-snackbar>
      </div>
    </div>
  </v-card>
</div>
</template>

<script>
import TeamApi from '@/plugins/axios/modules/team'
import { validationMixin } from 'vuelidate'
import { required, maxLength, minLength, alphaNum } from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  validations: {
    team: {
      accountId: { required, minLength: minLength(8), maxLength: maxLength(100), alphaNum },
      password: { required, minLength: minLength(8), maxLength: maxLength(100), alphaNum },
      name: { required, maxLength: maxLength(100) }
    }
  },
  data() {
    return {
      team: {
        accountId: null,
        password: null,
        name: null
      },
      errorMessage: null,
      isError: false
    }
  },
  computed: {
    accountIdErrors () {
      const errors = []
      if (!this.$v.team.accountId.$dirty) return errors
      !this.$v.team.accountId.required && errors.push('アカウントIDは必須です。')
      !this.$v.team.accountId.alphaNum && errors.push('アカウントIDは半角英数です。')
      !this.$v.team.accountId.maxLength && errors.push('アカウントIDは100文字以内です。')
      !this.$v.team.accountId.minLength && errors.push('アカウントIDは8文字以上です。')
      return errors
    },
    passwordErrors () {
      const errors = []
      if (!this.$v.team.password.$dirty) return errors
      !this.$v.team.password.required && errors.push('パスワードは必須です。')
      !this.$v.team.password.alphaNum && errors.push('パスワードは半角英数です。')
      !this.$v.team.password.maxLength && errors.push('パスワードは100文字以内です。')
      !this.$v.team.password.minLength && errors.push('パスワードは8文字以上です。')
      return errors
    },
    nameErrors () {
      const errors = []
      if (!this.$v.team.name.$dirty) return errors
      !this.$v.team.name.required && errors.push('チーム名は必須です。')
      !this.$v.team.name.maxLength && errors.push('チーム名は100文字以内です。')
      return errors
    }
  },
  methods: {
    async register() {
      this.isError = false
      this.$v.$touch()
      if (this.$v.$invalid) {
        return
      }
      TeamApi.registerTeam(this.team)
      .then((res) => {
        this.$router.push({ path: '/login' , query : { isRegisterd: true } })
      })
      .catch((error) => {
        console.log(error)
        this.isError = true
        if (error.status === 409) {
          this.errorMessage = 'アカウントIDがすでに使用されています。'
        } else {
          this.errorMessage = '通信エラーが発生しました。'
        }
      })
    }
  }
}
</script>

<style scoped>
</style>