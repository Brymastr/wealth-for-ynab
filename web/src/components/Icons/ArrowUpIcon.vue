<template>
  <svg :class="[
    'transform',
    {
      'rotate-90': direction === 'right',
      'rotate-180': direction === 'down',
      '-rotate-90': direction === 'left',
    },
  ]" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" stroke-width="1"
    stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" xml:space="preserve">
    <path stroke="none" d="M0 0h24v24H0z" />
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="18" y1="11" x2="12" y2="5" />
    <line x1="6" y1="11" x2="12" y2="5" />
  </svg>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
export type ArrowDirection = 'up' | 'right' | 'down' | 'left';

export default defineComponent({
  props: {
    direction: {
      type: String as PropType<ArrowDirection>,
      default: 'up',
    },
  },
});
</script>
