<script setup lang="ts">
import BoardMarble from './BoardMarble.vue'
import { MarbleColor } from '@/types/marble-colors'

defineProps<{
  marbles: MarbleColor[]
  current: boolean
}>()
</script>

<template>
  <div
    class="w-20 h-40 p-2 rounded-t-full rounded-b-full flex align-center items-center row-span-2 border flex-wrap content-evenly justify-evenly align-center aspect-squared rounded-full self-center justify-self-center shadow-inner shadow-gray-600"
    :class="{
      'ring-4 ring-offset-0 ring-green-600': current
    }"
  >
    <BoardMarble
      :color="color"
      :offset-x="0"
      :offset-y="0"
      :rotation="0"
      :key="i"
      v-for="(color, i) in marbles"
    >
    </BoardMarble>
  </div>
</template>
