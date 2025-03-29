<template>
  <div class="project-details-page">
    <div class="project-header-content">
      <div class="project-header">
        <span class="btn-back" @click="handleBack"><IconBackMain/></span>
        <h3 class="page__ttl">{{ $t("project.title") }}</h3>
      </div>
      <div v-if="projectDetails.value.status === RECEIVE_STATUS">
        <el-button class="btn btn-save" @click="handleChangeStatus(PLANNING_STATUS)">{{ $t("common.approve") }}</el-button>
        <el-button class="btn btn-refuse" @click="handleChangeStatus(CLOSED_STATUS)">{{ $t("common.reject") }}</el-button>
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
            <el-collapse-item name="2">
              <template #title>
                <h3>{{ $t("project.details.financial_summary") }}</h3>
              </template>
              <FinancialSummary :sections="financialData"/>
            </el-collapse-item>
            <el-collapse-item name="3">
              <template #title>
                <h3>{{ $t("project.details.change_request") }}</h3>
              </template>
              <div class="project-body">
                <div class="project-search">
                  <div class="project-search-box col-md-9 col-lg-9">
                    <p class="project-search__ttl">
                      {{ $t("project.keyword") }}
                    </p>
                    <div class="mb-0 ruleform">
                      <el-input
                          :placeholder="$t('common.input_keyword')"
                          @keyup.enter=""
                          v-model="searchCRForms.searchValue"
                          prop="searchValue"
                      >
                        <template #append>
                <span @click="handleCRSearchForm" class="btn-setting">
                  <IconSetting/>
                </span>
                        </template>
                      </el-input>
                    </div>
                  </div>
                  <div class="btn-search-select col-md-3 col-lg-3 project-box-btn-all">
                    <el-button class="btn btn-search" @click="">
                      {{ $t("common.search") }}
                    </el-button
                    >
                    <el-button class="btn btn-clear" @click="">
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
                        <el-select v-model="searchCRForms.status">
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
              <ProjectCR
                  :data="changeRequestData"
              />
              <LoadMore
                  :listData="changeRequestData.value"
                  :totalItems="10"
                  @loadMore="handleLoadMore"
              />
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
                    <el-button v-if="isAllowEdit" class="btn btn-save" @click="handleRedirectToCreate"
                    >{{ $t("project.add_new") }}
                    </el-button>
                  </el-row>
                </div>
              </div>
              <div class="project-body">
                <div class="project-search">
                  <div class="project-search-box col-md-9 col-lg-9">
                    <p class="project-search__ttl">
                      {{ $t("project.keyword") }}
                    </p>
                    <div class="mb-0 ruleform">
                      <el-input
                          :placeholder="$t('common.input_keyword')"
                          @keyup.enter=""
                          v-model="contractSearchForms.keyWord"
                          prop="keyWord"
                      >
                        <template #append>
                <span @click="handleContractSearchForm" class="btn-setting">
                  <IconSetting/>
                </span>
                        </template>
                      </el-input>
                    </div>
                  </div>
                  <div class="btn-search-select col-md-3 col-lg-3 project-box-btn-all">
                    <el-button class="btn btn-search" @click="handleSearchContract(true)">
                      {{ $t("common.search") }}
                    </el-button
                    >
                    <el-button class="btn btn-clear" @click="handleClearSearchContractForm">
                      {{ $t("common.clear") }}
                    </el-button
                    >
                  </div>
                </div>
                <div class="form-search" :class="{ active: isShowBoxContractSearch }">
                  <div class="close-form">
                    <IconCircleClose @click="isShowBoxContractSearch = false"/>
                  </div>
                  <div class="form-search-box">
                    <div class="item">
                      <el-form-item :label="$t('project.status')">
                        <el-date-picker
                            v-model="contractSearchForms.signDate"
                            :value-format="DATE_FORMAT"
                            type="date"
                            placeholder="Select Date"
                            class="input-wd-96"
                        />
                      </el-form-item>
                    </div>
                  </div>
                </div>
              </div>
              <ContractList
                  :data="listContracts.value"
                  @details="getContractDetails"
              />
              <LoadMore
                  :listData="listContracts.value"
                  :totalItems="totalItems.value"
                  @loadMore="handleSearchContract"
              />
            </el-collapse-item>
            <el-collapse-item name="5">
              <template #title>
                <h3>{{ $t("project.details.site_survey") }}</h3>
              </template>
              <SiteSurveyInfo
                  :data="siteSurveyDetails.value"
                  :isSurveyNull="!siteSurveyDetails.value"
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
import {onMounted, onUnmounted, ref} from "vue";
import {useI18n} from "vue-i18n";
import {useRoute, useRouter} from "vue-router";
import {DATE_FORMAT} from "@/constants/application.js";
import ProjectInfor from "./item/details/ProjectInfor.vue"
import { onMounted, onUnmounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { DATE_FORMAT, TEXT_CONFIRM_DELETE } from "@/constants/application.js";
import ProjectInfor from "./item/details/ProjectInfor.vue";
import FinancialSummary from "./item/list/FinancialSummary.vue";
import ProjectCR from "./item/details/ProjectCR.vue";
import IconCircleClose from "@/svg/IconCircleClose.vue";
import IconSetting from "@/svg/IconSettingMain.vue";
import {STATUSES, PLANNING_STATUS, CLOSED_STATUS, RECEIVE_STATUS} from "@/constants/project.js";
import LoadMore from "@/components/common/LoadMore.vue";
import { useProjectStore } from "@/store/project.js";
import ContractList from "@/pages/contract/item/ContractTable.vue";
import { useContractStore } from "@/store/contract.js";
import SiteSurveyInfo from "@/pages/site_survey/SiteSurveyInfo.vue";
import {useSiteSurveyStore} from "@/store/site-survey.js";
import {usePersistanceStore} from "@/store/persistance.js";
import {BUSINESS_EMPLOYEE} from "@/constants/roles.js";

export default {
  name: "ProjectDetails",
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
    const persist = usePersistanceStore();

    const {
      isShowModalConfirm,
      projectDetails,
      getProjectDetails,
      saveProject
    } = projectStore;

    const {
      listContracts,
      totalItems,
      currentPage,
      getListContracts,
    } = contractStore;

    const {
      listSurveys,
      getListSurveys
    } = surveyStore;

    const {
      projectId
    } = persist;

    const activeCollapseItems = ref(["3", "2", "4"]);
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
    const siteSurveyDate = ref([]);

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
    const isAllowEdit = ref(localStorage.getItem('role') === BUSINESS_EMPLOYEE && projectDetails.value.status === RECEIVE_STATUS && listSurveys.value.length > 0);

    const { getProjectDetails, projectDetails } = projectStore;

    const { listContracts, totalItems, currentPage, getListContracts } = contractStore;

    const { siteSurveyDetails, getSurveyDetails } = surveyStore;

    onMounted(() => {
      getProjectDetails(route.params.id);
      getListContracts(contractSearchForms.value);
      getSurveyDetails(route.params.id);
    });

    onUnmounted(() => {});

    const getContractDetails = (id) => {
      projectId.value = route.params.id;
      router.push({name: PAGE_NAME.CONTRACT.DETAILS, params: {id}});
    }

    const getSiteSurveyDetails = () => {
      router.push({ name: PAGE_NAME.SITE_SURVEY.DETAILS, params: { id: route.params.id } });
    };

    const handleCreateSiteSurvey = () => {
      router.push({ name: PAGE_NAME.SITE_SURVEY.CREATE, params: { projectId: route.params.id } });
    };

    const handleRedirectToEdit = () => {
      router.push({ name: PAGE_NAME.PROJECT.EDIT, params: { id: route.params.id } });
    };

    const handleBack = () => {
      router.push({ name: PAGE_NAME.PROJECT.LIST });
    };

    const onSubmit = (isUpdate) => {};

    const handleOpenModalConfirm = (id) => {};

    const handleCloseModal = () => {};

    const handleContractSearchForm = () => {
      isShowBoxContractSearch.value = !isShowBoxContractSearch.value;
    };

    const handleSearchContract = (isSearch = false) => {
      currentPage.value = isSearch ? 1 : currentPage.value + 1;
      contractSearchForms.value.pageIndex = isSearch ? 1 : contractSearchForms.value.pageIndex + 1;
      getListContracts(contractSearchForms.value);
    };

    const closeModalConfirm = () => {
      isShowModalConfirm.value = false;
    }

    const handleConfirm = () => {
      if(actionText.value === t('common.approve')) {
        projectDetails.value.status = PLANNING_STATUS;
      } else projectDetails.value.status = CLOSED_STATUS;
      saveProject(projectDetails.value);
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
      projectId.value = route.params.id;
      router.push({name: PAGE_NAME.CONTRACT.CREATE});
    }

    const handleChangeStatus = (status) => {
      isShowModalConfirm.value = true;
      if(status === PLANNING_STATUS) actionText.value = t('common.approve');
      else actionText.value = t('common.reject');
    }

    return {
      DATE_FORMAT,
      STATUSES,
      CLOSED_STATUS,
      RECEIVE_STATUS,
      PLANNING_STATUS,
      financialData,
      projectDetails,
      changeRequestData,
      isShowModalConfirm,
      activeCollapseItems,
      searchCRForms,
      isShowBoxSearch,
      isShowBoxContractSearch,
      contractSearchForms,
      listContracts,
      siteSurveyDetails,
      totalItems,
      isAllowEdit,
      actionText,
      closeModalConfirm,
      handleChangeStatus,
      handleConfirm,
      handleBack,
      handleRedirectToCreate,
      handleRedirectToEdit,
      getSiteSurveyDetails,
      handleContractSearchForm,
      handleClearSearchContractForm,
      handleSearchContract,
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