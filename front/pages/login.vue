<template>
<div>
 <input type="text" v-model="form.accountId" />
 <input type="text" v-model="form.password" />
 <button @click="login()"></button>
</div>
</template>

<script>
export default {
  middleware({ store, redirect }) {
    if(store.$auth.loggedIn) {
      redirect('/');
    }
  },
  data() {
    return {
      form: {
        accountId: 'test',
        password: 'test'
      }
    }
  },
  methods: {
    async login() {
      try {
        console.log(this.form)
        const response = await this.$auth.loginWith('local', { data: this.form });
        console.log(response);
      } catch(error) {
        console.log(error);
      }
    }
  }
}
</script>
