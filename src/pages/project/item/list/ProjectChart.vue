<template>
  <div class="chart-container">
    <DoughnutChart :chartData="chartData" :options="chartOptions" />
    <ul class="legend">
      <li v-for="(label, index) in chartData.labels" :key="index">
        <span :style="{ backgroundColor: chartData.datasets[0].backgroundColor[index] }"></span>
        {{ label }}: {{ formatNumber(chartData.datasets[0].data[index]) }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { DoughnutChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

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

// Hàm để format số
const formatNumber = (number) => {
  return `${new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(number)} `;
};
</script>

<style lang="scss" scoped>
.chart-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 450px;
  gap: 20px;
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