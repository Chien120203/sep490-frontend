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
        <PriceInputForm :total="totalAllPrice" :selectedRow="selectedRow"/>
        <el-tabs v-model="activeTab">
          <!-- Công việc phụ thuộc -->
          <el-tab-pane label="Công việc phụ thuộc" name="tasks">
            <DependencyTaskTable
                :tasks="tasks"
                :selectedRow="selectedRow"
                @update-dependency="updateTaskDependencies"
            />
          </el-tab-pane>

          <!-- Tài nguyên -->
          <el-tab-pane label="Tài nguyên" name="materials">
            <ItemList
                :selectData="materials"
                :resourceType="MATERIAL_RESOURCE"
                :tableData="getListResourceByType(selectedRow?.details, MATERIAL_RESOURCE)"
                :optionKeys="materialOptions"
                @update-list="updateListMaterials"
            />
          </el-tab-pane>

          <!-- Nhân lực -->
          <el-tab-pane label="Nhân lực" name="users">
            <ItemList
                :selectData="users"
                :resourceType="HUMAN_RESOURCE"
                :tableData="getListResourceByType(selectedRow?.details, HUMAN_RESOURCE)"
                :optionKeys="userOptions"
                @update-list="updateListUsers"
            />
          </el-tab-pane>

          <!-- Phương tiện -->
          <el-tab-pane label="Phương tiện" name="vehicles">
            <ItemList
                :selectData="vehicles"
                :resourceType="MACHINE_RESOURCE"
                :tableData="getListResourceByType(selectedRow?.details, MACHINE_RESOURCE)"
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
import {ref, defineProps, defineEmits, computed, watchEffect, reactive} from "vue";
import Modal from "@/components/common/Modal.vue";
import PriceInputForm from "@/pages/planning/item/modal/items/PriceInputForm.vue";
import ItemList from "@/pages/planning/item/modal/items/ItemList.vue";
import DependencyTaskTable from "@/pages/planning/item/modal/items/DependencyTaskTable.vue";
import {HUMAN_RESOURCE, MACHINE_RESOURCE, MATERIAL_RESOURCE} from "@/constants/resource.js";

const props = defineProps({
  selectedRow: {type: Object, default: {}},
  show: {type: Boolean, default: false},
  materials: {type: Array, default: () => []},
  users: {type: Array, default: () => []},
  vehicles: {type: Array, default: () => []},
  tasks: {type: Array, default: () => []},
});

const materialOptions = ref({id: "id", value: "name"});
const userOptions = ref({id: "id", value: "name"});
const vehicleOptions = ref({id: "id", value: "name"});
const listSelectedVehicles = ref([]);
const listSelectedMaterials = ref([]);
const listSelectedUsers = ref([]);
const listTaskDependency = ref({});
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

const getListResourceByType = (list, type) => {
  if (!Array.isArray(list)) return [];
  return list.filter(item => item.resourceType === type);
}

const emit = defineEmits(["close", "submit"]);

const updateListMaterials = (listData) => {
  listSelectedMaterials.value = listData;
  console.log(props.selectedRow);
};
const updateListUsers = (listData) => {
  listSelectedUsers.value = listData;
};
const updateListVehicles = (listData) => {
  listSelectedVehicles.value = listData;
};
const updateTaskDependencies = (dependencies) => {
  listTaskDependency.value = dependencies.itemRelations;
};

const handleSubmit = () => {
  let data = {
    details: [
      ...listSelectedUsers.value,
      ...listSelectedVehicles.value,
      ...listSelectedMaterials.value,
    ],
    itemRelations: listTaskDependency.value,
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
