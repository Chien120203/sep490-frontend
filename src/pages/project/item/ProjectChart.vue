<template>
  <div class="chart-container">
    <DoughnutChart :chart-data="chartData" :chart-options="chartOptions" />
    <ul class="legend">
      <li v-for="(label, index) in chartData.labels" :key="index">
        <span :style="{ backgroundColor: chartData.datasets[0].backgroundColor[index] }"></span>
        {{ label }} - {{ chartData.datasets[0].data[index] }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { DoughnutChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";

// ✅ Register all required Chart.js components
Chart.register(...registerables);

// ✅ Define props to receive data from the parent
defineProps({
  chartData: Object,
  chartOptions: Object,
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.chart-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 400px;
}

.legend {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;

  li {
    display: flex;
    align-items: center;
    font-size: 14px;
    margin-bottom: 8px;

    span {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-right: 8px;
    }
  }
}
</style>
