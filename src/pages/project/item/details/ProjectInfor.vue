<template>
  <div class="project-progress">
    <div class="header">
      <h2>{{ project.title }}</h2>
      <div class="status">
        <span>{{ project.status }}</span>
        <span>({{ project.startDate }} - {{ project.endDate }})</span>
      </div>
    </div>

    <div class="budget">
      <div class="spending">
        <div>Budget</div>
        <div>{{ project.budget.toLocaleString() }} VND</div>
      </div>
      <div class="income">
        <div>Income</div>
        <div>{{ project.income.toLocaleString() }} VND</div>
      </div>
      <div class="expense">
        <div>Expense</div>
        <div>{{ project.expense.toLocaleString() }} VND</div>
      </div>
    </div>

    <div class="progress-bar">
      <div class="progress">
        <div class="planned" :style="{ width: project.plannedProgress + '%' }"></div>
        <div class="actual" :style="{ width: project.actualProgress + '%' }"></div>
      </div>
    </div>

    <div class="work">
      <p>{{ project.completedWorks }} Works Completed</p>
      <div :style="{ width: project.completedWorks + '%' }"></div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  project: {
    type: Object,
    required: true,
    default: () => ({
      title: '',
      startDate: '',
      endDate: '',
      status: '',
      budget: 0,
      income: 0,
      expense: 0,
      plannedProgress: 0,
      actualProgress: 0,
      completedWorks: 0
    })
  }
})
</script>

<style scoped>
.project-progress {
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.status {
  color: #888;
}

.budget {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.spending, .income, .expense {
  text-align: center;
}

.progress-bar {
  height: 10px;
  background-color: #ddd;
  border-radius: 5px;
  margin-bottom: 15px;
}

.progress {
  display: flex;
}

.planned {
  background-color: #4caf50;
  height: 100%;
  border-radius: 5px 0 0 5px;
}

.actual {
  background-color: #2196f3;
  height: 100%;
}

.work {
  display: flex;
  align-items: center;
}

.work div {
  height: 8px;
  background-color: #2196f3;
  border-radius: 4px;
}
</style>
