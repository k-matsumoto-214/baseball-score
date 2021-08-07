<template>
  <v-row class="black white--text" justify="space-between">
    <v-col cols="9" style="height: 64px;">
      <p class="mb-0">{{ atBat.inning }}回{{ atBat.topFlg ? '表' : '裏' }}</p>
      <div class="d-flex">
        <p class="mb-0">アウト : </p>
        <div class="rounded-circle ml-3" :class="outCount1()" style="width: 25px; width: 18px; margin: 3px 5px;"></div>
        <div class="rounded-circle" :class="outCount2()" style="width: 25px; width: 18px; margin: 3px 5px;"></div>
        <div class="rounded-circle white" style="width: 25px; width: 18px; margin: 3px 5px;"></div>
      </div>
    </v-col>
    <v-col cols="3" class="text-center" style="height: 64px;">
        <img :src="runnerFormat()" style="height: 100%;">
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    atBat: Object
  },
  data() {
    return {
    }
  },
  methods: {
    runnerFormat() {
      const isFirst = this.atBat.firstRunnerId !== null ? true : false
      const isSecond = this.atBat.secondRunnerId !== null ? true : false
      const isThird = this.atBat.thirdRunnerId !== null ? true : false
      if (!isFirst && !isSecond && !isThird) {
        return '../runner-0.png'
      }
      if (isFirst && !isSecond && !isThird) {
        return '../runner-1.png'
      }
      if (isFirst && isSecond && !isThird) {
        return '../runner-1-2.png'
      }
      if (isFirst && !isSecond && isThird) {
        return '../runner-1-3.png'
      }
      if (isFirst && isSecond && isThird) {
        return '../runner-1-2-3.png'
      }
      if (!isFirst && isSecond && !isThird) {
        return '../runner-2.png'
      }
      if (!isFirst && isSecond && isThird) {
        return '../runner-2-3.png'
      }
      if (!isFirst && !isSecond && isThird) {
        return '../runner-3.png'
      }
    },
    outCount1() {
      switch (this.atBat.outCount) {
        case 0: return 'white'
        case 1: return 'red'
        case 2: return 'red'
      }
    },
    outCount2() {
      switch (this.atBat.outCount) {
        case 0: return 'white'
        case 1: return 'white'
        case 2: return 'red'
      }
    }
  }
}
</script>