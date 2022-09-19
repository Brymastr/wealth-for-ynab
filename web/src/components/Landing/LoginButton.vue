<template>
  <a class="inline-block text-xl px-2 py-2 leading-none border rounded hover:border-green-400 hover:text-green-400 border-blue-400 lg:mt-0 ml-5 transition duration-150"
    :href="href">{{ text }}</a>
</template>

<script setup lang="ts">
import useSession from '@/composables/session';
import { ref } from 'vue';

const href = ref('/login');
const text = ref('Login');

const { quickVerify } = useSession();

const verifiedSession = quickVerify();

if (verifiedSession) {
  href.value = '/app';
  text.value = 'Get Started';
}
</script>
