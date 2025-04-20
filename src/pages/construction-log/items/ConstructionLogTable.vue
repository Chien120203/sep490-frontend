<template>
  <el-calendar ref="calendar" :range="[new Date(plusOneMonth(dateRange.startDate)), new Date(plusOneMonth(dateRange.endDate))]">
    <template #header="{ date }">
      <span>{{ date }}</span>
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
const emit = defineEmits(["choose-date"])

const calendar = ref();

const selectDate = (val) => {
  if (!calendar.value) return calendar.value.selectDate(val)
}

const handleDateClick = (date) => {
  emit('choose-date', date);
}

const plusOneMonth = (dateStr) => {
  return dayjs(dateStr).format('YYYY-MM-DD')
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