<script setup lang="ts">
import MonthlyTotalsChart from '~/components/dashboard/MonthlyTotalsChart.vue';
import ItemPriceHistoryChart from '~/components/dashboard/ItemPriceHistoryChart.vue';
definePageMeta({
  layout: 'default',
  middleware: ['auth'],
});
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold mb-2">
      Dashboard
    </h1>

    <MonthlyTotalsChart />

    <ItemPriceHistoryChart />
  </div>
</template>