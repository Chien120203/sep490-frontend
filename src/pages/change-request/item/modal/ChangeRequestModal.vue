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
            :allowEdit="allowEdit"
            :total="totalAllPrice"
            :selectedRow="selectedRow"
        />
        <el-tabs v-model="activeTab">
          <!-- Công việc phụ thuộc -->
          <el-tab-pane :label="$t('planning.modal.el_pane.depen_work')" name="tasks">
            <DependencyTaskTable
                ref="dependentFormRef"
                :allowEdit="allowEdit"
                :rules="rules"
                :tasks="tasks"
                :selectedRow="selectedRow"
            />
          </el-tab-pane>

          <!-- Tài nguyên -->
          <el-tab-pane v-if="!hasChildren" :label="$t('planning.modal.el_pane.material')" name="materials">
            <ItemList
                ref="tableMaterialFormRef"
                :rules="rules"
                :allowEdit="allowEdit"
                :selectedRow="selectedRow"
                :selectData="materials"
                :resourceType="MATERIAL_TYPE"
                :tableData="listSelectedMaterials"
                :optionKeys="materialOptions"
                @search="handleSearch"
                @update-value="calculateTotal"
            />
          </el-tab-pane>

          <!-- Nhân lực -->
          <el-tab-pane v-if="!hasChildren" :label="$t('planning.modal.el_pane.human')" name="users">
            <ItemList
                ref="tableHumanFormRef"
                :rules="rules"
                :is-human="true"
                :allowEdit="allowEdit"
                :selectedRow="selectedRow"
                :selectData="users"
                :resourceType="HUMAN_TYPE"
                :tableData="listSelectedUsers"
                @search="handleSearch"
                :optionKeys="userOptions"
                @update-value="calculateTotal"
            />
          </el-tab-pane>

          <!-- Phương tiện -->
          <el-tab-pane v-if="!hasChildren" :label="$t('planning.modal.el_pane.machine')" name="vehicles">
            <ItemList
                ref="tableMachineFormRef"
                :is-human="true"
                :rules="rules"
                :allowEdit="allowEdit"
                :selectData="vehicles"
                :selectedRow="selectedRow"
                :resourceType="MACHINE_TYPE"
                :tableData="listSelectedMachines"
                @search="handleSearch"
                :optionKeys="vehicleOptions"
                @update-value="calculateTotal"
            />
          </el-tab-pane>
        </el-tabs>
      </div>

      <div class="modal-footer">
        <el-button v-if="allowEdit" class="btn btn-save" @click="handleSubmit">{{ $t('common.save') }}</el-button>
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
import {
  HUMAN_RESOURCE,
  HUMAN_TYPE,
  MACHINE_RESOURCE,
  MACHINE_TYPE,
  MATERIAL_RESOURCE,
  MATERIAL_TYPE
} from "@/constants/resource.js";
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
  },
  allowEdit: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["close", "submit", "search"]);
const {t} = useI18n();

const activeTab = ref("tasks");
const tableMachineFormRef = ref(null);
const tableHumanFormRef = ref(null);
const tableMaterialFormRef = ref(null);
const dependentFormRef = ref(null);
const childFormRef = ref(null);
const materialOptions = ref({id: "id", value: "materialName"});
const userOptions = ref({id: "id", value: "teamName"});
const vehicleOptions = ref({id: "id", value: "chassisNumber"});
const totalAllPrice = ref({
  machine: 0,
  labor: 0,
  material: 0,
  totalPrice: 0,
});
const hasChildren = computed(() => props.tasks.some(child => child.parentIndex === props.selectedRow.index && !child.deleted));

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

const handleSearch = (data) => {
  emit("search", data)
}

const closeModal = () => {
  totalAllPrice.value = {
    machine: 0,
    labor: 0,
    material: 0,
    totalPrice: 0,
  };
  activeTab.value = "tasks"
  emit("close");
};

const handleSubmit = async () => {
  const forms = hasChildren.value ? [
    {
      ref: dependentFormRef,
      name: t("planning.form_ref.dependency"),
    },
    {
      ref: childFormRef,
      name: t("planning.form_ref.planning_info"),
    }
  ] : [
    {
      ref: dependentFormRef,
      name: t("planning.form_ref.dependency"),
    },
    {
      ref: childFormRef,
      name: t("planning.form_ref.planning_info"),
    },
    {
      ref: tableMaterialFormRef,
      name: t("planning.form_ref.material"),
    },
    {
      ref: tableMachineFormRef,
      name: t("planning.form_ref.machine"),
    },
    {
      ref: tableHumanFormRef,
      name: t("planning.form_ref.human"),
    },
  ];

  for (const form of forms) {
    const isValid = await new Promise((resolve) => {
      form.ref.value?.ruleFormRef.validate((valid) => resolve(valid));
    });

    if (!isValid) {
      mixinMethods.notifyError(
          t("planning.errors.invalid_form", { form: form.name })
      );
      return; // stop here if one form is invalid
    }
  }

  // ✅ All forms are valid — proceed with submission
  props.selectedRow.details = [
    ...listSelectedUsers.value,
    ...listSelectedMachines.value,
    ...listSelectedMaterials.value,
  ];

  emit("submit", props.selectedRow);
  emit("close");
  activeTab.value = "tasks"
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
