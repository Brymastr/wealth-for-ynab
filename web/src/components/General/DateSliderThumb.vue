<template>
  <div ref="thumb"
    class="z-20 absolute bg-blue-400 cursor-pointer hover:bg-gray-700 whitespace-nowrap select-none text-white"
    :style="{left: `${side === 'left' ? position - 30 : position}px`}" :class="{
      'pl-2 pr-1 rounded-l-full': side === 'left',
      'pl-1 pr-2 rounded-r-full': side === 'right'
    }">{{text}}</div>
</template>

<script setup lang="ts">import { ref } from 'vue';

defineProps<{ position: number, text: string, side: 'left' | 'right' }>()
const thumb = ref(null)
defineExpose({ thumb })
</script>

<style lang="css" scoped>
div {
  transition: left 50ms linear;
  top: -8px;
}
</style>
  