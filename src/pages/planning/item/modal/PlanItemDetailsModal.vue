<template>
  <Modal
      :show="show"
      :width="'85%'"
      :containerHeight="'70%'"
      :isShowFooter="false"
      @close="closeModal"
  >
    <template #header>
      <h4 class="modal-title">Construct Item Details</h4>
    </template>

    <template #body>
      <div class="modal-body-container">
        <PriceInputForm
            ref="childFormRef"
            :rules="rules"
            :total="totalAllPrice"
            :selectedRow="selectedRow"
        />
        <el-tabs v-model="activeTab">
          <!-- Công việc phụ thuộc -->
          <el-tab-pane :label="$t('planning.modal.el_pane.depen_work')" name="tasks">
            <DependencyTaskTable
                ref="depenFormRef"
                :rules="rules"
                :tasks="tasks"
                :selectedRow="selectedRow"
                @update-dependency="updateTaskDependencies"
            />
          </el-tab-pane>

          <!-- Tài nguyên -->
          <el-tab-pane :label="$t('planning.modal.el_pane.material')" name="materials">
            <ItemList
                ref="tableMaterialFormRef"
                :rules="rules"
                :selectData="materials"
                :resourceType="MATERIAL_RESOURCE"
                :tableData="getListResourceByType(selectedRow?.details, MATERIAL_RESOURCE)"
                :optionKeys="materialOptions"
                @update-list="updateListMaterials"
            />
          </el-tab-pane>

          <!-- Nhân lực -->
          <el-tab-pane :label="$t('planning.modal.el_pane.human')" name="users">
            <ItemList
                ref="tableHumanFormRef"
                :rules="rules"
                :is-human="true"
                :selectData="users"
                :resourceType="HUMAN_RESOURCE"
                :tableData="getListResourceByType(selectedRow?.details, HUMAN_RESOURCE)"
                :optionKeys="userOptions"
                @update-list="updateListUsers"
            />
          </el-tab-pane>

          <!-- Phương tiện -->
          <el-tab-pane :label="$t('planning.modal.el_pane.machine')" name="vehicles">
            <ItemList
                ref="tableMachineFormRef"
                :rules="rules"
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
import DependencyTaskTable2 from "@/pages/planning/item/modal/items/DependencyTaskTable2.vue";
import {HUMAN_RESOURCE, MACHINE_RESOURCE, MATERIAL_RESOURCE} from "@/constants/resource.js";
import {mixinMethods} from "@/utils/variables.js";

const props = defineProps({
  selectedRow: {type: Object, default: {}},
  show: {type: Boolean, default: false},
  materials: {type: Array, default: () => []},
  users: {type: Array, default: () => []},
  vehicles: {type: Array, default: () => []},
  tasks: {type: Array, default: () => []},
  rules: {
    type: Object,
    default: () => {
    }
  }
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

const closeModal = () => {
  emit("close");
}

const getListResourceByType = (list, type) => {
  if (!Array.isArray(list)) return [];
  return list.filter(item => item.resourceType === type);
}

const emit = defineEmits(["close", "submit"]);

const updateListMaterials = (listData) => {
  listSelectedMaterials.value = listData;
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

const tableMachineFormRef = ref(null);
const tableHumanFormRef = ref(null);
const tableMaterialFormRef = ref(null);
const depenFormRef = ref(null);
const childFormRef = ref(null);

const handleSubmit = async () => {
  let invalidForm = null; // To store the name of the invalid form
  let allValid = true; // Flag to track if all forms are valid

  // Validate each form and check for validity
  const formRefs = [
    { ref: childFormRef.value?.ruleFormRef, name: "Plan Information" },
    { ref: tableMaterialFormRef.value?.ruleFormRef, name: "Material Form" },
    { ref: tableMachineFormRef.value?.ruleFormRef, name: "Machine Form" },
    { ref: tableHumanFormRef.value?.ruleFormRef, name: "Human Form" }
  ];

  // Loop through each form and validate it
  for (const { ref, name } of formRefs) {
    const isValid = await mixinMethods.validateForm(ref);
    if (!isValid) {
      allValid = false;
      invalidForm = name;
      break; // Stop checking further forms once we find an invalid one
    }
  }

  if (allValid) {
    let data = {
      details: [
        ...listSelectedUsers.value,
        ...listSelectedVehicles.value,
        ...listSelectedMaterials.value,
      ],
      itemRelations: listTaskDependency.value,
      startDate: props.selectedRow.startDate,
      endDate: props.selectedRow.endDate,
    }
    emit("submit", data);
    listSelectedVehicles.value = [];
    listSelectedUsers.value = [];
    listSelectedVehicles.value = [];
    listSelectedMaterials.value = [];
    listTaskDependency.value = {};
  } else {
    // If any form is invalid, show a notification with the invalid form name
    mixinMethods.notifyError(`Validation failed in ${invalidForm}`);
  }
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
