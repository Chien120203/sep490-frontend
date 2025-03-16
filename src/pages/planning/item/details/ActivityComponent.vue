<template>
  <div class="activity-container">
    <el-steps align-center>
      <el-step v-for="(value) in statuses" :title="value.title" :description="value.description" :status="value.status"/>
    </el-steps>

    <div class="activity-timeline">
      <div class="activity-date" v-if="activities.length">
        <span class="date">{{ activities[0].date }}</span>
      </div>

      <div v-for="(activity, index) in activities" :key="index" class="activity-item">
        <div class="icon" :class="activity.type">{{ activity.icon }}</div>
        <div class="activity-content">
          <span class="username">{{ activity.username }}</span>
          <span class="text">{{ activity.text }}</span>
        </div>
        <div class="time">{{ activity.time }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ActivityComponent",
  props: {
    statuses: {
      type: Array,
      required: true, // Example: ['Khởi tạo', 'Đang xử lý', 'Hoàn thành']
    },
    currentStep: {
      type: Number,
      required: true, // Example: 1 (means second step is active)
    },
    activities: {
      type: Array,
      required: true, // Example: [{ username: 'Trần Văn Bằng', text: 'đã cập nhật kế hoạch thi công', time: '14:36', icon: '✏️', type: 'edit', date: '23/05/2024' }]
    },
  },
};
</script>

<style scoped>
.activity-container {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.activity-timeline {
  margin-top: 16px;
}

.activity-date {
  font-weight: bold;
  background: #4caf50;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
}

.activity-item {
  display: flex;
  align-items: center;
  background: #f9f9f9;
  margin-top: 8px;
  padding: 8px;
  border-radius: 4px;
}

.icon {
  font-size: 18px;
  margin-right: 8px;
}

.icon.edit {
  color: blue;
}

.icon.add {
  color: green;
}

.activity-content {
  flex: 1;
}

.username {
  font-weight: bold;
  color: #009688;
}

.time {
  font-size: 12px;
  color: #777;
}
</style>
