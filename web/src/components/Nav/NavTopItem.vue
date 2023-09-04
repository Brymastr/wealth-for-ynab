<template>
  <div class="flex flex-col justify-center items-center cursor-pointer -mb-1" @click="$emit('clicked')">
    <Underline v-if="underline" color="green" level="400" :selected="selected">
      <slot></slot>
    </Underline>
    <slot v-else></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Underline from '@/components/General/Underline.vue';

export default defineComponent({
  name: 'Nav Top Item',
  components: { Underline },
  props: {
    selected: {
      type: Boolean,
      default: false,
    },
    click: Function,
    underline: {
      type: Boolean,
      default: true,
    },
  },
});
</script>
