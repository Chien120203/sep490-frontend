<template>
  <div class="chart-container">
    <h3>{{ $t('chart.title') }}</h3>
    <canvas ref="chartCanvas"></canvas>
    <div class="chart-legend" v-if="hasData">
      <div class="legend-item">
        <div class="legend-color work-amount"></div>
        <span>{{ $t('chart.legend.workAmount') }}</span>
      </div>
      <div class="legend-item">
        <div class="legend-color material"></div>
        <span>{{ $t('chart.legend.materials') }}</span>
      </div>
      <div class="legend-item">
        <div class="legend-color labor"></div>
        <span>{{ $t('chart.legend.labor') }}</span>
      </div>
      <div class="legend-item">
        <div class="legend-color equipment"></div>
        <span>{{ $t('chart.legend.equipment') }}</span>
      </div>
    </div>
    <div v-if="!hasData" class="no-data">{{ $t('chart.noData') }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Chart from 'chart.js/auto';

const { t, locale } = useI18n(); // Access i18n translation function and current locale

const props = defineProps({
  constructionLogData: {
    type: Array,
    required: true
  }
});

const chartCanvas = ref(null);
let chart = null;
const hasData = computed(() => {
  return processDataForChart(props.constructionLogData).labels.length > 0;
});

// Resource type constants
const RESOURCE_TYPE = {
  LABOR: 1,
  EQUIPMENT: 2,
  MATERIAL: 3
};

// Function to process the data for the chart
const processDataForChart = (logs) => {
  if (!logs || !Array.isArray(logs) || logs.length === 0) {
    return {
      labels: [],
      workAmountData: [],
      laborData: [],
      equipmentData: [],
      materialData: []
    };
  }

  // Sort logs by date ascending
  const sortedLogs = [...logs].sort((a, b) =>
      new Date(a.logDate) - new Date(b.logDate)
  );

  const labels = [];
  const workAmountData = [];
  const laborData = [];
  const equipmentData = [];
  const materialData = [];

  sortedLogs.forEach(log => {
    // Format the date for display using current locale
    const date = new Date(log.logDate);
    const formattedDate = date.toLocaleDateString(locale.value, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    labels.push(formattedDate);

    // Process work amount
    const totalWorkAmount = log.workAmount && log.workAmount.length > 0
        ? log.workAmount.reduce((sum, item) => sum + item.workAmount, 0)
        : 0;
    workAmountData.push(totalWorkAmount);

    // Process resources by type
    let laborTotal = 0;
    let equipmentTotal = 0;
    let materialTotal = 0;

    if (log.resources && log.resources.length > 0) {
      log.resources.forEach(resource => {
        switch (resource.resourceType) {
          case RESOURCE_TYPE.LABOR:
            laborTotal += resource.quantity;
            break;
          case RESOURCE_TYPE.EQUIPMENT:
            equipmentTotal += resource.quantity;
            break;
          case RESOURCE_TYPE.MATERIAL:
            materialTotal += resource.quantity;
            break;
          default:
            break;
        }
      });
    }

    laborData.push(laborTotal);
    equipmentData.push(equipmentTotal);
    materialData.push(materialTotal);
  });

  return {
    labels,
    workAmountData,
    laborData,
    equipmentData,
    materialData
  };
};

// Create or update the chart
const createChart = () => {
  if (chart) {
    chart.destroy();
  }

  const { labels, workAmountData, laborData, equipmentData, materialData } = processDataForChart(props.constructionLogData);

  if (labels.length === 0) {
    return;
  }

  const ctx = chartCanvas.value.getContext('2d');

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: t('chart.legend.workAmount'),
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
          label: t('chart.legend.materials'),
          data: materialData,
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          yAxisID: 'y',
        },
        {
          label: t('chart.legend.labor'),
          data: laborData,
          backgroundColor: 'rgba(255, 206, 86, 0.7)',
          yAxisID: 'y',
        },
        {
          label: t('chart.legend.equipment'),
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
          callbacks: {
            title: function(tooltipItems) {
              return tooltipItems[0].label;
            },
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                if (label.includes(t('chart.legend.workAmount'))) {
                  label += new Intl.NumberFormat(locale.value).format(context.parsed.y);
                } else {
                  label += context.parsed.y;
                }
              }
              return label;
            }
          }
        },
        legend: {
          display: false, // Using custom legend
        },
        title: {
          display: true,
          text: t('chart.title')
        }
      },
      scales: {
        y: {
          title: {
            display: true,
            text: t('chart.axes.resourceQuantity')
          },
          beginAtZero: true,
          position: 'left',
        },
        y1: {
          title: {
            display: true,
            text: t('chart.axes.workAmount')
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
  if (props.constructionLogData && props.constructionLogData.length) {
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

.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  font-size: 16px;
  color: #999;
}
</style>