<template>
  <el-card class="construction-log-details">
    <SingleOptionSelect
        class="select-item"
        :defaultList="selectedRow"
        :optionKeys="{ id: 'index', value: 'workName' }"
        :listData="progressDtls.progressItems"
        :isRemote="true"
        :showClearable="true"
        :placeholder="'Chọn công việc'"
        @handleSelectedParams="handleSelectTask"
        @remoteSearch="handleSearch"
    />

    <div v-for="(task, index) in groupedByTasks" :key="task.index">
      <el-divider content-position="left"></el-divider>
      <el-collapse v-model="activeCollapseItems">
        <div class="el-collapse-item-header">
          <div class="el-collapse-item-header-title">
            <h3>{{ task.workName ?? "-" }}</h3>
          </div>
          <div class="el-collapse-item-header-icon">
            <IconCircleClose class="close-icon" :width="15" :height="15" @click="handleDeleteLog(task.index)"/>
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
              <el-input disabled v-model.number="task.quantity" type="number" placeholder="Nhập khối lượng dự kiến" />
            </el-form-item>

            <el-form-item class="work-amount-item" label="Khối lượng thực tế" :prop="`listWorkAmount.${index}.workAmount`" :rules="rules.workAmount.map(rule => ({ ...rule, task: task}))">
              <el-input-number style="width: 100%" v-model.number="listWorkAmount[index].workAmount" :min="0" type="number" placeholder="Nhập khối lượng thực tế" />
            </el-form-item>

            <el-form-item class="work-amount-item" label="Khối lượng còn lại" prop="remaining">
              <el-input disabled :value="task.quantity - listWorkAmount[index].workAmount" type="number" placeholder="Nhập khối lượng còn lại" />
            </el-form-item>
          </el-form>
        </div>
        <!-- Material -->
        <el-collapse-item :name="task.index + '-1'">
          <template #title>
            <h3>Vat Lieu</h3>
          </template>
          <ListItems
              ref="materialForm"
              :rules="rules"
              :taskIndex="task.index"
              :resourceType="MATERIAL_TYPE"
              :resources="logDetails.resources"
              :selectData="getListResourcesByType(task, MATERIAL_TYPE)"
              :optionKeys="materialOptionKeys"
              :isExport="true"
              @remove-resource="handleRemoveResource"
          />
        </el-collapse-item>

        <!-- Employee -->
        <el-collapse-item :name="task.index + '-2'">
          <template #title>
            <h3>Nhan Cong</h3>
          </template>
          <ListItems
              ref="humanForm"
              :rules="rules"
              :taskIndex="task.index"
              :resourceType="HUMAN_TYPE"
              :resources="logDetails.resources"
              :selectData="getListResourcesByType(task, HUMAN_TYPE)"
              :optionKeys="userOptionKeys"
              :isExport="false"
              @remove-resource="handleRemoveResource"
          />
        </el-collapse-item>

        <!-- Vehicle -->
        <el-collapse-item :name="task.index + '-3'">
          <template #title>
            <h3>Phuong Tien</h3>
          </template>
          <ListItems
              ref="machineForm"
              :rules="rules"
              :taskIndex="task.index"
              :resourceType="MACHINE_TYPE"
              :resources="logDetails.resources"
              :selectData="getListResourcesByType(task, MACHINE_TYPE)"
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
import {computed, onMounted, ref, watch} from 'vue';
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import ListItems from "@/pages/construction-log/items/details/ListItems.vue";
import IconCircleClose from "@/svg/IconCircleClose.vue";
import { HUMAN_TYPE, MACHINE_TYPE, MATERIAL_TYPE } from "@/constants/resource.js";

const props = defineProps({
  logDetails: {
    type: Object,
    default: () => {}
  },
  progressDtls: {
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
  acc[task.index] = task;
  return acc;
}, {}));
const emit = defineEmits(["remove-resource", "remove-task"]);
const materialOptionKeys = ref({id: "id", value: "name"});
const userOptionKeys = ref({id: "id", value: "name"});
const vehicleOptionKeys = ref({id: "id", value: "name"});
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

// Handle Task Selection and Dynamically Add Task
const handleSelectTask = (id) => {
  selectedRow.value = id;
  const selectedTask = props.progressDtls.progressItems.find(task => task.index === id);
  props.logDetails.workAmount.push({taskIndex: id, workAmount: 0});
  if (selectedTask) {
    if (!groupedByTasks.value[selectedTask.index]) {
      // Add selected task to grouped tasks if it doesn't exist yet
      groupedByTasks.value[selectedTask.index] = selectedTask;
    }
  }
};

const getListResourcesByType = (task, type) =>
    task.details
        .filter(({ resource }) => resource.type === type)
        .map(({ unit, quantity, resource }) => ({
          unit,
          plannedQuantity: quantity,
          ...resource,
        }));

// Handle Task Deletion
const handleDeleteLog = (index) => {
  selectedRow.value = null;
  delete groupedByTasks.value[index];
  emit("remove-task",  index);
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