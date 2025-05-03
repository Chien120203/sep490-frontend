<template>
  <Modal
      :show="show"
      :width="'85%'"
      :containerHeight="'70%'"
      :isShowFooter="true"
      @close="$emit('close')"
  >
    <template #header>
      <h4 class="modal-title">{{ $t('allocation.modal.title') }}</h4>
    </template>

    <template #body>
      <div class="modal-body-container">
        <AllocateFormInfo
            ref="formAllocationInfo"
            :rules="ALLOCATIONFORMINFO_RULES"
            :data="data"
            :listProjects="listProjects"
            :allowEdit="allowSave"
            :progressDetails="progressDetails"
            @searchProject="handleSearchProjects"
            @searchTask="handleSearchTask"
        />
        <label class="error-feedback" v-if="listSelectedMaterials.length <= 0 && listSelectedUsers.length <= 0 && listSelectedVehicles.length <= 0">
          {{ $t('E-RR-FE-002') }}
        </label>
        <el-tabs v-model="activeTab">
          <!-- Tài nguyên -->
          <el-tab-pane :label="$t('allocation.modal.materials')" name="materials">
            <ItemList
                ref="formAllocationMaterialInfos"
                :rules="ALLOCATION_FORM_ITEMS_RULES"
                :selectData="materials"
                :progressDetails="progressDetails"
                :resourceType="MATERIAL_TYPE"
                :data="data"
                :allowEdit="allowSave"
                :tableData="listSelectedMaterials"
                :optionKeys="materialOptions"
                @update-list="updateListMaterials"
            />
          </el-tab-pane>

          <!-- Nhân lực -->
          <el-tab-pane :label="$t('allocation.modal.users')" name="users">
            <ItemList
                ref="formAllocationHumanInfos"
                :rules="ALLOCATION_FORM_ITEMS_RULES"
                :selectData="listEmployees"
                :progressDetails="progressDetails"
                :allowEdit="allowSave"
                :resourceType="HUMAN_TYPE"
                :data="data"
                :tableData="listSelectedUsers"
                :optionKeys="userOptions"
                @update-list="updateListUsers"
            />
          </el-tab-pane>

          <!-- Phương tiện -->
          <el-tab-pane :label="$t('allocation.modal.vehicles')" name="vehicles">
            <ItemList
                ref="formAllocationVehicleInfos"
                :rules="ALLOCATION_FORM_ITEMS_RULES"
                :selectData="listVehicles"
                :progressDetails="progressDetails"
                :allowEdit="allowSave"
                :resourceType="MACHINE_TYPE"
                :data="data"
                :tableData="listSelectedVehicles"
                :optionKeys="vehicleOptions"
                @update-list="updateListVehicles"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </template>
    <template #footer>
      <div class="modal-footer">
        <el-button v-if="allowSave" class="btn btn-save" @click="handleSubmit">{{ $t("common.save") }}</el-button>
        <el-button v-if="allowApprove(data)" @click="$emit('changeStatus', {id: data.id, type: 'approve'})" type="success" class="btn btn-save">
          {{ $t("common.approve") }}
        </el-button>
        <el-button v-if="allowReject(data.status)" @click="$emit('changeStatus', {id: data.id, type: 'reject'})" class="btn btn-refuse">
          {{ $t("common.reject") }}
        </el-button>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import {computed, defineProps, onMounted, ref, watch, watchEffect} from "vue";
import Modal from "@/components/common/Modal.vue";
import ItemList from "@/pages/resource-allocation/items/modal/ItemList.vue";
import {
  HUMAN_TYPE,
  MACHINE_TYPE,
  MATERIAL_TYPE
} from "@/constants/resource.js";
import AllocateFormInfo from "@/pages/resource-allocation/items/modal/AllocateFormInfo.vue";
import {useInventoryStore} from "@/store/inventory.js";
import {
  DRAFT_STATUS, MANAGER_APPROVED,
  PROJECT_TO_PROJECT,
  PROJECT_TO_TASK,
  TASK_TO_TASK,
  WAIT_MANAGER_APPROVE
} from "@/constants/allocation.js";
import {usePersistenceStore} from "@/store/persistence.js";
import {RESOURCE_TYPE_MATERIALS, RESOURCE_TYPE_USERS, RESOURCE_TYPE_VEHICLES} from "@/constants/mobilization.js";
import {EXECUTIVE_BOARD, RESOURCE_MANAGER, TECHNICAL_MANAGER} from "@/constants/roles.js";
import {mixinMethods} from "@/utils/variables.js";
import { getAllocationResourceItemRules } from "@/rules/allocation";

const props = defineProps({
  show: {type: Boolean, default: false},
  data: {type: Object, default: () => ({})},
  progressDetails: {type: Object, default: () => ({})},
  listProjects: {type: Array, default: () => []},
});

const inventoryStore = useInventoryStore();
const persist = usePersistenceStore();

