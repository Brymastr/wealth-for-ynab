<template>
  <div class="flex flex-row self-start flex-wrap text-xl gap-y-3 pb-3 bg-gray-200 shadow-lg rounded-sm">
    <div class="text-gray-200 bg-gray-800 p-2 rounded-t-sm w-full">{{ props.title }}</div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
}>()

</script>
