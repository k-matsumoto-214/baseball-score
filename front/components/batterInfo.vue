<template>
  <v-card
    class="mx-auto"
    max-width="344"
  >
    <v-img
      :src="nowBatter.image ? nowBatter.image : '../noimage.png'"
      height="100px"
    ></v-img>
    <v-card-text class="grey lighten-3 text">
      {{ nowBatter.lineupNumber }}番： <br /> 
      {{ nowBatter.name }}
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    nowBatter: Object
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