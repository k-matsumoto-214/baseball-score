<template>
  <div>
    <div class="d-flex">
      <v-list-item-avatar>
        <v-img :src="player.image ? player.image : '../noimage.png'"></v-img>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title v-text="player.name" style="margin-left: 5px"></v-list-item-title>
      </v-list-item-content>
      <v-checkbox
        v-model="checkbox1"
        :label="'自責点'"
        @change="$emit('change-earned-flg',$event)"
        class="mr-4 ml-2"
      ></v-checkbox>
      <v-checkbox
        v-model="checkbox2"
        :label="'打点'"
        @change="$emit('change-rbi-flg',$event)"
        class="mr-4"
      ></v-checkbox>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    player: Object
  },
  data() {
    return {
      checkbox1: true,
      checkbox2: true
    }
  },
}
</script>
