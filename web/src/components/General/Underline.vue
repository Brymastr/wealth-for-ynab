<template>
  <div class="parent flex flex-col justify-center items-center cursor-pointer h-full">
    <slot></slot>
    <div class="underline transition-all duration-200" :class="[underlineColor, { selected }]"></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, withDefaults } from 'vue';

export interface Props {
  selected?: boolean,
  color?: string,
  level?: string
}

const props = withDefaults(defineProps<Props>(), {
  selected: false,
  color: 'gray',
  level: '800',
})

const underlineColor = computed(() => `bg-${props.color}-${props.level}`)
</script>

<style scoped>
.underline {
  width: 0;
  height: 2px;
}

.parent:hover>.underline,
.selected {
  width: 100%;
}
</style>
