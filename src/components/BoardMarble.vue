<script setup lang="ts">
const props = defineProps<{
  color: string
  offsetX: number
  offsetY: number
  rotation: number
}>()

function margin(direction: 't' | 'l', offset: number) {
  let m = `m${direction}-${offset}`
  if (props.offsetY < 0) {
    m = '-' + m
  }
  return m
}
</script>

<template>
  <div
    class="rounded-full aspect-square w-4 h-4"
    :class="{
      [props.color]: true,
      [margin('t', props.offsetY)]: true,
      [margin('l', props.offsetX)]: true
    }"
  ></div>
</template>
