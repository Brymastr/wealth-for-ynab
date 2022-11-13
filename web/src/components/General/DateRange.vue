<template>
  <div class="h-header">
    <Underline>
      <div class="flex items-center select-none">
        <div class="mr-2 hidden sm:block">Date Range:</div>
        <div>{{startDate}}</div>
        <div class="mx-2 cursor-default">-</div>
        <div>{{endDate}}</div>
      </div>
    </Underline>
  </div>

</template>

<script setup lang="ts">
import { formatDate } from '@/services/helper';
import { computed } from 'vue';
import Underline from '@/components/General/Underline.vue';

const props = defineProps<{ dateList: string[], startIndex: number, endIndex: number }>()

const startDate = computed(() => formatDate(props.dateList[props.startIndex]))
const endDate = computed(() => formatDate(props.dateList[props.endIndex]))
</script>
