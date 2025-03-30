<template>
  <div class="mobilization mobilization-list">
    <div class="mobilization-header">
      <h3 class="page__ttl">{{ $t("mobilization.title") }}</h3>
      <div class="mobilization-btn-box mobilization-import-box">
        <el-row
          class="mb-4"
        >
          <el-button class="btn btn-save" @click="handleRedirectToCreate"
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
            {{ $t("common.search") }}</el-button
          >
          <el-button class="btn btn-clear" @click="handleClear()">
            {{ $t("common.clear") }}</el-button
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
      />
      <LoadMore
        :listData="listMobilizations.value"
        :totalItems="totalItems.value"
        @loadMore="handleLoadMore"
      />
    </div>
    <ModalConfirm
      :isShowModal="isShowModalConfirm.value"
      @close-modal="closeModalConfirm"
      :isConfirmByText="true"
      :confirmText="TEXT_CONFIRM_DELETE"
      @confirmAction="handleConfirm"
      :message="$t('mobilization.modal_confirm.message')"
      :title="$t('mobilization.modal_confirm.title')"
    />
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import LoadMore from "@/components/common/LoadMore.vue";
import ModalConfirm from "@/components/common/ModalConfirm.vue";
import { TEXT_CONFIRM_DELETE } from "@/constants/application.js";
import PAGE_NAME from "@/constants/route-name.js";
import MobilizationTable from "@/pages/resource-mobilization/items/MobilizationTable.vue";
import {useMobilizationStore} from "@/store/mobilization";
import {usePersistenceStore} from "@/store/persistence.js";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import IconCircleClose from "@/svg/IconCircleClose.vue";
import {STATUSES} from "@/constants/mobilization";
import IconSetting from "@/svg/IconSettingMain.vue";

const router = useRouter();

const mobilizationStore = useMobilizationStore();
const persist = usePersistenceStore();
const {
  projectId
} = persist;
const {
  totalItems,
  currentPage,
  isShowModalConfirm,
  listMobilizations,
  getListMobilizations,
} = mobilizationStore;

const delete_id = ref(null);
const validation = ref([]);
const isShowBoxSearch = ref(false);
const searchForms = ref({ projectId: projectId.value, pageIndex: 1, status: "" });

const handleClear = () => {
  searchForms.value.search = "";
};

const handleSearchForm = () => {
  isShowBoxSearch.value = !isShowBoxSearch.value;
};

const submitForm = () => {
  searchForms.value.pageIndex = 1;
  currentPage.value = 1;
  getListMobilizations(searchForms.value);
};

const handleLoadMore = () => {
  currentPage.value++;
  searchForms.value.pageIndex++;
  getListMobilizations(searchForms.value);
};

const handleRedirectToCreate = () => {
  // router.push({ name: PAGE_NAME..CREATE });
};

const handleGetMobilizationDtls = (id) => {
  // router.push({ name: PAGE_NAME.mobilization.DETAILS, params: { id } });
};

const handleCloseModal = () => {
  validation.value = [];
};

const handleDisplayModal = (mobilization_id) => {
  isShowModalConfirm.value = !!mobilization_id;
  delete_id.value = mobilization_id;
};

const closeModalConfirm = () => {
  isShowModalConfirm.value = false;
};

const handleConfirm = () => {
  handleDeleteMobilization(delete_id.value);
};

const handleDeleteMobilization = (id) => {
};

onMounted(() => {
  getListMobilizations(searchForms.value);
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
