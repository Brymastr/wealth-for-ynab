<template>
  <div class="h-screen">
    <!-- main -->
    <main class="h-full">
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
