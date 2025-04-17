<template>
  <el-card class="construction-log-details">
    <SingleOptionSelect
        class="select-item"
        :defaultList="selectedRow"
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
        <div class="">
          <el-form
              ref="workAmountForm"
              :model="{listWorkAmount}"
              :rules="rules"
              label-position="top"
              class="form-amount-box"
          >
            <el-form-item class="work-amount-item">
              <template #label>
                <span class="label-start">Khối lượng dự kiến</span>
              </template>
              <el-input disabled v-model.number="task.expectedAmount" type="number" placeholder="Nhập khối lượng dự kiến" />
            </el-form-item>

            <el-form-item class="work-amount-item" label="Khối lượng thực tế" :prop="`listWorkAmount.${index}.workAmount`" :rules="rules.workAmount.map(rule => ({ ...rule, task: task}))">
              <el-input-number style="width: 100%" v-model.number="listWorkAmount[index].workAmount" :min="0" type="number" placeholder="Nhập khối lượng thực tế" />
            </el-form-item>

            <el-form-item class="work-amount-item" label="Khối lượng còn lại" prop="remaining">
              <el-input disabled :value="task.expectedAmount - listWorkAmount[index].workAmount" type="number" placeholder="Nhập khối lượng còn lại" />
            </el-form-item>
          </el-form>
        </div>
        <!-- Material -->
        <el-collapse-item :name="task.taskIndex + '-1'">
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
        <el-collapse-item :name="task.taskIndex + '-2'">
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
        <el-collapse-item :name="task.taskIndex + '-3'">
          <template #title>
            <h3>Phuong Tien</h3>
          </template>
          <ListItems
              ref="machineForm"
              :rules="rules"
              :taskIndex="task.taskIndex"
              :resourceType="MACHINE_TYPE"
              :resources="logDetails.resources"
              :selectData="listMachineResources.value"
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
import {computed, onMounted, ref} from 'vue';
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import ListItems from "@/pages/construction-log/items/details/ListItems.vue";
import IconCircleClose from "@/svg/IconCircleClose.vue";
import { HUMAN_TYPE, MACHINE_TYPE, MATERIAL_TYPE } from "@/constants/resource.js";
import {useHumanResourcesStore} from "@/store/human-resources.js";
import {useMachineResourcesStore} from "@/store/machine-resources.js";
import {useMaterialResourcesStore} from "@/store/material-resources.js";

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
const listWorkAmount = computed(() => props.logDetails.workAmount.reduce((acc, item) => {
  acc[item.taskIndex] = item
  return acc
}, {}));
const activeCollapseItems = ref(["1", "2", "3"]);
const groupedByTasks = ref(props.logDetails?.resources.reduce((acc, task) => {
  acc[task.taskIndex] = task;
  return acc;
}, {}));
const emit = defineEmits(["remove-resource", "remove-task"]);
const materialOptionKeys = ref({id: "id", value: "materialCode"});
const userOptionKeys = ref({id: "id", value: "teamName"});
const vehicleOptionKeys = ref({id: "id", value: "chassisNumber"});
const selectedRow = ref(null);
const machineForm = ref(null);
const materialForm = ref(null);
const humanForm = ref(null);
const workAmountForm = ref(null);
defineExpose({
  machineForm,
  materialForm,
  humanForm,
  workAmountForm
});
const humanStore = useHumanResourcesStore();
const machineStore = useMachineResourcesStore();
const materialStore = useMaterialResourcesStore();
const {listHumanResources, getListHumanResources} = humanStore;
const {listMachineResources, getListMachineResources} = machineStore;
const {listMaterialResources, getListMaterialResources} = materialStore;

onMounted(async () => {
  await getListHumanResources({pageIndex: 1}, false);
  await getListMachineResources({pageIndex: 1}, false);
  await getListMaterialResources({pageIndex: 1}, false);
});
//mock data
const tasks = ref([
  { taskIndex: 3, TaskName: "Planning", Progress: 100, expectedAmount: 20 },
  { taskIndex: 4, TaskName: "Design", Progress: 86, expectedAmount: 20 }
]);
const mockDataMaterials = [
  { id: "1", materialCode: "Item A" },
  { id: "2", materialCode: "Item B" },
  { id: "3", materialCode: "Item C" },
];
const mockDataEmployees = [
  { id: "E001", teamName: "John Doe" },
  { id: "E002", teamName: "Jane Smith" },
  { id: "E003", teamName: "Michael Johnson" },
];

// Handle Task Selection and Dynamically Add Task
const handleSelectTask = (id) => {
  selectedRow.value = id;
  const selectedTask = tasks.value.find(task => task.taskIndex === id);
  props.logDetails.workAmount.push({taskIndex: id, workAmount: 0});
  if (selectedTask) {
    if (!groupedByTasks.value[selectedTask.taskIndex]) {
      // Add selected task to grouped tasks if it doesn't exist yet
      groupedByTasks.value[selectedTask.taskIndex] = selectedTask;
    }
  }
};

// Handle Task Deletion
const handleDeleteLog = (taskIndex) => {
  selectedRow.value = null;
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

.form-amount-box {
  display: flex;
  justify-content: space-evenly;
}

.work-amount-item {
  width: 30%;
}

.progress-details {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  align-items: center;
}
</style>