<template>
  <div class="inspection inspection-list">
    <div class="inspection-header">
      <h3 class="page__ttl">{{ $t("inspection.title") }}</h3>
      <div class="inspection-btn-box">
        <el-row class="mb-4">
          <el-button v-if="allowEdit" class="btn btn-save" @click="handleRedirectToCreate">
            {{ $t("common.add_new") }}
          </el-button>
        </el-row>
      </div>
    </div>
    <div class="inspection-body">
      <div class="inspection-search">
        <div class="inspection-search-box col-md-9 col-lg-9">
          <p class="inspection-search__ttl">
            {{ $t("common.keyword") }}
          </p>
          <div class="mb-0 ruleform">
            <el-input
                :placeholder="$t('common.input_keyword')"
                @keyup.enter="submitForm"
                v-model="searchForms.keyword"
                prop="keyword"
            />
          </div>
        </div>
        <div class="btn-search-select col-md-3 col-lg-3 inspection-box-btn-all">
          <el-button class="btn btn-search" @click="submitForm">
            {{ $t("common.search") }}
          </el-button>
          <el-button class="btn btn-clear" @click="handleClear">
            {{ $t("common.clear") }}
          </el-button>
        </div>
      </div>
    </div>

    <div class="inspection-body-table">
      <InspectionReportTable
          :allowEdit="allowEdit"
          :data="listInspectionReports.value"
          @details="handleGetInspectionDetails"
          @delete="handleDisplayModal"
      />
      <LoadMore
          :listData="listInspectionReports.value"
          :totalItems="totalItems.value"
          @loadMore="handleLoadMore"
      />
    </div>

    <ModalConfirm
        :isShowModal="isShowModalConfirm.value"
        @close-modal="closeModalConfirm"
        @confirmAction="handleConfirm"
        :message="$t('inspection.modal_confirm.message')"
        :title="$t('inspection.modal_confirm.title')"
    />
  </div>
</template>

<script>
import {computed, onMounted, onUnmounted, ref} from "vue";
import {useRouter} from "vue-router";
import InspectionReportTable from "./item/InspectionReportTable.vue";
import ModalConfirm from "@/components/common/ModalConfirm.vue";
import PAGE_NAME from "@/constants/route-name.js";
import {TEXT_CONFIRM_DELETE} from "@/constants/application.js";
import IconSetting from "@/svg/IconSettingMain.vue";
import IconCircleClose from "@/svg/IconCircleClose.vue";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import LoadMore from "@/components/common/LoadMore.vue";
import {useInspectionReportStore} from "@/store/inspection.js";
import {QUALITY_ASSURANCE} from "@/constants/roles.js";
import {usePersistenceStore} from "@/store/persistence.js";

export default {
  name: "InspectionReportList",
  components: {
    InspectionReportTable,
    ModalConfirm,
    IconSetting,
    IconCircleClose,
    SingleOptionSelect,
    LoadMore,
  },
  setup() {
    const delete_id = ref();
    const router = useRouter();
    const inspectionStore = useInspectionReportStore();
    const persist = usePersistenceStore();
    const {
      projectId,
      loggedIn
    } = persist;
    const {
      validation,
      listInspectionReports,
      totalItems,
      currentPage,
      isShowModalConfirm,
      getListInspectionReport,
      clearInspectionReportDetails,
      handleDeleteInspectionReport,
    } = inspectionStore;
    const searchForms = ref({
      projectId: projectId.value ? projectId.value : "",
      keyword: "",
      pageIndex: 1,
      pageSize: 15,
    });
    const isDisabled = ref(false);
    const allowEdit = computed(() => localStorage.getItem('role') === QUALITY_ASSURANCE);
    onMounted(() => {
      currentPage.value = 1;
      if (loggedIn.value) {
        getListInspectionReport(searchForms.value);
      }
    });

    onUnmounted(() => {
      clearInspectionReportDetails();
      listInspectionReports.value = [];
    });

    const handleClear = () => {
      searchForms.value.keyword = "";
    };

    const submitForm = () => {
      searchForms.value.pageIndex = 1;
      currentPage.value = 1;
      getListInspectionReport(searchForms.value);
    };

    const handleLoadMore = () => {
      currentPage.value++;
      searchForms.value.pageIndex++;
      getListInspectionReport(searchForms.value);
    };

    const handleRedirectToCreate = () => {
      router.push({name: PAGE_NAME.INSPECTION_REPORT.CREATE});
    };

    const handleGetInspectionDetails = (id) => {
      router.push({name: PAGE_NAME.INSPECTION_REPORT.DETAILS, params: {id}});
    };

    const handleCloseModal = () => {
      validation.value = [];
    };

    const handleDisplayModal = (inspection_id) => {
      isShowModalConfirm.value = !!inspection_id;
      delete_id.value = inspection_id;
    };

    const closeModalConfirm = () => {
      isShowModalConfirm.value = false;
    };

    const handleConfirm = () => {
      handleDeleteInspectionReport(delete_id.value)
    };

    return {
      searchForms,
      isShowModalConfirm,
      delete_id,
      validation,
      isDisabled,
      listInspectionReports,
      totalItems,
      currentPage,
      allowEdit,
      handleLoadMore,
      handleCloseModal,
      TEXT_CONFIRM_DELETE,
      handleClear,
      submitForm,
      handleDisplayModal,
      closeModalConfirm,
      handleConfirm,
      handleRedirectToCreate,
      handleGetInspectionDetails
    };
  },
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