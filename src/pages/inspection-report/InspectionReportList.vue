<template>
  <div class="inspection inspection-list">
    <div class="inspection-header">
      <h3 class="page__ttl">{{ $t("inspection.title") }}</h3>
      <div class="inspection-btn-box">
        <el-row class="mb-4">
          <el-button class="btn btn-save" @click="handleRedirectToCreate">
            {{ $t("inspection.add_new") }}
          </el-button>
        </el-row>
      </div>
    </div>
    <div class="inspection-body">
      <div class="inspection-search">
        <div class="inspection-search-box col-md-9 col-lg-9">
          <p class="inspection-search__ttl">
            {{ $t("inspection.keyword") }}
          </p>
          <div class="mb-0 ruleform">
            <el-input
                :placeholder="$t('common.input_keyword')"
                @keyup.enter="submitForm"
                v-model="searchForms.search"
                prop="search"
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
          :data="listReports.value"
          @details="handleGetInspectionDetails"
          @delete="handleDisplayModal"
      />
    </div>

    <ModalConfirm
        :isShowModal="isShowModalConfirm.value"
        @close-modal="closeModalConfirm"
        :isConfirmByText="true"
        :confirmText="TEXT_CONFIRM_DELETE"
        @confirmAction="handleConfirm"
        :message="$t('inspection.modal_confirm.message')"
        :title="$t('inspection.modal_confirm.title')"
    />
  </div>
</template>

<script>
import { ref } from "vue";
import {useRouter} from "vue-router";
import InspectionReportTable from "./item/InspectionReportTable.vue";
import ModalConfirm from "@/components/common/ModalConfirm.vue";
import PAGE_NAME from "@/constants/route-name.js";
import { TEXT_CONFIRM_DELETE } from "@/constants/application.js";
import IconSetting from "@/svg/IconSettingMain.vue";
import IconCircleClose from "@/svg/IconCircleClose.vue";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import LoadMore from "@/components/common/LoadMore.vue";

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
    const searchForms = ref({
      search: "",
      pageIndex: 1,
    });

    const delete_id = ref();
    const router = useRouter();

    const isShowModalConfirm = ref(false);

    const listReports = ref([
      {
        InspectionCode: 1,
        InspectionName: "Safety Check",
        ProjectId: "P001",
        date: "2025-04-01",
        status: "Completed",
      },
      {
        InspectionCode: 2,
        InspectionName: "Fire Safety",
        ProjectId: "P002",
        date: "2025-04-05",
        status: "In Progress",
      },
      {
        InspectionCode: 3,
        InspectionName: "Electrical Systems",
        ProjectId: "P003",
        date: "2025-04-10",
        status: "Pending",
      },
      {
        InspectionCode: 4,
        InspectionName: "Structural Integrity",
        ProjectId: "P004",
        date: "2025-04-11",
        status: "Completed",
      },
      {
        InspectionCode: 5,
        InspectionName: "Plumbing Systems",
        ProjectId: "P005",
        date: "2025-04-12",
        status: "Cancelled",
      },
    ]);

    const handleRedirectToCreate = () => {
      router.push({ name: PAGE_NAME.INSPECTION_REPORT.CREATE });
    };

    const handleGetInspectionDetails = (id) => {
      router.push({name: PAGE_NAME.INSPECTION_REPORT.DETAILS, params: {id}});
    };

    const handleClear = () => {
      searchForms.value.search = "";
    };

    const submitForm = () => {
      searchForms.value.pageIndex = 1;
      currentPage.value = 1;
      // getListCustomers(searchForms.value);
    };

    const handleDisplayModal = (id) => {
      isShowModalConfirm.value = true;
      delete_id.value = id;
    };

    const closeModalConfirm = () => {
      isShowModalConfirm.value = false;
    };

    const handleConfirm = () => {
    };

    return {
      searchForms,
      isShowModalConfirm,
      delete_id,
      listReports,
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
.inspection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.inspection-search {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.inspection-body-table {
  margin-top: 20px;
}
</style>