<template>
  <div></div>
</template>

<script setup lang="ts">
import useBackend from '@/composables/backend';
import useSession from '@/composables/session';
import useSettings from '@/composables/settings';
import router from '@/router';
import { nextTick } from 'vue';

const { clearState: clearSessionState } = useSession();
const { clearState: clearBackendState } = useBackend();
const { setDummy } = useSettings();

clearSessionState()
clearBackendState()
setDummy(false)
nextTick(() => router.replace({ name: 'Landing' }));

</script>
