<template>
  <v-card
    class="mx-auto"
    max-width="344"
  >
    <v-img
      :src="nowPitcher.image ? nowPitcher.image : '../noimage.png'"
      height="100px"
    ></v-img>
    <v-card-text class="text grey lighten-3">
      投手：<br />
      {{ nowPitcher.name }}
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    nowPitcher: Object
  }
}
</script>

<style scoped>
 .text {
    white-space: nowrap;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>