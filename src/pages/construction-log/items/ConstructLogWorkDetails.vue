<template>
  <el-card class="construction-log-details">
    <SingleOptionSelect
        class="select-item"
        :defaultList="selectedRow"
        :is-disabled="!allowEdit"
        :optionKeys="{ id: 'index', value: 'workName' }"
        :listData="listProgressItems"
        :isRemote="true"
        :showClearable="true"
        :placeholder="'Chọn công việc'"
        @handleSelectedParams="handleSelectTask"
        @remoteSearch="handleSearch"
    />
    <div v-for="(task, id) in groupedByTasks" :key="task.id">
      <el-divider content-position="left"></el-divider>
      <el-collapse v-model="activeCollapseItems">
        <div class="el-collapse-item-header">
          <div class="el-collapse-item-header-title">
            <h3>{{ getTaskInfo(task.taskIndex)?.workName || "-" }}</h3>
          </div>
          <div class="el-collapse-item-header-icon">
            <IconCircleClose class="close-icon" :width="15" :height="15" @click="handleDeleteLog(task.taskIndex)"/>
          </div>
        </div>
        <div class="">
          <el-form
              ref="workAmountForm"
              :model="{listWorkAmount}"
              :disabled="!allowEdit"
              :rules="rules"
              label-position="top"
              class="form-amount-box"
          >
            <el-form-item class="work-amount-item">
              <template #label>
                <span class="label-start">Khối lượng dự kiến</span>
              </template>
              <el-input disabled v-model.number="getTaskInfo(task.taskIndex).quantity" type="number" placeholder="Nhập khối lượng dự kiến" />
            </el-form-item>

            <el-form-item class="work-amount-item" label="Khối lượng thực tế" :prop="`listWorkAmount.${task.id}.workAmount`" :rules="rules.workAmount.map(rule => ({ ...rule, task: task}))">
              <el-input-number style="width: 100%" v-model.number="listWorkAmount[task.id].workAmount" :min="0" :max="getTaskInfo(task.taskIndex).quantity - getTaskInfo(task.taskIndex).usedQuantity" type="number" placeholder="Nhập khối lượng thực tế" />
            </el-form-item>

            <el-form-item class="work-amount-item" label="Khối lượng hoàn thành" >
              <el-input disabled :value="getTaskInfo(task.taskIndex).usedQuantity" type="number" placeholder="Nhập khối hoàn thành" />
            </el-form-item>

            <el-form-item class="work-amount-item" label="Khối lượng còn lại" prop="remaining">
              <el-input disabled :value="getTaskInfo(task.taskIndex).quantity - getTaskInfo(task.taskIndex).usedQuantity - listWorkAmount[id].workAmount" type="number" placeholder="Nhập khối lượng còn lại" />
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
              :taskId="task.id"
              :allowEdit="allowEdit"
              :resourceType="MATERIAL_TYPE"
              :resources="logDetails.resources"
              :selectData="getListResourcesByType(task, MATERIAL_TYPE)"
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
              :taskId="task.id"
              :allowEdit="allowEdit"
              :resourceType="HUMAN_TYPE"
              :resources="logDetails.resources"
              :selectData="getListResourcesByType(task, HUMAN_TYPE)"
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
              :taskId="task.id"
              :allowEdit="allowEdit"
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
import {DONE_PROGRESS} from "@/constants/progress.js";

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
  },
  allowEdit: {
    type: Boolean,
    default: false
  }
});
const hasChildren = (parent) => props.progressDtls.progressItems.some(child => child.parentIndex === parent.index);

const listProgressItems = computed(() => props.progressDtls.progressItems?.filter(item => !hasChildren(item) && item.progress !== DONE_PROGRESS && !groupedByTasks.value[item.id])) || [];

const listWorkAmount = ref({});
watch(() => props.logDetails?.workAmount, (newVal) => {
  const result = {};
  newVal?.forEach(item => {
    result[item.id] = item;
  });
  listWorkAmount.value = result;
}, { immediate: true, deep: true });

const activeCollapseItems = ref(["1", "2", "3"]);
const groupedByTasks = computed(() => {
  return props.logDetails?.workAmount?.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});
});

const emit = defineEmits(["remove-resource", "remove-task"]);
const materialOptionKeys = ref({id: "id", value: "name"});
const userOptionKeys = ref({id: "id", value: "name"});
const vehicleOptionKeys = ref({id: "id", value: "name"});
const selectedRow = ref(null);
const machineForm = ref([]);
const materialForm = ref([]);
const humanForm = ref([]);
const workAmountForm = ref([]);
defineExpose({
  machineForm,
  materialForm,
  humanForm,
  workAmountForm
});

const getTaskInfo = (id) => {
  return props.progressDtls.progressItems.find(task => task.index === id);
}

// Handle Task Selection and Dynamically Add Task
const handleSelectTask = (id) => {
  selectedRow.value = id;
  const selectedTask = getTaskInfo(id);
  props.logDetails.workAmount.push({id: selectedTask.id, taskIndex: id, workAmount: 0});
  if (selectedTask) {
    if (!groupedByTasks.value[selectedTask.id]) {
      // Add selected task to grouped tasks if it doesn't exist yet
      groupedByTasks.value[selectedTask.id] = {taskIndex: selectedTask.index, ...selectedTask};
    }
  }
};

const getListResourcesByType = (task, type) => {
  const listResourceItems = props.progressDtls.progressItems.find(
      item => item.index === task.taskIndex
  );

  if (!listResourceItems) return [];

  return listResourceItems.details
      .filter(item => item.resourceType === type)
      .map(item => ({
        id: item.resourceId,
        unit: item.unit,
        plannedQuantity: item.quantity,
        usedQuantity: item.usedQuantity,
        name: item.resource.name,
        type: item.resource.type
      }));
};

// Handle Task Deletion
const handleDeleteLog = (index) => {
  selectedRow.value = null;
  const selectedTask = getTaskInfo(index);
  delete groupedByTasks.value[selectedTask.id];
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
  width: 20%;
}

.progress-details {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  align-items: center;
}
</style>