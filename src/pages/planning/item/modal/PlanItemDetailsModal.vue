<template>
  <Modal
      :show="show"
      :width="'85%'"
      :containerHeight="'70%'"
      :isShowFooter="false"
      @close="$emit('close')"
  >
    <template #header>
      <h4 class="modal-title">Construct Item Details</h4>
    </template>

    <template #body>
      <div class="modal-body-container">
        <PriceInputForm :total="totalAllPrice" :selectedRow="selectedRow" />
        <el-tabs v-model="activeTab">
          <!-- Công việc phụ thuộc -->
          <el-tab-pane label="Công việc phụ thuộc" name="tasks">
            <SingleOptionSelect
                style="width: 30%"
                class="select-item"
                :optionKeys="dependencyOptions"
                :listData="tasks.filter(item => item.index !== selectedRow.index)"
                @handleSelectedParams="handleSelectTask"
            />
            <DependencyTaskTable :tasks="listTaskDependency" :isPlanning="true" @delete="handleRemoveDependency"/>
          </el-tab-pane>

          <!-- Tài nguyên -->
          <el-tab-pane label="Tài nguyên" name="materials">
            <ItemList
                :selectData="materials"
                :tableData="listSelectedMaterials"
                :optionKeys="materialOptions"
                @update-list="updateListMaterials"
            />
          </el-tab-pane>

          <!-- Nhân lực -->
          <el-tab-pane label="Nhân lực" name="users">
            <ItemList
                :selectData="users"
                :tableData="listSelectedUsers"
                :optionKeys="userOptions"
                @update-list="updateListUsers"
            />
          </el-tab-pane>

          <!-- Phương tiện -->
          <el-tab-pane label="Phương tiện" name="vehicles">
            <ItemList
                :selectData="vehicles"
                :tableData="listSelectedVehicles"
                :optionKeys="vehicleOptions"
                @update-list="updateListVehicles"
            />
          </el-tab-pane>
        </el-tabs>
      </div>

      <div class="modal-footer">
        <el-button class="btn btn-save" @click="handleSubmit">{{ $t("common.save") }}</el-button>
        <el-button class="btn btn-refuse" @click="$emit('close')">{{ $t("common.cancel") }}</el-button>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import {ref, defineProps, defineEmits, computed, onMounted, onUnmounted, watch, watchEffect} from "vue";
import Modal from "@/components/common/Modal.vue";
import PriceInputForm from "@/pages/planning/item/modal/items/PriceInputForm.vue";
import ItemList from "@/pages/planning/item/modal/items/ItemList.vue";
import DependencyTaskTable from "@/pages/progress/items/modal/items/progress-details/DependencyTaskTable.vue";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";

const props = defineProps({
  selectedRow: { type: Object, default: {} },
  show: { type: Boolean, default: false },
  materials: { type: Array, default: () => [] },
  users: { type: Array, default: () => [] },
  vehicles: { type: Array, default: () => [] },
  tasks: { type: Array, default: () => [] },
});

const materialOptions = ref({ id: "id", value: "name" });
const userOptions = ref({ id: "id", value: "name" });
const vehicleOptions = ref({ id: "id", value: "name" });
const dependencyOptions = ref({ id: "index", value: "workName" });
const listSelectedVehicles = ref( Array.isArray(props.selectedRow?.machines) ? props.selectedRow.machines : []);
const listSelectedMaterials = ref(Array.isArray(props.selectedRow?.materials) ? props.selectedRow.materials : []);
const listSelectedUsers = ref(Array.isArray(props.selectedRow?.users) ? props.selectedRow.users : []);
const listTaskDependency = ref(Array.isArray(props.selectedRow?.relations) ? props.selectedRow.relations : []);
const activeTab = ref("tasks"); // Default active tab

const totalAllPrice = computed(() => {
  const machine = listSelectedVehicles.value.reduce((pre, curr) => pre + (curr.quantity * curr.unitPrice || 0), 0);
  const labor = listSelectedUsers.value.reduce((pre, curr) => pre + (curr.quantity * curr.unitPrice || 0), 0);
  const material = listSelectedMaterials.value.reduce((pre, curr) => pre + (curr.quantity * curr.unitPrice || 0), 0);

  return {
    machine: machine.toFixed(2),
    labor: labor.toFixed(2),
    material: material.toFixed(2),
    totalPrice: (machine + labor + material).toFixed(2),
  };
});

watchEffect(() => {
  listSelectedVehicles.value = Array.isArray(props.selectedRow?.machines) ? props.selectedRow.machines : [];
  listSelectedMaterials.value = Array.isArray(props.selectedRow?.materials) ? props.selectedRow.materials : [];
  listSelectedUsers.value = Array.isArray(props.selectedRow?.users) ? props.selectedRow.users : [];
  listTaskDependency.value = Array.isArray(props.selectedRow?.relations) ? props.selectedRow.relations : [];
});

const emit = defineEmits(["close", "submit"]);

const handleSelectTask = (taskId) => {
  let task = props.tasks.find((task) => task.index === taskId && task.index !== props.selectedRow.index);
  if (!task) return;

  listTaskDependency.value.push({
    index: task.index,
    workName: task.workName,
    endDate: task.endDate,
    startDate: task.startDate,
    dependency: "",
  });
};

const handleRemoveDependency = (index) => {
  listTaskDependency.value = listTaskDependency.value.filter((task) => task.index !== index);
};

const updateListMaterials = (listData) => {
  listSelectedMaterials.value = listData;
};
const updateListUsers = (listData) => {
  listSelectedUsers.value = listData;
};
const updateListVehicles = (listData) => {
  listSelectedVehicles.value = listData;
};

const handleSubmit = () => {
  let data = {
    users: listSelectedUsers.value,
    machines: listSelectedVehicles.value,
    materials: listSelectedMaterials.value,
    relations: listTaskDependency.value,
  }
  emit("submit", data);
};
</script>

<style scoped>
.modal-footer {
  display: flex;
  justify-content: flex-end;
}

.modal-title {
  margin: 0;
}
.modal-body-container {
  min-height: 550px;
}
</style>
