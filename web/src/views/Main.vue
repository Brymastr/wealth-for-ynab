<template>
  <div class="h-screen">
    <!-- main -->
    <main class="h-full">
      <router-view class="h-full flex flex-col"></router-view>
    </main>

    <!-- nav -->
    <Nav />
  </div>
</template>

<script setup lang="ts">
import Nav from '@/components/Nav/Nav.vue';
</script>
