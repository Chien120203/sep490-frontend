<template>
  <div class="project-details-page">
    <div class="project-header-content">
      <div class="project-header">
        <span class="btn-back" @click="handleBack"><IconBackMain/></span>
        <h3 class="page__ttl">{{ $t("project.title") }}</h3>
      </div>
      <div v-if="isAllowApprove">
        <el-button v-if="projectStatus === RECEIVE_STATUS" class="btn btn-save" @click="handleChangeStatus(PLANNING_STATUS)">{{ $t("common.approve") }}</el-button>
        <el-button v-if="projectStatus !== COMPLETE || projectStatus !== CLOSED_STATUS" class="btn btn-refuse" @click="handleChangeStatus(CLOSED_STATUS)">{{ $t("common.close") }}</el-button>
        <el-button v-if="projectStatus === WAIT_TO_COMPLETE" type="success" class="btn" @click="handleChangeStatus(COMPLETE)">{{ $t("common.complete") }}</el-button>
      </div>
    </div>
    <div class="project-details-infor">
      <el-row class="project-detail-collapse">
        <el-col :span="24">
          <el-collapse v-model="activeCollapseItems">
            <el-collapse-item name="1">
              <template #title>
                <h3>{{ $t("project.details.title") }}</h3>
              </template>
              <ProjectInfor
                  :project="projectDetails.value"
                  @edit="handleRedirectToEdit"
              />
            </el-collapse-item>
            <el-collapse-item v-if="false" name="2">
              <template #title>
                <h3>{{ $t("project.details.financial_summary") }}</h3>
              </template>
              <FinancialSummary :sections="financialData"/>
            </el-collapse-item>
            <el-collapse-item name="4">
              <template #title>
                <h3>{{ $t("contract.title") }}</h3>
              </template>
              <div class="contract-header">
                <div class="project-btn-box project-import-box">
                  <el-row
                      class="mb-4"
                  >
                    <el-button v-if="isAllowCreateContract" class="btn btn-save" @click="handleRedirectToCreate"
                    >{{ $t("project.add_new") }}
                    </el-button>
                  </el-row>
                </div>
              </div>
              <ContractList
                  :data="contractDetails.value"
                  @details="getContractDtls"
              />
            </el-collapse-item>
            <el-collapse-item name="5">
              <template #title>
                <h3>{{ $t("project.details.site-survey") }}</h3>
              </template>
              <SiteSurveyInfo
                  :data="siteSurveyDetails.value"
                  :isSurveyNull="isSiteSurveyNull.value"
                  :allowCreate="isAllowCreateSiteSurvey"
                  @details="getSiteSurveyDetails"
                  @create="handleCreateSiteSurvey"
              />
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>
    </div>
    <ModalConfirm
        :isShowModal="isShowModalConfirm.value"
        @close-modal="closeModalConfirm"
        @confirmAction="handleConfirm"
        :message="$t('project.modal_confirm.message', {action: actionText})"
        :title="$t('project.modal_confirm.title')"
    />
  </div>
</template>

<script>
import Modal from "@/components/common/Modal.vue";
import ModalConfirm from "@/components/common/ModalConfirm.vue";
import IconBackMain from "@/svg/IconBackMain.vue";
import PAGE_NAME from "@/constants/route-name.js";
import {computed, onMounted, ref} from "vue";
import {useI18n} from "vue-i18n";
import {useRoute, useRouter} from "vue-router";
import {DATE_FORMAT} from "@/constants/application.js";
import ProjectInfor from "./item/details/ProjectInfor.vue"
import FinancialSummary from "./item/list/FinancialSummary.vue";
import ProjectCR from "./item/details/ProjectCR.vue";
import IconCircleClose from "@/svg/IconCircleClose.vue";
import IconSetting from "@/svg/IconSettingMain.vue";
import {
  STATUSES,
  PLANNING_STATUS,
  CLOSED_STATUS,
  RECEIVE_STATUS,
  WAIT_TO_COMPLETE,
  COMPLETE
} from "@/constants/project.js";
import LoadMore from "@/components/common/LoadMore.vue";
import { useProjectStore } from "@/store/project.js";
import ContractList from "@/pages/contract/item/ContractTable.vue";
import { useContractStore } from "@/store/contract.js";
import SiteSurveyInfo from "@/pages/site-survey/SiteSurveyInfo.vue";
import {useSiteSurveyStore} from "@/store/site-survey.js";
import {usePersistenceStore} from "@/store/persistence.js";
import {BUSINESS_EMPLOYEE, EXECUTIVE_BOARD, TECHNICAL_MANAGER} from "@/constants/roles.js";

