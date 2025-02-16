<template>
  <div class="task-list">
    <div class="header">
      <span class="title">{{ title }}</span>
      <span class="date">{{ date }}</span>
    </div>
    <div v-for="(task, index) in tasks" :key="index" class="task-item" :style="{ borderColor: task.color }">
      <div class="task-header" @click="toggleTask(index)">
        <span>{{ task.title }}</span>
        <span class="toggle-icon">{{ task.expanded ? '−' : '+' }}</span>
      </div>
      <div v-if="task.expanded" class="task-content">
        Nội dung của "{{ task.title }}" sẽ hiển thị ở đây.
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  props: {
    title: String,
    date: String,
    tasks: Array,
  },
  setup(props) {
    const tasks = ref([...props.tasks]); // Create a reactive copy of tasks

    onMounted(() => {
      if (tasks.value.length > 0) {
        tasks.value.map((task) => {task.expanded = true;});
      }
    });

    const toggleTask = (index) => {
      tasks.value[index].expanded = !tasks.value[index].expanded;
    };

    return {tasks, toggleTask};
  },
});
</script>

<style scoped>
.task-list {
  width: 300px;
  background: white;
  border-radius: 8px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: #008060;
  color: white;
  font-weight: bold;
  border-radius: 8px 8px 0 0;
}

.task-item {
  border-left: 4px solid;
  margin: 5px 0;
  padding: 5px;
  cursor: pointer;
  background: #f9f9f9;
  border-radius: 5px;
}

.task-header {
  display: flex;
  justify-content: space-between;
}

.task-content {
  padding: 10px;
  background: #eaeaea;
  margin-top: 5px;
}

.toggle-icon {
  font-weight: bold;
}
</style>
