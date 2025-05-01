<template>
  <el-calendar ref="calendar" :range="[dateRange.fromDate, dateRange.toDate]">
    <template #header="{ date }">
      <span>{{ dayjs(dateRange.fromDate).format('MMMM YYYY') }}</span>
      <el-button-group>
        <el-button size="small" @click="selectDate('prev-year')">
          {{ $t('construct_log.log_table.previous_year') }}
        </el-button>
        <el-button size="small" @click="selectDate('prev-month')">
          {{ $t('construct_log.log_table.previous_month') }}
        </el-button>
        <el-button size="small" @click="selectDate('today')">
          {{ $t('construct_log.log_table.today') }}
        </el-button>
        <el-button size="small" @click="selectDate('next-month')">
          {{ $t('construct_log.log_table.next_month') }}
        </el-button>
        <el-button size="small" @click="selectDate('next-year')">
          {{ $t('construct_log.log_table.next_year') }}
        </el-button>
      </el-button-group>
    </template>
    <template #date-cell="{ data }">
      <div class="date-container" @click="handleDateClick(data)">
        <p :class="data.isSelected ? 'is-selected' : ''">
          {{ data.day.split('-').slice(2).join('') }}
        </p>
        <div style="display: flex; flex-wrap: wrap; gap: 4px; align-items: center;">
          <el-tag
              v-for="(log, idx) in getLogsByDate(data.day).slice(0, 3)"
              :key="idx"
              type="primary"
          >
            {{ log.logName }}
          </el-tag>
          <span v-if="getLogsByDate(data.day).length > 3">...</span>
        </div>
      </div>
    </template>
  </el-calendar>
</template>

<script setup>
import { ref } from 'vue'
import dayjs from "dayjs";
import {DATE_FORMAT} from "@/constants/application.js";

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
  props.dateRange.fromDate = newFrom.format(DATE_FORMAT);
  props.dateRange.toDate = newTo.format(DATE_FORMAT);

  // Emit if needed
  emit('change-date');
};

const handleDateClick = (date) => {
  emit('choose-date', date);
}

const getLogName = (data) => {
  return props.listLog.find(log => dayjs(log.logDate).format(DATE_FORMAT) === data)?.logName || ""
}

const getLogsByDate = (date) => {
  return props.listLog.filter(log => dayjs(log.logDate).format(DATE_FORMAT) === date) || [];
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