<template>
  <div class="flex flex-col text-center justify-center text-2xl whitespace-nowrap">
    <div>{{ name }}</div>
  </div>
</template>

<script setup lang="ts">
import useBackend from '@/composables/backend';
import { computed } from 'vue';

const { activeBackend } = useBackend();
const name = computed(() => activeBackend.value.selectedBudgetName.value)
</script>
