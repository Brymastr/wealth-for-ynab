<template>
  <div class="flex flex-col text-center justify-center text-2xl whitespace-nowrap">
    <div>{{ name }}</div>
  </div>
</template>

<script lang="ts">
import useYnab from '@/composables/ynab';
import useBackend from '@/composables/backend';
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'Nav Title',
  setup() {
    const { getSelectedBudgetName } = useYnab();
    const { isDummy } = useBackend();
    const name = computed(() => (isDummy.value ? 'Dummy Data' : getSelectedBudgetName.value));
    return { name };
  },
});
</script>
