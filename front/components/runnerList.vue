<template>
  <div>
    <div class="d-flex">
      <v-list-item-avatar>
        <v-img :src="player.image ? player.image : '../noimage.png'"></v-img>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title v-text="player.name" style="margin-left: 5px"></v-list-item-title>
      </v-list-item-content>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    player: Object
  }
}
</script>
