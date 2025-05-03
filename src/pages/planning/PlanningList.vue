<template>
  <div class="planning planning-list">
    <div class="planning-header">
      <h3 class="page__ttl">
        <span class="btn-back" @click="handleBack"><IconBackMain/></span>
        {{ $t("planning.title") }}
      </h3>
      <div class="planning-btn-box planning-import-box">
        <el-row class="mb-4">
          <el-button v-if="allowCreate" class="btn btn-save" @click="handleRedirectToCreate">
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
        @confirmAction="handleConfirm"
        :message="$t('project.modal_confirm.message')"
        :title="$t('project.modal_confirm.title')"
    />
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from "vue";
import { useRouter } from "vue-router";
import { usePersistenceStore } from "@/store/persistence.js";
import { usePlanningStore } from "@/store/planning.js";
import IconCircleClose from "@/svg/IconCircleClose.vue";
import PlanningTable from "@/pages/planning/item/list/PlanningTable.vue";
import LoadMore from "@/components/common/LoadMore.vue";
import ModalConfirm from "@/components/common/ModalConfirm.vue";
import IconBackMain from "@/svg/IconBackMain.vue";
import PAGE_NAME from "@/constants/route-name.js";
import {CONSTRUCTION_MANAGER} from "@/constants/roles.js";
import {PLANNING_STATUS} from "@/constants/project.js";

const persistenceStore = usePersistenceStore();
const planningStore = usePlanningStore();

const {
  projectId,
  projectStatus,
  loggedIn
} = persistenceStore;

const {
  listPlannings,
  currentPage,
  isShowModalConfirm,
  getListPlannings,
  handleDeletePlan
} = planningStore;
const allowCreate = computed(() => localStorage.getItem("role") === CONSTRUCTION_MANAGER)
const router = useRouter();
const isShowBoxSearch = ref(false);
const delete_id = ref(0);
const searchForms = ref({
  planName: "",
  projectId: projectId.value,
  pageIndex: 1
});

onMounted(() => {
  if (loggedIn.value) {
    getListPlannings(searchForms.value);
  }
});

const handleClear = () => {
  searchForms.value = { planName: "", projectId: projectId.value, pageIndex: 1 };
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
  handleDeletePlan(delete_id.value);
};

const handleDeletePlanning = (id) => {
  isShowModalConfirm.value = true;
  delete_id.value = id;
};

const handleBack = () => {
  router.push({ name: PAGE_NAME.PROJECT.DETAILS, params: { id: persistenceStore.projectId.value } });
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
