<template>
  <div>
    <!-- main -->
    <main>
      <RouterView class="h-full flex flex-col"></RouterView>
    </main>

    <!-- nav -->
    <Nav />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Nav from '@/components/Nav/Nav.vue';
</script>

<style lang="postcss">
html {
  @apply bg-gray-300
}
</style>
