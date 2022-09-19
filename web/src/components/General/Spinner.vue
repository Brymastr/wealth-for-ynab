<template>
  <div class="h-full text-gray-900 bg-gray-300 text-3xl flex flex-col justify-center">
    <ReloadIcon id="reload-icon" size="large" class="self-center cursor-wait" :rotate="true">
      <slot></slot>
    </ReloadIcon>
  </div>
</template>

<script setup lang="ts">
import ReloadIcon from '@/components/Icons/ReloadIcon.vue';
</script>
