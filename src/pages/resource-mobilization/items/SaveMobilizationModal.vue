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
        <label class="error-feedback" v-if="listSelectedMaterials.length <= 0 && listSelectedUsers.length<= 0 && listSelectedVehicles.length <= 0">
          {{ $t('E-RR-FE-002') }}
        </label>
        <el-tabs v-model="activeTab">
          <!-- Tài nguyên -->
          <el-tab-pane label="Tài nguyên" name="materials">
            <ItemList
                :selectData="materials"
                :resourceType="RESOURCE_TYPE_MATERIALS"
                :tableData="listSelectedMaterials"
                :optionKeys="materialOptions"
                @update-list="updateListMaterials"
            />
          </el-tab-pane>

          <!-- Nhân lực -->
          <el-tab-pane label="Nhân lực" name="users">
            <ItemList
                :selectData="listEmployees"
                :resourceType="RESOURCE_TYPE_USERS"
                :tableData="listSelectedUsers"
                :optionKeys="userOptions"
                @update-list="updateListUsers"
            />
          </el-tab-pane>

          <!-- Phương tiện -->
          <el-tab-pane label="Phương tiện" name="vehicles">
            <ItemList
                :selectData="listVehicles"
                :resourceType="RESOURCE_TYPE_VEHICLES"
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
import {defineProps, ref, watch} from "vue";
import Modal from "@/components/common/Modal.vue";
import MobilizeFormInfo from "@/pages/resource-mobilization/items/modal/MobilizeFormInfo.vue";
import ItemList from "@/pages/resource-mobilization/items/modal/ItemList.vue";
import { getMobilizationInfoRules } from "@/rules/mobilization/index.js";
import { RESOURCE_TYPE_MATERIALS, RESOURCE_TYPE_VEHICLES, RESOURCE_TYPE_USERS } from "@/constants/mobilization";

const props = defineProps({
  show: {type: Boolean, default: false},
  data: { type: Object, default: () => ({}) },
});
const emit = defineEmits(["close", "submit"]);
const listSelectedVehicles = ref( []);
const listSelectedMaterials = ref([]);
const listSelectedUsers = ref([]);
const materialOptions = ref({ id: "id", value: "name" });
const userOptions = ref({ id: "id", value: "name" });
const vehicleOptions = ref({ id: "id", value: "name" });
const activeTab = ref("materials");
const materials = ref([
  {id: 1, name: "Cát xây dựng", unit: "kg", rate: 1, coefficient: 1, quantity: 100, unitPrice: 50000},
  {id: 2, name: "Xi măng", unit: "kg", rate: 0.5, coefficient: 1, quantity: 50, unitPrice: 70000},
]);
const listEmployees = ref([
  {id: 1, name: "Nhân viên 1", unit: "kg", rate: 1, coefficient: 1, quantity: 100, unitPrice: 50000},
  {id: 2, name: "Nhân viên 2", unit: "kg", rate: 0.5, coefficient: 1, quantity: 50, unitPrice: 70000},
]);
const listVehicles = ref([
  {id: 1, name: "Xe 1", unit: "kg", rate: 1, coefficient: 1, quantity: 100, unitPrice: 50000},
  {id: 2, name: "Xe 2", unit: "kg", rate: 0.5, coefficient: 1, quantity: 50, unitPrice: 70000},
]);

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

watch(() => props.data, (data) => {
  if (data) {
    let listUsers = [];
    let listVehicles = [];
    let listMaterials = [];

    const resourceMobilizationDetails = data.resourceMobilizationDetails;

    resourceMobilizationDetails.forEach(item => {
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
    ...listSelectedUsers.value.map(({ name, ...rest }) => rest),
    ...listSelectedVehicles.value.map(({ name, ...rest }) => rest),
    ...listSelectedMaterials.value.map(({ name, ...rest }) => rest),
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
