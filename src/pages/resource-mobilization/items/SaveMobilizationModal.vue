<template>
  <Modal
      :show="show"
      :width="'85%'"
      :containerHeight="'70%'"
      :isShowFooter="false"
      @close="$emit('close')"
  >
    <template #header>
      <h4 class="modal-title">{{ $t('mobilization.modal.title') }}</h4>
    </template>

    <template #body>
      <div class="modal-body-container">
        <MobilizeFormInfo 
          :data="data"
          :rules="MOBILIZEFORMINFO_RULES"
        />
        <label class="error-feedback" v-if="data.requestType === REQUEST_TYPE_SUPPLY_MORE && listSelectedMaterials.length <= 0 && listSelectedUsers.length<= 0 && listSelectedVehicles.length <= 0">
          {{ $t('E-RR-FE-002') }}
        </label>
        <el-tabs v-model="activeTab">
          <!-- Tài nguyên -->
          <el-tab-pane label="Tài nguyên" name="materials">
            <ItemList
                :selectData="materials"
                :resourceType="RESOURCE_TYPE_MATERIALS"
                :requestType="data.requestType"
                :tableData="listSelectedMaterials"
                :optionKeys="materialOptions"
                @update-list="updateListMaterials"
                @search="handleSearch"
            />
          </el-tab-pane>

          <!-- Nhân lực -->
          <el-tab-pane label="Nhân lực" name="users">
            <ItemList
                :selectData="users"
                :resourceType="RESOURCE_TYPE_USERS"
                :requestType="data.requestType"
                :tableData="listSelectedUsers"
                :optionKeys="userOptions"
                @update-list="updateListUsers"
                @search="handleSearch"
            />
          </el-tab-pane>

          <!-- Phương tiện -->
          <el-tab-pane label="Phương tiện" name="vehicles">
            <ItemList
                :selectData="vehicles"
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
      <div class="modal-footer">
        <el-button class="btn btn-save" @click="handleSubmit">{{ $t("common.save") }}</el-button>
        <el-button class="btn btn-refuse" @click="$emit('close')">{{ $t("common.cancel") }}</el-button>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import {defineProps, ref, watch} from "vue";
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

const props = defineProps({
  show: {type: Boolean, default: false},
  data: { type: Object, default: () => ({}) },
  materials: {type: Array, default: () => []},
  users: {type: Array, default: () => []},
  vehicles: {type: Array, default: () => []},
});
const emit = defineEmits(["close", "submit"]);
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
  let listRequests = [];
  if (props.data.requestType === REQUEST_TYPE_SUPPLY_MORE) {
    // Exclude the `name` field
    listRequests = [
      ...listSelectedUsers.value.map(({ name, ...rest }) => rest),
      ...listSelectedVehicles.value.map(({ name, ...rest }) => rest),
      ...listSelectedMaterials.value.map(({ name, ...rest }) => rest),
    ];
  } else {
    // Include the `name` field
    listRequests = [
      ...listSelectedUsers.value,
      ...listSelectedVehicles.value,
      ...listSelectedMaterials.value,
    ];
  }
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