const {
  inventoryData,
  getListInventory
} = inventoryStore;
const { projectId } = persist;
const emit = defineEmits(["close", "submit", "searchProjects", "searchTask", "changeStatus"]);
const listSelectedVehicles = ref([]);
const listSelectedMaterials = ref([]);
const listSelectedUsers = ref([]);
const allowSave = computed(() => localStorage.getItem('role') === RESOURCE_MANAGER && props.data.status === DRAFT_STATUS);
watch(() => props.data.resourceAllocationDetails, (data) => {
  if (data) {
    let listUsers = [];
    let listVehicles = [];
    let listMaterials = [];

    data.forEach(item => {
      switch(item.resourceType) {
        case RESOURCE_TYPE_MATERIALS:
          listMaterials.push(item);
          break;
        case RESOURCE_TYPE_VEHICLES:
          listVehicles.push(item);
          break;
        case RESOURCE_TYPE_USERS:
          listUsers.push(item);
          break;
      }
    })

    updateListMaterials(listMaterials);
    updateListUsers(listUsers);
    updateListVehicles(listVehicles);
  }
}, { deep: true });

watch(() => props.data.requestType, (newVal) => {
  switch (newVal) {
    case PROJECT_TO_TASK || PROJECT_TO_PROJECT:
      getListInventory({projectId: projectId.value, pageIndex: 1, pageSize: 20}, false);
      break;
  }
});

onMounted(() => {
  getListInventory({projectId: projectId.value, pageIndex: 1, pageSize: 20}, false);
})

const materialOptions = ref({id: "resourceId", value: "name"});
const userOptions = ref({id: "resourceId", value: "name"});
const vehicleOptions = ref({id: "resourceId", value: "name"});
const activeTab = ref("materials");
const currentRole = ref(localStorage.getItem("role"));

const ALLOCATION_FORM_ITEMS_RULES = getAllocationResourceItemRules();

const allowApprove = (row) => {
  if(row.status === WAIT_MANAGER_APPROVE && currentRole.value === TECHNICAL_MANAGER) return true;
  return row.status === MANAGER_APPROVED && currentRole.value === EXECUTIVE_BOARD;
}

const allowReject = (status) => {
  return (status === WAIT_MANAGER_APPROVE && currentRole.value === TECHNICAL_MANAGER) || (status === MANAGER_APPROVED && currentRole.value === EXECUTIVE_BOARD);
}

const materials = computed(() => {
  const requestType = props.data.requestType;
  const fromTaskId = props.data.fromTaskId; // directly access it so Vue tracks it

  if (requestType === PROJECT_TO_TASK || requestType === PROJECT_TO_PROJECT) {
    return inventoryData.value
        .filter(item => item.resourceType === MATERIAL_TYPE);
  }

  if (requestType === TASK_TO_TASK && fromTaskId) {
    const progressItem = props.progressDetails.progressItems.find(item => item.id === fromTaskId);
    if (!progressItem) return [];
    return (progressItem.details || [])
        .filter(item => item.resourceType === MATERIAL_TYPE && item.resource)
        .map(item => ({
          resourceId: item.resource.id,
          quantity: item.quantity - item.usedQuantity,
          unit: item.unit,
          name: item.resource.name
        }));
  }

  return [];
});
const listVehicles = computed(() => {
  const requestType = props.data.requestType;
  const fromTaskId = props.data.fromTaskId; // directly access it so Vue tracks it

  if (requestType === PROJECT_TO_TASK || requestType === PROJECT_TO_PROJECT) {
    return inventoryData.value.filter(item => item.resourceType === MACHINE_TYPE);
  }

  if (requestType === TASK_TO_TASK && fromTaskId) {
    const progressItem = props.progressDetails.progressItems.find(item => item.id === fromTaskId);
    if (!progressItem) return [];
    return (progressItem.details || [])
        .filter(item => item.resourceType === MACHINE_TYPE && item.resource)
        .map(item => ({
          resourceId: item.resource.id,
          quantity: item.quantity,
          unit: item.unit,
          name: item.resource.name
        }));
  }

  return [];
});
const listEmployees = computed(() => inventoryData.value.filter(item => item.resourceType === HUMAN_TYPE));

const updateListMaterials = (listData) => {
  listSelectedMaterials.value = listData;
};
const updateListUsers = (listData) => {
  listSelectedUsers.value = listData;
};
const updateListVehicles = (listData) => {
  listSelectedVehicles.value = listData;
};

const handleSearchProjects = (value) => {
  emit("searchProjects", value);
}

const handleSearchTask = (keyword) => {
  emit("searchTask", keyword);
}

const formAllocationMaterialInfos = ref(null);
const formAllocationVehicleInfos = ref(null);
const formAllocationHumanInfos = ref(null);
const formAllocationInfo = ref(null);

const handleSubmit = async () => {
  const forms = [
    {
      ref: formAllocationMaterialInfos,
      name: "Material",
    },
    {
      ref: formAllocationVehicleInfos,
      name:"Vehicle",
    },
    {
      ref: formAllocationHumanInfos,
      name: "Human",
    },
    {
      ref: formAllocationInfo,
      name: "Allocation",
    }
  ];
  for (const form of forms) {
    const isValid = await new Promise((resolve) => {
      form.ref.value?.ruleFormRef.validate((valid) => resolve(valid));
    });
    if (!isValid) {
      mixinMethods.notifyError(
          t("planning.errors.invalid_form", {form: form.name})
      );
      return; // stop here if one form is invalid
    }
  }
  let listData = [
      ...listSelectedMaterials.value,
      ...listSelectedUsers.value,
      ...listSelectedVehicles.value
  ];
  emit("submit", listData);
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
