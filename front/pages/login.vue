<template>
<div>
  <v-card
      class="mx-auto fill-width"
      flat
      max-width="640"
  >
    <v-card-title class="text-center pa-8">
      <h4 class="fill-width">野球スコア管理アプリ</h4>
    </v-card-title>
    <v-divider> </v-divider>
    <div class="px-6 py-8">
      <div style="max-width:344px" class="mx-auto">
        <v-text-field
          v-model="accountId"
          :error-messages="accountIdErrors"
          :counter="100"
          outlined
          label="アカウントID"
          required
          @input="$v.accountId.$touch()"
          @blur="$v.accountId.$touch()"
        ></v-text-field>
        <v-text-field
          v-model="password"
          :error-messages="passwordErrors"
          :counter="100"
          :type="'password'"
          outlined
          label="パスワード"
          required
          @input="$v.password.$touch()"
          @blur="$v.password.$touch()"
        ></v-text-field>
        <v-row justify="center">
          <v-btn
            class="mr-4 mt-4"
            color="primary"
            @click="login()"
          >
            ログイン
          </v-btn>
          <v-btn
            to="/register"
            nuxt 
            class="mt-4"
          >
            新規登録
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
        <v-snackbar
          v-model="isRegisterd"
          :timeout=5000
          color="blue accent-2"
        >
          新規登録に成功しました。
          <template>
          </template>
        </v-snackbar>
      </div>
    </div>
  </v-card>
</div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, maxLength, minLength, alphaNum } from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  validations: {
    accountId: { required, minLength: minLength(8), maxLength: maxLength(100), alphaNum },
    password: { required, minLength: minLength(8), maxLength: maxLength(100), alphaNum }
  },
  created() {
    if (this.$route.query.isRegisterd) {
      this.isRegisterd = true
    }
  },
  data() {
    return {
      accountId: 'testtest',
      password: 'password',
      errorMessage: null,
      isError: false,
      isRegisterd: false
    }
  },
  computed: {
    accountIdErrors () {
      const errors = []
      if (!this.$v.accountId.$dirty) return errors
      !this.$v.accountId.required && errors.push('アカウントIDは必須です。')
      !this.$v.accountId.alphaNum && errors.push('アカウントIDは半角英数です。')
      !this.$v.accountId.maxLength && errors.push('アカウントIDは100文字以内です。')
      !this.$v.accountId.minLength && errors.push('アカウントIDは8文字以上です。')
      return errors
    },
    passwordErrors () {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.maxLength && errors.push('パスワードは必須です。')
      !this.$v.password.alphaNum && errors.push('パスワードは半角英数です。')
      !this.$v.password.required && errors.push('パスワードは100文字以内です。')
      !this.$v.password.minLength && errors.push('パスワードは8文字以上です。')
      return errors
    }
  },
  methods: {
    async login() {
      this.isError = false
      this.$v.$touch()
      if (this.$v.$invalid) {
        return
      }
      try {
        await this.$auth.loginWith('local', { 
          data: {
            accountId: this.accountId,
            password: this.password
          }
        })
      } catch(error) {
        console.log(error)
        this.isError = true
        if (error.status === 403) {
          this.errorMessage = 'IDとパスワードの組み合わせが違います。'
        } else {
          this.errorMessage = '通信エラーが発生しました。'
        }
      }
    },
    clear () {
      this.$v.$reset()
      this.accountId = ''
      this.password = ''
    },
  }
}
</script>
