<template>
  <div class="logo">
    <Logo />
    <span class="leading-none font-semibold uppercase text-5xl tracking-tight">wealth</span>
    <span class="text-right tracking-tight align-text-top">
      <span class="text-xl">for</span>
      <span class="leading-none text-5xl uppercase">ynab</span>
    </span>
  </div>
</template>

<script lang="ts">
import Logo from '@/assets/logo.vue';
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Logo Full',
  components: { Logo },
});
</script>

<style lang="postcss" scoped>
.logo {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, min-content));
  grid-template-rows: repeat(2, minmax(0, min-content));
  max-height: 96px;
  column-gap: 4px;
}

.logo>svg {
  min-width: 104px;
}
</style>
