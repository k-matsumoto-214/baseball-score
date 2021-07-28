<template>
  <div class="d-flex rounded-pill grey lighten-2 py-2 my-2">
    <v-list-item-content style="height: 56px;">
      <div> 
        <v-list-item-title class="text-center">投手</v-list-item-title>
      </div>
    </v-list-item-content>
    <div style="min-width: 18px"></div>
    <v-list-item-avatar>
      <v-img :src="nowPitcher.image ? nowPitcher.image : '../noimage.jpg'"></v-img>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title class="ml-5">{{ nowPitcher.name }}</v-list-item-title>
    </v-list-item-content>
  </div>
</template>

<script>
export default {
  props: {
    nowPitcher: Object
  }
}
</script>