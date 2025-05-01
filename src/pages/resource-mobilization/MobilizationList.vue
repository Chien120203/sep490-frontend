<template>
  <div class="mobilization mobilization-list">
    <div class="mobilization-header">
      <div class="contract-save-title">
        <h3 class="page__ttl">
          <span class="btn-back" @click="handleBack"><IconBackMain/></span>
          {{
            $t("mobilization.title")
          }}
        </h3>
      </div>
      <div class="mobilization-btn-box mobilization-import-box">
        <el-row
            class="mb-4"
        >
          <el-button v-if="allowCreate" class="btn btn-save" @click="handleDisplayModalSave(true)"
          >{{ $t("mobilization.add_new") }}
          </el-button>
        </el-row>
      </div>
    </div>
    <div class="mobilization-body">
      <div class="mobilization-search">
        <div class="mobilization-search-box col-md-9 col-lg-9">
          <p class="mobilization-search__ttl">
            {{ $t("mobilization.keyword") }}
          </p>
          <div class="mb-0 ruleform">
            <el-input
                :placeholder="$t('common.input_keyword')"
                @keyup.enter="submitForm"
                v-model="searchForms.search"
                prop="search"
            >
              <template #append>
                <span @click="handleSearchForm" class="btn-setting">
                  <IconSetting/>
                </span>
              </template>
            </el-input>
          </div>
        </div>
        <div class="btn-search-select col-md-3 col-lg-3 mobilization-box-btn-all">
          <el-button class="btn btn-search" @click="submitForm()">
            {{ $t("common.search") }}
          </el-button
          >
          <el-button class="btn btn-clear" @click="handleClear()">
            {{ $t("common.clear") }}
          </el-button
          >
        </div>
      </div>
      <div class="form-search" :class="{ active: isShowBoxSearch }">
        <div class="close-form">
          <IconCircleClose @click="isShowBoxSearch = false"/>
        </div>
        <div class="form-search-box">
          <div class="item">
            <el-form-item :label="$t('project.status')">
              <el-select v-model="searchForms.status">
                <el-option :label="$t('common.all')" value=""></el-option>
                <el-option
                    v-for="(status, index) in STATUSES"
                    :key="index"
                    :label="status"
                    :value="index"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
      </div>
    </div>

    <div class="mobilization-body-table" style="">
      <MobilizationTable
          :data="listMobilizations.value"
          @details="handleGetMobilizationDtls"
          @delete="handleDisplayModal"
          @changeStatus="handleChangeStatus"
      />
      <LoadMore
          :listData="listMobilizations.value"
          :totalItems="totalItems.value"
          @loadMore="handleLoadMore"
      />
    </div>
    <ModalConfirm
        style="z-index: 1000000"
        :isShowModal="isShowModalConfirm"
        @close-modal="closeModalConfirm"
        @confirmAction="handleConfirm"
        :message="title"
        :title="$t('mobilization.modal_confirm.title')"
    />
    <SaveMobilizationModal
        :show="isShowModalSave"
        :materials="listMaterialResources.value"
        :vehicles="listMachineResources.value"
        :users="listHumanResources.value"
        :data="mobilizationDetails.value"
        @changeStatus="handleChangeStatus"
        @close="handleDisplayModalSave"
        @search="handleSearch"
        @submit="handleSaveRequest"
    />
  </div>
</template>
<script setup>
import {ref, onMounted, onUnmounted, computed} from "vue";
import LoadMore from "@/components/common/LoadMore.vue";
import ModalConfirm from "@/components/common/ModalConfirm.vue";
import MobilizationTable from "@/pages/resource-mobilization/items/MobilizationTable.vue";
import {useMobilizationStore} from "@/store/mobilization";
import {usePersistenceStore} from "@/store/persistence.js";
import IconCircleClose from "@/svg/IconCircleClose.vue";
import {STATUSES} from "@/constants/mobilization";
import IconSetting from "@/svg/IconSettingMain.vue";
import SaveMobilizationModal from "@/pages/resource-mobilization/items/SaveMobilizationModal.vue";
import {useI18n} from "vue-i18n";
import {useHumanResourcesStore} from "@/store/human-resources.js";
import {useMachineResourcesStore} from "@/store/machine-resources.js";
import {useMaterialResourcesStore} from "@/store/material-resources.js";
import {HUMAN_TYPE, MACHINE_TYPE, MATERIAL_TYPE} from "@/constants/resource.js";
import IconBackMain from "@/svg/IconBackMain.vue";
import PAGE_NAME from "@/constants/route-name.js";
import {useRouter} from "vue-router";
import {RESOURCE_MANAGER} from "@/constants/roles.js";