export default {
  name: "ProjectDetails",
  methods: {
    WAIT_TO_COMPLETE() {
      return WAIT_TO_COMPLETE
    }
  },
  components: {
    SiteSurveyInfo,
    ContractList: ContractList,
    LoadMore,
    IconSetting,
    IconCircleClose,
    FinancialSummary,
    Modal,
    ProjectInfor,
    ProjectCR,
    ModalConfirm,
    IconBackMain,
  },
  setup() {
    const { t } = useI18n();
    const route = useRoute();
    const router = useRouter();
    const projectStore = useProjectStore();
    const contractStore = useContractStore();
    const surveyStore = useSiteSurveyStore();
    const persist = usePersistenceStore();

    const {
      isShowModalConfirm,
      projectDetails,
      getProjectDetails,
      updateProjectStatus,
      saveProject
    } = projectStore;

    const {
      totalItems,
      contractDetails,
      getContractDetails,
    } = contractStore;

    const { siteSurveyDetails, isSiteSurveyNull, getSurveyDetails } = surveyStore;

    const {
      projectId,
      loggedIn
    } = persist;

    const activeCollapseItems = ref(["3", "2", "4", "5", "1"]);
    const changeRequestData = ref([
      {
        id: 1,
        request_code: "CR-001",
        request_name: "Update UI Design",
        requested_by: "John Doe",
        change_type: "UI Enhancement",
        status: "Pending",
        request_date: "2024-02-15T10:30:00",
      },
      {
        id: 2,
        request_code: "CR-002",
        request_name: "Database Migration",
        requested_by: "Alice Smith",
        change_type: "Infrastructure",
        status: "Approved",
        request_date: "2024-02-10T14:20:00",
      },
    ]);
    const financialData = ref([
      {
        title: "CHỦ ĐẦU TƯ (CĐT)",
        bgColor: "#DFF5E1",
        data: [
          { label: "Hợp đồng", value: 484974055904 },
          { label: "Đã thực hiện", value: 30226660535 },
          { label: "Đã nghiệm thu", value: 29676324721 },
          { label: "CĐT còn nợ", value: -18958404654 },
        ],
      },
      {
        title: "NHÀ THẦU (NT)",
        bgColor: "#FEE2E2",
        data: [
          { label: "Hợp đồng", value: 36644729318 },
          { label: "Đã thực hiện", value: 11101225831 },
          { label: "Còn nợ NT", value: -2580925000 },
        ],
      },
      {
        title: "NHÀ CUNG CẤP (NCC)",
        bgColor: "#FFF5D1",
        data: [
          { label: "Hợp đồng", value: 31715860099 },
          { label: "Còn nợ NCC", value: 5369219239 },
        ],
      },
    ]);

    const isShowBoxSearch = ref(false);
    const actionText = ref('');
    const isShowBoxContractSearch = ref(false);
    const contractSearchForms = ref({
      keyWord: "",
      pageIndex: 1,
      projectId: route.params.id,
      signDate: "",
    });
    const searchCRForms = ref({
      searchValue: "",
      pageIndex: 1,
    });
    const isAllowEdit = ref(localStorage.getItem('role') === BUSINESS_EMPLOYEE && projectDetails.value.status === RECEIVE_STATUS);
    const isAllowCreateContract = computed(() => (localStorage.getItem('role') === BUSINESS_EMPLOYEE && projectDetails.value.status === RECEIVE_STATUS && contractDetails.value.id === 0));
    const isAllowApprove = computed(() => (localStorage.getItem('role') === EXECUTIVE_BOARD));
    const projectStatus = computed(() => projectDetails.value.status);
    const isAllowCreateSiteSurvey = computed(() => (localStorage.getItem('role') === TECHNICAL_MANAGER && isSiteSurveyNull.value));
    onMounted(async () => {
      projectId.value = route.params.id;
      if (loggedIn.value) {
        await getProjectDetails(route.params.id);
        projectStatus.value = projectDetails.value.status;
        await getContractDetails(projectId.value, false);
        await getSurveyDetails(route.params.id, false);
      }
    });

    const getSiteSurveyDetails = () => {
      router.push({ name: PAGE_NAME.SITE_SURVEY.DETAILS, params: { id: route.params.id } });
    };

    const handleCreateSiteSurvey = () => {
      router.push({ name: PAGE_NAME.SITE_SURVEY.CREATE });
    };

    const handleRedirectToEdit = () => {
      router.push({ name: PAGE_NAME.PROJECT.EDIT, params: { id: route.params.id } });
    };

    const getContractDtls = (id) => {
      router.push({name: PAGE_NAME.CONTRACT.DETAILS, params: {id}});
    }

    const handleBack = () => {
      router.push({ name: PAGE_NAME.PROJECT.LIST });
    };

    const handleContractSearchForm = () => {
      isShowBoxContractSearch.value = !isShowBoxContractSearch.value;
    };

    const closeModalConfirm = () => {
      isShowModalConfirm.value = false;
    }

    const handleConfirm = () => {
      let status = null;
      if(actionText.value === t('common.approve')) {
        status = PLANNING_STATUS;
      } else if (actionText.value === t('project.statuses.wait_to_complete')) {
        status = COMPLETE;
      } else status = CLOSED_STATUS;
      updateProjectStatus(projectDetails.value.id, status);
      isShowModalConfirm.value = false;
    };

    const handleClearSearchContractForm = () => {
      contractSearchForms.value = {
        keyWord: "",
        pageIndex: 1,
        signDate: "",
      };
    };

    const handleRedirectToCreate = () => {
      router.push({name: PAGE_NAME.CONTRACT.CREATE});
    }

    const handleChangeStatus = (status) => {
      isShowModalConfirm.value = true;
      if(status == PLANNING_STATUS) actionText.value = t('common.approve');
      if(status == COMPLETE) actionText.value = t('project.statuses.wait_to_complete');
      if(status == CLOSED_STATUS) actionText.value = t('common.close');
    }

    return {
      DATE_FORMAT,
      STATUSES,
      CLOSED_STATUS,
      RECEIVE_STATUS,
      PLANNING_STATUS,
      WAIT_TO_COMPLETE,
      COMPLETE,
      financialData,
      projectStatus,
      isAllowCreateContract,
      isAllowApprove,
      projectDetails,
      isSiteSurveyNull,
      changeRequestData,
      isShowModalConfirm,
      activeCollapseItems,
      searchCRForms,
      isShowBoxSearch,
      isAllowCreateSiteSurvey,
      isShowBoxContractSearch,
      contractSearchForms,
      siteSurveyDetails,
      totalItems,
      contractDetails,
      isAllowEdit,
      actionText,
      closeModalConfirm,
      getContractDtls,
      handleChangeStatus,
      handleConfirm,
      handleBack,
      handleRedirectToCreate,
      handleRedirectToEdit,
      getSiteSurveyDetails,
      handleContractSearchForm,
      handleClearSearchContractForm,
      getContractDetails,
      handleCreateSiteSurvey,
    };
  },
};
</script>

<style scoped lang="scss">
.project-details-page {
  padding: 20px;

  .project-header {
    display: flex;
    justify-content: left;
  }

  .project-details-infor {
    display: flex;

    .project-details-card-container {
      width: 40%;
      position: sticky;
    }

    .project-details-collapse {
      width: 60%;
      margin-left: 24px !important;
    }
  }
}
.project-header-content {
  display: flex;
  justify-content: space-between;
}
.contract-header {
  display: flex;
  justify-content: end;
}

.form-search-box {
  width: 74%;
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1019607843);
  border: 1px solid #f6f6fb;
  padding: 14px 24px;
}

.close-form {
  position: absolute;
  display: flex;
  justify-content: end;
  right: 27%;
  top: 10px;
  cursor: pointer;
}

.box-card {
  height: 90%;
}

.project-details-card {
  height: auto;
}

.list-users {
  text-align: center;
  margin-bottom: 20px;
}

.user-actions {
  display: flex;
  justify-content: space-around;

  .btn {
    width: 90%;
  }
}

.info-card {
  padding: 20px;
}

h3 {
  margin: auto 12px;
}
</style>