<template>
  <div class="flex flex-col text-center justify-center text-2xl whitespace-nowrap">
    <div>{{ name }}</div>
  </div>
</template>

<script lang="ts">
import useBackend from '@/composables/backend';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Nav Title',
  setup() {
    const { activeBackend } = useBackend();
    const name = activeBackend.value.selectedBudgetName
    return { name };
  },
});
</script>
