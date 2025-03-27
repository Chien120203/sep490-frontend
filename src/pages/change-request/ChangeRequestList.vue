<template>
  <div class="change-request change-request-list">
    <div class="change-request-header">
      <h3 class="page__ttl">
        <span class="btn-back" @click="handleBack"><IconBackMain/></span>
        {{ $t("change-request.title") }}
      </h3>
      <div class="change-request-btn-box change-request-import-box">
        <el-row class="mb-4">
          <el-button class="btn btn-save" @click="handleDisplaySaveModal(true)">
            {{ $t("change-request.add_new") }}
          </el-button>
        </el-row>
      </div>
    </div>

    <div class="change-request-body">
      <div class="change-request-search">
        <div class="change-request-search-box col-md-9 col-lg-9">
          <p class="change-request-search__ttl">
            {{ $t("change-request.keyword") }}
          </p>
          <div class="mb-0 ruleform">
            <el-input
                :placeholder="$t('common.input_keyword')"
                @keyup.enter="submitForm"
                v-model="searchForms.searchValue"
            >
              <template #append>
                <span @click="handleSearchForm" class="btn-setting">
                  <IconSetting/>
                </span>
              </template>
            </el-input>
          </div>
        </div>
        <div class="btn-search-select col-md-3 col-lg-3 change-request-box-btn-all">
          <el-button class="btn btn-search" @click="submitForm">
            {{ $t("common.search") }}
          </el-button>
          <el-button class="btn btn-clear" @click="handleClear">
            {{ $t("common.clear") }}
          </el-button>
        </div>
      </div>
    </div>

    <div class="bidding-body-table" style="margin-top: 10px; min-height: 480px; overflow-y: auto;">
      <ChangeRequestTable
          :data="listPlanning"
          @details="handleDisplaySaveModal(true)"
          @delete="handleDeletePlanning"
      />
      <LoadMore :listData="listPlanning" :totalItems="0" @loadMore="handleLoadMore" />
    </div>
    <ModalConfirm
        :isShowModal="isShowModalConfirm"
        @close-modal="handleDisplayModal"
        :isConfirmByText="true"
        :confirmText="TEXT_CONFIRM_DELETE"
        @confirmAction="handleConfirm"
        :message="$t('project.modal_confirm.message')"
        :title="$t('project.modal_confirm.title')"
    />
    <ChangeRequestModal :show="isShowSaveModal" @close="handleDisplaySaveModal" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { usePersistanceStore } from "@/store/persistance.js";
import IconSetting from "@/svg/IconSettingMain.vue";
import IconBackMain from "@/svg/IconBackMain.vue";
import ChangeRequestTable from "@/pages/change-request/item/ChangeRequestTable.vue";
import ChangeRequestModal from "@/pages/change-request/item/modal/ChangeRequestModal.vue";
import LoadMore from "@/components/common/LoadMore.vue";
import ModalConfirm from "@/components/common/ModalConfirm.vue";
import { TEXT_CONFIRM_DELETE } from "@/constants/application.js";
import PAGE_NAME from "@/constants/route-name.js";

const persistenceStore = usePersistanceStore();
const { projectId } = persistenceStore;
const router = useRouter();

const searchForms = ref({ searchValue: "", status: null, customerId: null, pageIndex: 1 });
const isShowBoxSearch = ref(false);
const listPlanning = ref([
  { id: 1, title: "Project Kickoff", date: "2025-03-20", status: 1, creator: "Employee 1", tasks: [] },
  { id: 2, title: "Development Phase 1", date: "2025-03-25", status: 2, creator: "Employee 2", tasks: [] },
  { id: 3, title: "Testing & Review", date: "2025-04-05", status: 3, creator: "Employee 3", tasks: [] },
]);
const isShowModalConfirm = ref(false);
const isShowSaveModal = ref(false);

const handleSearchForm = () => {
  isShowBoxSearch.value = !isShowBoxSearch.value;
};

const handleClear = () => {
  searchForms.value.searchValue = "";
  searchForms.value.status = null;
  searchForms.value.customerId = null;
};

const submitForm = () => {
  isShowBoxSearch.value = false;
  searchForms.value.pageIndex = 1;
};

const handleLoadMore = () => {};
const handleRedirectToCreate = () => router.push({ name: PAGE_NAME.PLANNING.CREATE });
const handleGetPlanningDtls = (id) => router.push({ name: PAGE_NAME.PLANNING.DETAILS, params: { id } });
const handleDisplayModal = () => (isShowModalConfirm.value = false);
const handleConfirm = () => {};
const handleDeletePlanning = () => (isShowModalConfirm.value = true);
const handleBack = () => router.push({ name: PAGE_NAME.PROJECT.DETAILS, params: { id: projectId.value } });
const handleDisplaySaveModal = (isShow = false) => {
  isShowSaveModal.value = isShow;
}
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
