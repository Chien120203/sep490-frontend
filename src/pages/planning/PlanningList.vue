<template>
  <div class="planning planning-list">
    <div class="planning-header">
      <h3 class="page__ttl">
        <span class="btn-back" @click="handleBack"><IconBackMain/></span>
        {{ $t("planning.title") }}
      </h3>
      <div class="planning-btn-box planning-import-box">
        <el-row class="mb-4">
          <el-button class="btn btn-save" @click="handleRedirectToCreate">
            {{ $t("planning.add_new") }}
          </el-button>
        </el-row>
      </div>
    </div>

    <div class="planning-body">
      <div class="planning-search">
        <div class="planning-search-box col-md-9 col-lg-9">
          <p class="planning-search__ttl">{{ $t("planning.keyword") }}</p>
          <el-input
              :placeholder="$t('common.input_keyword')"
              @keyup.enter="submitForm"
              v-model="searchForms.planName"
          >
            <template #append>
              <span @click="handleSearchForm" class="btn-setting">
                <IconSetting/>
              </span>
            </template>
          </el-input>
        </div>
        <div class="btn-search-select col-md-3 col-lg-3 planning-box-btn-all">
          <el-button class="btn btn-search" @click="submitForm">{{ $t("common.search") }}</el-button>
          <el-button class="btn btn-clear" @click="handleClear">{{ $t("common.clear") }}</el-button>
        </div>
      </div>
      <div class="form-search" :class="{ active: isShowBoxSearch }">
        <div class="close-form">
          <IconCircleClose @click="isShowBoxSearch = false"/>
        </div>
      </div>
    </div>

    <div class="bidding-body-table" style="margin-top: 10px; min-height: 480px; overflow-y: auto;">
      <PlanningTable :data="listPlannings.value" @details="handleGetPlanningDtls" @delete="handleDeletePlanning" />
      <LoadMore :listData="listPlannings.value" :totalItems="0" @loadMore="handleLoadMore" />
    </div>

    <ModalConfirm
        :isShowModal="isShowModalConfirm.value"
        @close-modal="handleDisplayModal"
        :isConfirmByText="true"
        :confirmText="TEXT_CONFIRM_DELETE"
        @confirmAction="handleConfirm"
        :message="$t('project.modal_confirm.message')"
        :title="$t('project.modal_confirm.title')"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { usePersistanceStore } from "@/store/persistance.js";
import { usePlanningStore } from "@/store/planning.js";
import IconSetting from "@/svg/IconSettingMain.vue";
import IconCircleClose from "@/svg/IconCircleClose.vue";
import PlanningTable from "@/pages/planning/item/list/PlanningTable.vue";
import LoadMore from "@/components/common/LoadMore.vue";
import ModalConfirm from "@/components/common/ModalConfirm.vue";
import IconBackMain from "@/svg/IconBackMain.vue";
import PAGE_NAME from "@/constants/route-name.js";
import { TEXT_CONFIRM_DELETE } from "@/constants/application.js";

const persistenceStore = usePersistanceStore();
const planningStore = usePlanningStore();

const {
  projectId
} = persistenceStore;

const {
  listPlannings,
  currentPage,
  isShowModalConfirm,
  getListPlannings
} = planningStore;

const router = useRouter();
const isShowBoxSearch = ref(false);

const searchForms = ref({
  planName: "",
  projectId: projectId.value,
  pageIndex: 1
});

onMounted(() => {
  getListPlannings(searchForms.value);
});

const handleSearchForm = () => {
  isShowBoxSearch.value = !isShowBoxSearch.value;
};

const handleClear = () => {
  searchForms.value = { planName: "", projectId: null, pageIndex: 1 };
};

const submitForm = () => {
  isShowBoxSearch.value = false;
  currentPage.value = 1;
  searchForms.value.pageIndex = 1;
  getListPlannings(searchForms.value);
};

const handleLoadMore = () => {
  searchForms.value.pageIndex++;
  currentPage.value++;
  getListPlannings(searchForms.value);
};

const handleRedirectToCreate = () => {
  router.push({ name: PAGE_NAME.PLANNING.CREATE });
};

const handleGetPlanningDtls = (id) => {
  router.push({ name: PAGE_NAME.PLANNING.DETAILS, params: { id } });
};

const handleDisplayModal = () => {
  isShowModalConfirm.value = false;
};

const handleConfirm = () => {
  isShowModalConfirm.value = false;
};

const handleDeletePlanning = () => {
  isShowModalConfirm.value = true;
};

const handleBack = () => {
  router.push({ name: PAGE_NAME.PROJECT.DETAILS, params: { id: persistenceStore.projectId } });
};
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
