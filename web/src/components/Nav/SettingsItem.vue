<template>
  <div
    class="
      cursor-pointer
      transition
      duration-100
      ease-out
      hover:bg-gray-900
      text-lg
      flex
      justify-between
      leading-10
      px-3
      sm:px-5
      select-none
    "
    @click="action"
  >
    <p>{{ label }}</p>
    <p>
      {{ enabled === true ? 'Enabled' : 'Disabled' }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Settings',
  props: {
    action: Function,
    enabled: Boolean,
    label: String,
  },
});
</script>
