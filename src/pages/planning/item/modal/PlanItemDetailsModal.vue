<template>
  <Modal
      :show="show"
      :width="'85%'"
      :containerHeight="'70%'"
      :isShowFooter="false"
      @close="closeModal"
  >
    <template #header>
      <h4 class="modal-title">{{ $t('planning.modal_title') }}</h4>
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
                ref="dependentFormRef"
                :rules="rules"
                :tasks="tasks"
                :selectedRow="selectedRow"
            />
          </el-tab-pane>

          <!-- Tài nguyên -->
          <el-tab-pane :label="$t('planning.modal.el_pane.material')" name="materials">
            <ItemList
                ref="tableMaterialFormRef"
                :rules="rules"
                :selectedRow="selectedRow"
                :selectData="materials"
                :resourceType="MATERIAL_RESOURCE"
                :tableData="listSelectedMaterials"
                :optionKeys="materialOptions"
                @update-value="calculateTotal"
            />
          </el-tab-pane>

          <!-- Nhân lực -->
          <el-tab-pane :label="$t('planning.modal.el_pane.human')" name="users">
            <ItemList
                ref="tableHumanFormRef"
                :rules="rules"
                :is-human="true"
                :selectedRow="selectedRow"
                :selectData="users"
                :resourceType="HUMAN_RESOURCE"
                :tableData="listSelectedUsers"
                :optionKeys="userOptions"
                @update-value="calculateTotal"
            />
          </el-tab-pane>

          <!-- Phương tiện -->
          <el-tab-pane :label="$t('planning.modal.el_pane.machine')" name="vehicles">
            <ItemList
                ref="tableMachineFormRef"
                :rules="rules"
                :selectData="vehicles"
                :selectedRow="selectedRow"
                :resourceType="MACHINE_RESOURCE"
                :tableData="listSelectedMachines"
                :optionKeys="vehicleOptions"
                @update-value="calculateTotal"
            />
          </el-tab-pane>
        </el-tabs>
      </div>

      <div class="modal-footer">
        <el-button class="btn btn-save" @click="handleSubmit">{{ $t('common.save') }}</el-button>
        <el-button class="btn btn-refuse" @click="$emit('close')">{{ $t('common.cancel') }}</el-button>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import {ref, defineProps, defineEmits, computed, reactive, watch, toRaw} from "vue";
import Modal from "@/components/common/Modal.vue";
import PriceInputForm from "@/pages/planning/item/modal/items/PriceInputForm.vue";
import ItemList from "@/pages/planning/item/modal/items/ItemList.vue";
import DependencyTaskTable from "@/pages/planning/item/modal/items/DependencyTaskTable.vue";
import {HUMAN_RESOURCE, MACHINE_RESOURCE, MATERIAL_RESOURCE} from "@/constants/resource.js";
import {mixinMethods} from "@/utils/variables.js";
import {useI18n} from "vue-i18n";

const props = defineProps({
  selectedRow: {type: Object, default: () => ({})},
  show: {type: Boolean, default: false},
  materials: {type: Array, default: () => []},
  users: {type: Array, default: () => []},
  vehicles: {type: Array, default: () => []},
  tasks: {type: Array, default: () => []},
  rules: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(["close", "submit"]);
const {t} = useI18n();

const activeTab = ref("tasks");
const tableMachineFormRef = ref(null);
const tableHumanFormRef = ref(null);
const tableMaterialFormRef = ref(null);
const dependentFormRef = ref(null);
const childFormRef = ref(null);
const materialOptions = ref({id: "id", value: "name"});
const userOptions = ref({id: "id", value: "name"});
const vehicleOptions = ref({id: "id", value: "name"});
const totalAllPrice = ref({
  machine: 0,
  labor: 0,
  material: 0,
  totalPrice: 0,
});

const getListResourceByType = (list, type) => {
  if (!Array.isArray(list)) return [];
  return list.filter(item => item.resourceType === type);
};

const listSelectedMachines = computed(() => getListResourceByType(props.selectedRow?.details, MACHINE_RESOURCE));
const listSelectedMaterials = computed(() => getListResourceByType(props.selectedRow?.details, MATERIAL_RESOURCE));
const listSelectedUsers = computed(() => getListResourceByType(props.selectedRow?.details, HUMAN_RESOURCE));
const calculateTotal = () => {
  const machine = listSelectedMachines.value?.reduce((pre, curr) => pre + (curr.quantity * curr.unitPrice || 0), 0) ?? 0;
  const labor = listSelectedUsers.value?.reduce((pre, curr) => pre + (curr.quantity * curr.unitPrice || 0), 0) ?? 0;
  const material = listSelectedMaterials.value?.reduce((pre, curr) => pre + (curr.quantity * curr.unitPrice || 0), 0) ?? 0;

  totalAllPrice.value = {
    machine: machine.toFixed(2),
    labor: labor.toFixed(2),
    material: material.toFixed(2),
    totalPrice: (machine + labor + material).toFixed(2),
  };
};

const closeModal = () => {
  activeTab.value = "tasks";
  totalAllPrice.value = {
    machine: 0,
    labor: 0,
    material: 0,
    totalPrice: 0,
  };
  emit("close");
};

const handleSubmit = async () => {
  let invalidForm = null; // To store the name of the invalid form
  let allValid = true; // Flag to track if all forms are valid
  const formRefs = [
    {ref: childFormRef.value?.ruleFormRef, name: t("planning.form_ref.planning_info")},
    {ref: tableMaterialFormRef.value?.ruleFormRef, name: t("planning.form_ref.material")},
    {ref: tableMachineFormRef.value?.ruleFormRef, name: t("planning.form_ref.machine")},
    {ref: tableHumanFormRef.value?.ruleFormRef, name: t("planning.form_ref.human")}
  ];

  for (const {ref, name} of formRefs) {
    const isValid = await mixinMethods.validateForm(ref);
    if (!isValid) {
      allValid = false;
      invalidForm = name;
      break; // Stop checking further forms once we find an invalid one
    }
  }
  if (allValid) {
    props.selectedRow.details = [
      ...listSelectedUsers.value,
      ...listSelectedMachines.value,
      ...listSelectedMaterials.value,
    ];
    emit("submit", props.selectedRow);
    emit("close");
  } else {
    mixinMethods.notifyError(t('planning.errors.invalid_form', {form: invalidForm}));
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