const mobilizationStore = useMobilizationStore();
const persist = usePersistenceStore();
const humanStore = useHumanResourcesStore();
const machineStore = useMachineResourcesStore();
const materialStore = useMaterialResourcesStore();
const {
  projectId,
  loggedIn
} = persist;
const {
  totalItems,
  currentPage,
  listMobilizations,
  mobilizationDetails,
  setMobilizationDefault,
  getListMobilizations,
  getMobilizationDetails,
  handleDeleteMobilization,
  handleChangeRequestStatus,
  saveRequest
} = mobilizationStore;
const {listHumanResources, getListHumanResources} = humanStore;
const {listMachineResources, getListMachineResources} = machineStore;
const {listMaterialResources, getListMaterialResources} = materialStore;

const {t} = useI18n();
const delete_id = ref(null);
const isShowModalConfirm = ref(false);
const isShowModalSave = ref(false);
const isShowBoxSearch = ref(false);
const allowCreate = computed(() => localStorage.getItem('role') === RESOURCE_MANAGER);
const router = useRouter();
const title = ref("");
const changeObject = ref({});
const searchForms = ref({projectId: projectId.value, pageIndex: 1});
const handleClear = () => {
  searchForms.value.search = "";
};

const handleSearchForm = () => {
  isShowBoxSearch.value = !isShowBoxSearch.value;
};

const handleDisplayModalSave = (show = false) => {
  setMobilizationDefault();
  isShowModalSave.value = show;
}

const handleChangeStatus = (data) => {
  changeObject.value = data;
  title.value = t('mobilization.modal_confirm.message_change_status');
  isShowModalConfirm.value = true;
};

const handleBack = () => {
  router.push({name: PAGE_NAME.PROJECT.DETAILS, params: {id: projectId.value}});
};

const submitForm = () => {
  searchForms.value.pageIndex = 1;
  currentPage.value = 1;
  getListMobilizations(searchForms.value);
};

const handleSearch = (data) => {
  switch (data.type) {
    case MACHINE_TYPE:
      getListMachineResources({licensePlate: data.value, pageIndex: 1}, false);
      break;
    case HUMAN_TYPE:
      getListHumanResources({teamName: data.value, pageIndex: 1}, false);
      break;
    case MATERIAL_TYPE:
      getListMaterialResources({materialName: data.value, pageIndex: 1}, false);
  }
}

const handleLoadMore = () => {
  currentPage.value++;
  searchForms.value.pageIndex++;
  getListMobilizations(searchForms.value);
};

const handleSaveRequest = (data) => {
  mobilizationDetails.value.resourceMobilizationDetails = data;
  mobilizationDetails.value.projectId = projectId.value;
  isShowModalSave.value = false;
  saveRequest(mobilizationDetails.value);
}

const handleDisplayModal = (mobilization_id) => {
  setMobilizationDefault();
  title.value = t('mobilization.modal_confirm.message_delete')
  isShowModalConfirm.value = !!mobilization_id;
  delete_id.value = mobilization_id;
};

const closeModalConfirm = () => {
  setMobilizationDefault();
  isShowModalConfirm.value = false;
};

const handleConfirm = async () => {
  closeModalConfirm();
  isShowModalSave.value = false;
  if(delete_id.value) {
    await handleDeleteMobilization(delete_id.value);
    delete_id.value = null;
  } else {
    await handleChangeRequestStatus(changeObject.value.id, changeObject.value.type);
  }
  await getListMobilizations(searchForms.value);
};

const handleGetMobilizationDtls = (mobilization_id) => {
  setMobilizationDefault();
  getMobilizationDetails(mobilization_id);
  isShowModalSave.value = true;
}

onMounted(async () => {
  if (loggedIn.value) {
    await getListMobilizations(searchForms.value);
    await getListHumanResources({pageIndex: 1}, false);
    await getListMachineResources({pageIndex: 1}, false);
    await getListMaterialResources({pageIndex: 1}, false);
  }
});

onUnmounted(() => {
  totalItems.value = 0;
});
</script>

<style lang="scss" scoped>
.close-form {
  position: absolute;
  display: flex;
  justify-content: end;
  right: 16px;
  top: 10px;
  cursor: pointer;

  svg {
    height: 30px;
  }
}
</style>
