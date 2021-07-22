<template>
  <div>
    <v-app-bar
      color="blue-grey lighten-4"
      elevate-on-scroll
      dense
      class="mx-auto fill-width"
      max-width="640"
      fixed
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ team.name }}</v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      temporary
    >
      <v-list
        nav
        dense
      >
        <v-list-item-group
          v-model="group"
          active-class="blue--text text--accent-2"
        >
          <v-list>
            <v-list-item
              v-for="(item, i) in items"
              :key="i"
            >
              <v-list-item-title @click="$router.push(item.path)">
                {{ item.name }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title @click="logout">
                Logout
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
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
      ],
      drawer: false,
      group: null
    }
  },
  watch: {
    group () {
      this.drawer = false
    },
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