<template>
  <div class="icon-parent flex cursor-pointer items-center" @click="props.action">
    <p class="pr-1">
      <slot></slot>
    </p>
    <svg :id="props.id" class="block transition-transform duration-200 ease-in-out h-full" :class="[
      { rotate: rotateClass, ready: props.ready },
      { 'w-8': size === 'small', 'w-16': size === 'large', 'w-auto': size === 'auto' },
    ]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1"
      stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" />
      <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -5v5h5" />
      <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 5v-5h-5" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';


const props = defineProps<{
  id: string,
  size: string,
  rotate: boolean,
  ready?: boolean,
  action?: (payload: MouseEvent) => void
}>()

const rotateClass = ref<boolean>(props.rotate);
function listener() {
  rotateClass.value = props.rotate;
}

watch(
  () => props.rotate,
  n => {
    if (n) rotateClass.value = true;
  },
);

onMounted(() => {
  const element = document.getElementById(props.id);
  element?.addEventListener('animationiteration', listener);
});


</script>

<style lang="postcss" scoped>
.icon-parent:hover .ready {
  transform: rotate(-90deg);
}

@keyframes startSpin {
  0% {
    transform: rotate(-90deg);
  }

  100% {
    transform: rotate(-360deg);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(-360deg);
  }
}

.rotate {
  animation: startSpin 1.05s cubic-bezier(0.54, 0.01, 0.44, 1) 1,
    spin 1.05s cubic-bezier(0.54, 0.01, 0.44, 1) 1s infinite;
}
</style>
