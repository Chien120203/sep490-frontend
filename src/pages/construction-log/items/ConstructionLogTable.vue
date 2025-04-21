<template>
  <el-calendar ref="calendar" :range="[dateRange.fromDate, dateRange.toDate]">
    <template #header="{ date }">
      <span>{{ dayjs(dateRange.fromDate).format('MMMM YYYY') }}</span>
      <el-button-group>
        <el-button size="small" @click="selectDate('prev-year')">
          Previous Year
        </el-button>
        <el-button size="small" @click="selectDate('prev-month')">
          Previous Month
        </el-button>
        <el-button size="small" @click="selectDate('today')">Today</el-button>
        <el-button size="small" @click="selectDate('next-month')">
          Next Month
        </el-button>
        <el-button size="small" @click="selectDate('next-year')">
          Next Year
        </el-button>
      </el-button-group>
    </template>
    <template #date-cell="{ data }">
      <div class="date-container" @click="handleDateClick(data)">
        <p :class="data.isSelected ? 'is-selected' : ''">
          {{ data.day.split('-').slice(2).join('') }}
        </p>
        <el-tag v-if="getLogName(data.day)" type="primary">{{getLogName(data.day)}}</el-tag>
      </div>
    </template>
  </el-calendar>
</template>

<script setup>
import { ref } from 'vue'
import dayjs from "dayjs";

const props = defineProps(
    {
      listLog: {
        type: Array,
        default: () => []
      },
      dateRange: {
        type: Object,
        default: () => {},
      }
    }
);
const emit = defineEmits(["choose-date", "change-date"])

const calendar = ref();

const selectDate = (value) => {
  const from = dayjs(props.dateRange.fromDate);
  const to = dayjs(props.dateRange.toDate);

  let newFrom = from;
  let newTo = to;

  switch (value) {
    case 'prev-year':
      newFrom = from.subtract(1, 'year');
      newTo = to.subtract(1, 'year');
      break;
    case 'next-year':
      newFrom = from.add(1, 'year');
      newTo = to.add(1, 'year');
      break;
    case 'prev-month':
      newFrom = from.subtract(1, 'month');
      newTo = to.subtract(1, 'month');
      break;
    case 'next-month':
      newFrom = from.add(1, 'month');
      newTo = to.add(1, 'month');
      break;
    case 'today':
      newFrom = dayjs().startOf('month');
      newTo = dayjs().endOf('month');
      break;
    default:
      break;
  }

  // Now update the props.dateRange values (if mutable)
  props.dateRange.fromDate = newFrom.format('YYYY-MM-DD');
  props.dateRange.toDate = newTo.format('YYYY-MM-DD');

  // Emit if needed
  emit('change-date');
};

const handleDateClick = (date) => {
  emit('choose-date', date);
}

const getLogName = (data) => {
  return props.listLog.find(log => log.logDate === data)?.logName || ""
}
</script>
<style scoped>
.is-selected {
  color: #1989fa;
}

.date-container {
  height: 100%;
}
</style>