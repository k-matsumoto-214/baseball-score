<template>
  <div>
    <v-row justify="space-between" class="px-5">
      <p class="text-center rounded-circle" v-bind:class="{ 'is-selected': isSelected1 }" @click="$emit('change-direction', 1)">投</p>
      <p class="text-center rounded-circle" v-bind:class="{ 'is-selected': isSelected2 }" @click="$emit('change-direction', 2)">捕</p>
      <p class="text-center rounded-circle" v-bind:class="{ 'is-selected': isSelected3 }" @click="$emit('change-direction', 3)">一</p>
      <p class="text-center rounded-circle" v-bind:class="{ 'is-selected': isSelected4 }" @click="$emit('change-direction', 4)">二</p>
      <p class="text-center rounded-circle" v-bind:class="{ 'is-selected': isSelected5 }" @click="$emit('change-direction', 5)">三</p>
      <p class="text-center rounded-circle" v-bind:class="{ 'is-selected': isSelected6 }" @click="$emit('change-direction', 6)">遊</p>
      <p class="text-center rounded-circle" v-bind:class="{ 'is-selected': isSelected7 }" @click="$emit('change-direction', 7)">左</p>
      <p class="text-center rounded-circle" v-bind:class="{ 'is-selected': isSelected8 }" @click="$emit('change-direction', 8)">中</p>
      <p class="text-center rounded-circle" v-bind:class="{ 'is-selected': isSelected9 }" @click="$emit('change-direction', 9)">右</p>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    direction: Number
  },
  data() {
    return {
      isSelected1: false,
      isSelected2: false,
      isSelected3: false,
      isSelected4: false,
      isSelected5: false,
      isSelected6: false,
      isSelected7: false,
      isSelected8: false,
      isSelected9: false
    }
  },
  watch: {
    direction: function() {
      this.isSelected1 = false
      this.isSelected2 = false
      this.isSelected3 = false
      this.isSelected4 = false
      this.isSelected5 = false
      this.isSelected6 = false
      this.isSelected7 = false
      this.isSelected8 = false
      this.isSelected9 = false
      switch (this.direction) {
        case 1: return this.isSelected1 = true
        case 2: return this.isSelected2 = true
        case 3: return this.isSelected3 = true
        case 4: return this.isSelected4 = true
        case 5: return this.isSelected5 = true
        case 6: return this.isSelected6 = true
        case 7: return this.isSelected7 = true
        case 8: return this.isSelected8 = true
        case 9: return this.isSelected9 = true
      }
    }
  }
}
</script>

<style scoped>
.is-selected {
  background-color: #3949AB !important;
  color: white;
}
.text-center {
  padding: 4px 8px;
  background-color: #E0E0E0;
}
</style>