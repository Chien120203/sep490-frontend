<template>
  <el-card class="construction-log-details">
    <SingleOptionSelect
        class="select-item"
        :optionKeys="{ id: 'taskIndex', value: 'TaskName' }"
        :listData="tasks"
        :isRemote="true"
        :placeholder="'Chọn công việc'"
        @handleSelectedParams="handleSelectTask"
        @remoteSearch="handleSearch"
    />

    <div v-for="(task, index) in groupedByTasks" :key="task.taskIndex">
      <el-divider content-position="left"></el-divider>
      <el-collapse v-model="activeCollapseItems">
        <div class="el-collapse-item-header">
          <div class="el-collapse-item-header-title">
            <h3>{{ task.TaskName ?? "-" }}</h3>
          </div>
          <div class="el-collapse-item-header-icon">
            <IconCircleClose class="close-icon" :width="15" :height="15" @click="handleDeleteLog(task.taskIndex)"/>
          </div>
        </div>
        <!-- Material -->
        <el-collapse-item name="1">
          <template #title>
            <h3>Vat Lieu</h3>
          </template>
          <ListItems
              ref="materialForm"
              :rules="rules"
              :taskIndex="task.taskIndex"
              :resourceType="MATERIAL_TYPE"
              :resources="logDetails.resources"
              :selectData="mockDataMaterials"
              :optionKeys="materialOptionKeys"
              :isExport="true"
              @remove-resource="handleRemoveResource"
          />
        </el-collapse-item>

        <!-- Employee -->
        <el-collapse-item name="2">
          <template #title>
            <h3>Nhan Cong</h3>
          </template>
          <ListItems
              ref="humanForm"
              :rules="rules"
              :taskIndex="task.taskIndex"
              :resourceType="HUMAN_TYPE"
              :resources="logDetails.resources"
              :selectData="mockDataEmployees"
              :optionKeys="userOptionKeys"
              :isExport="false"
              @remove-resource="handleRemoveResource"
          />
        </el-collapse-item>

        <!-- Vehicle -->
        <el-collapse-item name="3">
          <template #title>
            <h3>Phuong Tien</h3>
          </template>
          <ListItems
              ref="machineForm"
              :rules="rules"
              :taskIndex="task.taskIndex"
              :resourceType="MACHINE_TYPE"
              :resources="logDetails.resources"
              :selectData="mockDataVehicles"
              :optionKeys="vehicleOptionKeys"
              :isExport="false"
              @remove-resource="handleRemoveResource"
          />
        </el-collapse-item>
      </el-collapse>
    </div>
  </el-card>
</template>

<script setup>
import { ref } from 'vue';
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import ListItems from "@/pages/construction-log/items/details/ListItems.vue";
import IconCircleClose from "@/svg/IconCircleClose.vue";
import { HUMAN_TYPE, MACHINE_TYPE, MATERIAL_TYPE } from "@/constants/resource.js";

const props = defineProps({
  logDetails: {
    type: Object,
    default: () => {}
  },
  rules: {
    type: Object,
    default: () => {}
  }
});

const activeCollapseItems = ref(["1", "2", "3"]);

const groupedByTasks = ref(props.logDetails?.resources.reduce((acc, task) => {
  acc[task.taskIndex] = task;
  return acc;
}, {}));
const emit = defineEmits(["remove-resource"]);
const materialOptionKeys = ref({ id: 'resourceId', value: 'value' });
const userOptionKeys = ref({ id: 'resourceId', value: 'value' });
const vehicleOptionKeys = ref({ id: 'resourceId', value: 'value' });
const machineForm = ref(null);
const materialForm = ref(null);
const humanForm = ref(null);
defineExpose({
  machineForm,
  materialForm,
  humanForm
});
//mock data
const tasks = ref([
  { taskIndex: 1, TaskName: "Planning", Progress: 100 },
  { taskIndex: 2, TaskName: "Design", Progress: 86 }
]);
const mockDataMaterials = [
  { resourceId: "1", value: "Item A" },
  { resourceId: "2", value: "Item B" },
  { resourceId: "3", value: "Item C" },
];
const mockDataEmployees = [
  { resourceId: "E001", value: "John Doe" },
  { resourceId: "E002", value: "Jane Smith" },
  { resourceId: "E003", value: "Michael Johnson" },
];
const mockDataVehicles = [
  { resourceId: "V001", value: "Vehicle 1" },
  { resourceId: "V002", value: "Vehicle 2" },
  { resourceId: "V003", value: "Vehicle 3" },
];

// Handle Task Selection and Dynamically Add Task
const handleSelectTask = (id) => {
  const selectedTask = tasks.value.find(task => task.taskIndex === id);

  if (selectedTask) {
    if (!groupedByTasks.value[selectedTask.taskIndex]) {
      // Add selected task to grouped tasks if it doesn't exist yet
      groupedByTasks.value[selectedTask.taskIndex] = selectedTask;
    }
  }
};

// Handle Task Deletion
const handleDeleteLog = (taskIndex) => {
  delete groupedByTasks.value[taskIndex];
  emit("remove-task",  taskIndex);
};

const handleRemoveResource = (data) => {
  emit("remove-resource", data);
}

// Search Function (Empty for now)
const handleSearch = (value) => {
  console.log("Search value:", value);
};
</script>

<style scoped>
.construction-log-details {
  padding: 20px;
}

.close-icon {
  cursor: pointer;
}

.el-collapse-item-header {
  display: flex;
}

.el-collapse-item-header-title {
  width: 95%;
}

.el-collapse-item-header-icon {
  width: 5%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-details {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  align-items: center;
}
</style>