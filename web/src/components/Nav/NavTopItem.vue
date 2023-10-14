<template>
  <div class="flex flex-col justify-center items-center cursor-pointer -mb-1" @click="$emit('clicked')">
    <Underline v-if="underline" color="green" level="400" :selected="selected">
      <slot></slot>
    </Underline>
    <slot v-else></slot>
  </div>
</template>

<script setup lang="ts">
import Underline from '@/components/General/Underline.vue';

export interface Props {
  selected?: boolean
  underline?: boolean
}

withDefaults(defineProps<Props>(), {
  selected: false,
  underline: true,
})

</script>
