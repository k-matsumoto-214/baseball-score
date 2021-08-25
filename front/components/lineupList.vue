<template>
  <div
    v-if="
      player.id !== 1000 &&
      player.id !== 1001 &&
      player.id !== 1002 &&
      player.id !== 1003 &&
      player.id !== 1004 &&
      player.id !== 1005 &&
      player.id !== 1006 &&
      player.id !== 1007 &&
      player.id !== 1008 &&
      !(isReserve && player.deleteFlg)
    "
    class="d-flex"
  >
    <div style="min-width: 18px">{{ number }}</div>
    <v-list-item-avatar>
      <v-img :src="player.image ? player.image : '../noimage.png'"></v-img>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title v-text="player.name" style="margin-left: 5px"></v-list-item-title>
    </v-list-item-content>
  </div>
</template>

<script>
export default {
  props: {
    player: Object,
    number: Number,
    isReserve: Boolean
  }
}
</script>
