<template>
  <div
    class="
      flex flex-col
      sm:flex-row
      items-stretch
      justify-end
      divide-y-2
      sm:divide-y-0 sm:divide-x-2
      divide-blue-400
      w-full
      mx-auto
      sm:w-min
      overflow-x-hidden
    "
  >
    <!-- left side -->
    <div class="flex sm:flex-col items-end justify-between sm:pr-3 pb-3 sm:pb-0 px-3">
      <div class="flex flex-col sm:items-end">
        <div class="text-5xl sm:text-6xl uppercase leading-none">Settings</div>
        <p>Settings persist until logout</p>
      </div>
      <ArrowRightCircleIcon class="text-3xl -mr-1" label="Done" :action="done" size="large" />
    </div>

    <!-- right side -->
    <div class="pt-3 sm:pt-0 sm:pl-3 sm:w-64">
      <div>
        <span class="block text-3xl border-b border-blue-400 px-3">Misc.</span>
        <SettingsItem :action="setBrynab" label="brynab" :enabled="getBrynab" />
        <SettingsItem :action="setDummy" label="dummy data" :enabled="isDummy" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ArrowRightCircleIcon from '@/components/Icons/ArrowRightCircleIcon.vue';
import { defineComponent } from 'vue';
import useSettings from '@/composables/settings';
import SettingsItem from '@/components/Nav/SettingsItem.vue';

export default defineComponent({
  name: 'Settings',
  components: { ArrowRightCircleIcon, SettingsItem },
  setup(_, { emit }) {
    const { getBrynab, setBrynab, isDummy, setDummy } = useSettings();

    return {
      done: () => emit('done'),
      getBrynab,
      setBrynab: setBrynab.bind(null, undefined),
      setDummy: setDummy.bind(null, undefined),
      isDummy,
    };
  },
});
</script>
