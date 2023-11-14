<template>
  <RouterView />
  <DebugComponent v-show="isDebug" />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import useShortcuts from '@/composables/shortcuts';
import DebugComponent from '@/components/General/Debug.vue'
import useSettings from '@/composables/settings'


useShortcuts();
const { isDebug } = useSettings()

</script>
