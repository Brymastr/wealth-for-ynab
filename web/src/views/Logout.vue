<template>
  <div></div>
</template>

<script setup lang="ts">import useBackend from '@/composables/backend';
import useSession from '@/composables/session';
import router from '@/router';
import { nextTick } from 'vue';

const { clearState: clearSessionState } = useSession();
const { clearState: clearBackendState } = useBackend();

clearSessionState()
clearBackendState()
nextTick(() => router.replace({ name: 'Landing' }));

</script>
