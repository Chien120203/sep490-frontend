<template>
  <Modal
      :show="show"
      :width="'85%'"
      :containerHeight="'70%'"
      :isShowFooter="true"
      @close="$emit('close')"
  >
    <template #header>
      <h4 class="modal-title">{{ $t('mobilization.modal.title') }}</h4>
    </template>

    <template #body>
      <div class="modal-body-container">
        <MobilizeFormInfo 
          :data="data"
          :allowEdit="allowSave"
          :rules="MOBILIZEFORMINFO_RULES"
        />
        <label class="error-feedback" v-if="data.requestType === REQUEST_TYPE_SUPPLY_MORE && listSelectedMaterials.length <= 0 && listSelectedUsers.length<= 0 && listSelectedVehicles.length <= 0">
          {{ $t('E-RR-FE-002') }}
        </label>
        <el-tabs v-model="activeTab">
          <!-- Tài nguyên -->
          <el-tab-pane :label="$t('mobilization.table.header.material')" name="materials">
            <ItemList
                :selectData="materials"
                :allowEdit="allowSave"
                :resourceType="RESOURCE_TYPE_MATERIALS"
                :requestType="data.requestType"
                :tableData="listSelectedMaterials"
                :optionKeys="materialOptions"
                @update-list="updateListMaterials"
                @search="handleSearch"
            />
          </el-tab-pane>

          <!-- Nhân lực -->
          <el-tab-pane :label="$t('mobilization.table.header.human')" name="users">
            <ItemList
                :selectData="users"
                :allowEdit="allowSave"
                :resourceType="RESOURCE_TYPE_USERS"
                :requestType="data.requestType"
                :tableData="listSelectedUsers"
                :optionKeys="userOptions"
                @update-list="updateListUsers"
                @search="handleSearch"
            />
          </el-tab-pane>

          <!-- Phương tiện -->
          <el-tab-pane :label="$t('mobilization.table.header.vehicle')" name="vehicles">
            <ItemList
                :selectData="vehicles"
                :allowEdit="allowSave"
                :resourceType="RESOURCE_TYPE_VEHICLES"
                :requestType="data.requestType"
                :tableData="listSelectedVehicles"
                :optionKeys="vehicleOptions"
                @update-list="updateListVehicles"
                @search="handleSearch"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </template>
    <template #footer>
      <div class="modal-footer">
        <el-button v-if="allowSave" class="btn btn-save" @click="handleSubmit">{{ $t("common.save") }}</el-button>
        <el-button v-if="allowApprove(data.status)" @click="$emit('changeStatus', {id: data.id, type: 'approve'})" type="success" class="btn btn-save">
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
import {computed, defineProps, ref, watch} from "vue";
import Modal from "@/components/common/Modal.vue";
import MobilizeFormInfo from "@/pages/resource-mobilization/items/modal/MobilizeFormInfo.vue";
import ItemList from "@/pages/resource-mobilization/items/modal/ItemList.vue";
import { getMobilizationInfoRules } from "@/rules/mobilization/index.js";
import {
  RESOURCE_TYPE_MATERIALS,
  RESOURCE_TYPE_VEHICLES,
  RESOURCE_TYPE_USERS,
  REQUEST_TYPE_SUPPLY_MORE
} from "@/constants/mobilization";
import {DRAFT_STATUS, MANAGER_APPROVED, WAIT_MANAGER_APPROVE} from "@/constants/allocation.js";
import {EXECUTIVE_BOARD, RESOURCE_MANAGER, TECHNICAL_MANAGER} from "@/constants/roles.js";

const props = defineProps({
  show: {type: Boolean, default: false},
  data: { type: Object, default: () => ({}) },
  materials: {type: Array, default: () => []},
  users: {type: Array, default: () => []},
  vehicles: {type: Array, default: () => []},
});
const emit = defineEmits(["close", "submit", "changeStatus"]);
const listSelectedVehicles = ref( []);
const listSelectedMaterials = ref([]);
const listSelectedUsers = ref([]);
const materialOptions = ref({id: "id", value: "materialName"});
const userOptions = ref({id: "id", value: "teamName"});
const vehicleOptions = ref({id: "id", value: "chassisNumber"});
const activeTab = ref("materials");

const MOBILIZEFORMINFO_RULES = getMobilizationInfoRules();

const updateListMaterials = (listData) => {
  listSelectedMaterials.value = listData;
};
const updateListUsers = (listData) => {
  listSelectedUsers.value = listData;
};
const updateListVehicles = (listData) => {
  listSelectedVehicles.value = listData;
};

const handleSearch = (data) => {
  emit("search", data)
}

const currentRole = ref(localStorage.getItem("role"));
const allowSave = computed(() => localStorage.getItem('role') === RESOURCE_MANAGER && props.data.status === DRAFT_STATUS);
const allowApprove = (status) => {
  if(status === WAIT_MANAGER_APPROVE && currentRole.value === TECHNICAL_MANAGER) return true;
  return status === MANAGER_APPROVED && currentRole.value === EXECUTIVE_BOARD;
}

const allowReject = (status) => {
  return (status === WAIT_MANAGER_APPROVE && currentRole.value === TECHNICAL_MANAGER) || (status === MANAGER_APPROVED && currentRole.value === EXECUTIVE_BOARD);
}

watch(() => props.data.resourceMobilizationDetails, (data) => {
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

const handleSubmit = () => {
  let listRequests = [
    ...listSelectedUsers.value,
    ...listSelectedVehicles.value,
    ...listSelectedMaterials.value,
  ];
  emit("submit", listRequests);
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
