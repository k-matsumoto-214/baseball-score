<template>
  <v-app-bar
    color="blue-grey lighten-4"
    elevate-on-scroll
    dense
    class="mx-auto fill-width"
    max-width="640"
    fixed
    app
  >
    <v-menu>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          v-bind="attrs"
          v-on="on"
        >
          <v-app-bar-nav-icon></v-app-bar-nav-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
        >
          <v-list-item-title>
            <p @click="$router.push(item.path)">{{ item.name }}</p>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-toolbar-title>{{ team.name }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-menu>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item>
          <v-list-item-title>
            <p @click="logout()">ログアウト</p>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import TeamApi from '@/plugins/axios/modules/team'
export default {
  data() {
    return {
      team: {
        name: null,
        comment: null,
        image: null
      },
      items: [
        {
          name: 'Top',
          path: '/'
        },
        {
          name: 'Team',
          path: '/team'
        },
        {
          name: 'Player',
          path: '/player'
        },
        {
          name: 'Game',
          path: '/game'
        }
      ]
    }
  },
  mounted() {
    TeamApi.getTeam()
    .then((res) => {
      this.team = res
    })
    .catch((error) => {
      console.log(error)
    })
  },
  methods: {
    logout() {
      this.$auth.logout();
    }
  },
}
</script>