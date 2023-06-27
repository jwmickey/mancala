<script setup lang="ts">
import BoardMarble from './BoardMarble.vue'
import type { MarbleColor } from '@/types/marble-colors'

const debug = false

defineProps<{
  marbles: MarbleColor[]
  current: boolean
  clickable: boolean
}>()
</script>

<template>
  <div
    class="transition-transform border flex flex-wrap content-evenly justify-evenly p-2 align-center items-center aspect-squared w-16 h-16 rounded-full self-center justify-self-center shadow-inner shadow-gray-600"
    :class="{
      'ring-4 ring-offset-0 ring-green-600': current,
      'bg-gray-500 bg-opacity-25': !clickable
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

    <slot v-if="debug" />
  </div>
</template>
