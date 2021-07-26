<template>
  <div class="d-flex">
    <v-list-item-content style="height: 56px;">
      <div class="rounded-circle blue lighten-5 py-2"> 
      <v-list-item-title class="text-center" v-text="format(fieldNumber)"></v-list-item-title>
      </div>
    </v-list-item-content>
  </div>
</template>

<script>
export default {
  props: {
    fieldNumber: Number
  },
  methods: {
    format(number) {
      switch (number) {
        case 1: return '投'
        case 2: return '捕'
        case 3: return '一'
        case 4: return '二'
        case 5: return '三'
        case 6: return '遊'
        case 7: return '左'
        case 8: return '中'
        case 9: return '右'
        default: return '指'
      }
    }
  },
}
</script>