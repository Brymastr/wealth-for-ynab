<template>
  <div class="parent flex cursor-pointer items-center" @click="action">
    <p class="pr-1" v-if="label">{{ label }}</p>
    <svg xmlns="http://www.w3.org/2000/svg" class="block transition-transform duration-200 ease-in-out h-full"
      :class="{ 'w-8': size === 'small', 'w-16': size === 'large', 'w-auto': size === 'auto' }" width="24" height="24"
      viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round"
      stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" />
      <circle cx="12" cy="12" r="9" />
      <line x1="16" y1="12" x2="8" y2="12" />
      <line x1="16" y1="12" x2="12" y2="16" />
      <line x1="16" y1="12" x2="12" y2="8" />
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    label: String,
    action: Function,
    size: {
      type: String,
      default: 'large',
    },
  },
});
</script>

<style scoped lang="postcss">
.parent:hover svg {
  transform: rotate(-90deg);
}
</style>
