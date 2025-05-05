<template>
  <div class="chart-container">
    <h3>Construction Progress & Resource Usage</h3>
    <canvas ref="chartCanvas"></canvas>
    <div class="chart-legend">
      <div class="legend-item">
        <div class="legend-color work-amount"></div>
        <span>Work Amount</span>
      </div>
      <div class="legend-item">
        <div class="legend-color material"></div>
        <span>Materials</span>
      </div>
      <div class="legend-item">
        <div class="legend-color labor"></div>
        <span>Labor</span>
      </div>
      <div class="legend-item">
        <div class="legend-color equipment"></div>
        <span>Equipment</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, watch } from 'vue';
import Chart from 'chart.js/auto';
import {HUMAN_TYPE, MACHINE_TYPE, MATERIAL_TYPE} from "@/constants/resource.js";

const props = defineProps({
  constructionLogData: {
    type: Object,
    required: true
  }
});

const chartCanvas = ref(null);
let chart = null;


// Function to process the data for the chart
const processDataForChart = (data) => {
  if (!data || !data.workAmount || !data.resources) {
    return {
      labels: [],
      workAmountData: [],
      laborData: [],
      equipmentData: [],
      materialData: []
    };
  }

  // Get unique dates from both workAmount and resources
  const allDates = [
    ...new Set([
      ...data.workAmount.map(item => item.logDate),
      ...data.resources.map(item => item.logDate)
    ])
  ].sort();

  // Prepare data for each date
  const workAmountData = [];
  const laborData = [];
  const equipmentData = [];
  const materialData = [];

  allDates.forEach(date => {
    // Find work amount for this date
    const workAmountItem = data.workAmount.find(item => item.logDate === date);
    workAmountData.push(workAmountItem ? workAmountItem.workAmount : 0);

    // Process resources by type for this date
    const dateResources = data.resources.filter(item => item.logDate === date);

    // Sum quantities by resource type
    const labor = dateResources
        .filter(res => res.resourceType === HUMAN_TYPE)
        .reduce((sum, res) => sum + res.quantity, 0);

    const equipment = dateResources
        .filter(res => res.resourceType === MACHINE_TYPE)
        .reduce((sum, res) => sum + res.quantity, 0);

    const material = dateResources
        .filter(res => res.resourceType === MATERIAL_TYPE)
        .reduce((sum, res) => sum + res.quantity, 0);

    laborData.push(labor);
    equipmentData.push(equipment);
    materialData.push(material);
  });

  return {
    labels: allDates.map(date => formatDate(date)),
    workAmountData,
    laborData,
    equipmentData,
    materialData
  };
};

// Format dates to be more readable
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Create or update the chart
const createChart = () => {
  if (chart) {
    chart.destroy();
  }

  const ctx = chartCanvas.value.getContext('2d');
  const { labels, workAmountData, laborData, equipmentData, materialData } = processDataForChart(props.constructionLogData);

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Work Amount',
          data: workAmountData,
          type: 'line',
          borderColor: '#FF6384',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          yAxisID: 'y1',
          pointRadius: 4,
          pointBackgroundColor: '#FF6384',
        },
        {
          label: 'Materials',
          data: materialData,
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          yAxisID: 'y',
        },
        {
          label: 'Labor',
          data: laborData,
          backgroundColor: 'rgba(255, 206, 86, 0.7)',
          yAxisID: 'y',
        },
        {
          label: 'Equipment',
          data: equipmentData,
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
          yAxisID: 'y',
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: false,
        },
        legend: {
          display: false, // Using custom legend
        },
        title: {
          display: true,
          text: 'Construction Progress & Resource Usage'
        }
      },
      scales: {
        y: {
          title: {
            display: true,
            text: 'Resource Quantity'
          },
          beginAtZero: true,
          position: 'left',
        },
        y1: {
          title: {
            display: true,
            text: 'Work Amount'
          },
          beginAtZero: true,
          position: 'right',
          grid: {
            drawOnChartArea: false,
          },
        }
      }
    }
  });
};

// Watch for changes in the data
watch(() => props.constructionLogData, () => {
  createChart();
}, { deep: true });

onMounted(() => {
  if (props.constructionLogData) {
    createChart();
  }
});
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 400px;
  width: 100%;
  margin: 20px 0;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.chart-legend {
  display: flex;
  justify-content: center;
  margin-top: 15px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  margin: 0 15px;
}

.legend-color {
  width: 15px;
  height: 15px;
  margin-right: 5px;
  border-radius: 3px;
}

.work-amount {
  background-color: #FF6384;
}

.material {
  background-color: rgba(54, 162, 235, 0.7);
}

.labor {
  background-color: rgba(255, 206, 86, 0.7);
}

.equipment {
  background-color: rgba(75, 192, 192, 0.7);
}

h3 {
  text-align: center;
  margin-bottom: 15px;
  color: #333;
}
</style>