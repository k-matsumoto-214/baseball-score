<template>
  <v-app id="app">
    <div>
      <Header />
      	<nuxt />
    </div>
  </v-app>
</template>

<script>
import Header from "@/components/header.vue";
import TeamApi from '@/plugins/axios/modules/team'
export default {
  components: {
    Header
  },
	middleware({ store, redirect }) {
    if(!store.$auth.loggedIn) {
      redirect('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
	main {
		min-height: 600px;
		background-color: #ddd;
		text-align: center;
		padding: 30px;
	}
	.page-enter-active,
	.page-leave-active {
		transition: 0.5s cubic-bezier(1, 0.25, 0.25, 1);
	}
	.page-enter,
	.page-leave-active {
		opacity: 0;
		transform: translate(0, 30px);
	}
</style>