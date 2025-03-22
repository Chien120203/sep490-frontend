<template>
  <el-calendar ref="calendar">
    <template #header="{ date }">
      <span>{{title}}</span>
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
      </div>
    </template>
  </el-calendar>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps(
    {
      title: {
        type: String,
        default: ""
      }
    }
);
const emit = defineEmits(["choose-date"])

const calendar = ref();

const selectDate = (val: string) => {
  if (!calendar.value) return
  calendar.value.selectDate(val)
}

const handleDateClick = (date) => {
  emit('choose-date', date);
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