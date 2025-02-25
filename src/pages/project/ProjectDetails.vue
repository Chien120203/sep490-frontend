<template>
  <div class="project-details-page">
    <div class="project-header">
      <span class="btn-back" @click="handleBack"><IconBackMain/></span>
      <h3 class="page__ttl">{{ $t("project.title") }}</h3>
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
              <ContractList
                  :data="changeRequestData"
                  @details="getContractDetails"
              />
              <LoadMore
                  :listData="changeRequestData.value"
                  :totalItems="10"
                  @loadMore="handleLoadMore"
              />
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>
    </div>
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
import {TEXT_CONFIRM_DELETE} from "@/constants/application.js";
import ProjectInfor from "./item/details/ProjectInfor.vue"
import FinancialSummary from "./item/list/FinancialSummary.vue";
import ProjectCR from "./item/details/ProjectCR.vue";
import IconCircleClose from "@/svg/IconCircleClose.vue";
import IconSetting from "@/svg/IconSettingMain.vue";
import {STATUSES} from "@/constants/project.js";
import LoadMore from "@/components/common/LoadMore.vue";
import {useProjectStore} from "@/store/project.js";
import ContractList from "@/pages/project/item/contract/ContractList.vue";

export default {
  name: "ProjectDetails",
  components: {
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
    const {t} = useI18n();
    const route = useRoute();
    const router = useRouter();
    const projectStore = useProjectStore();
    const activeCollapseItems = ref(["3", "2"]);
    const projectData = ref({
      title: 'Cơ điện M&E',
      startDate: '01/06/2023',
      endDate: '02/03/2024',
      status: 'Chậm trễ',
      budget: 60000000000,
      income: 33129000000,
      expense: 25256700000,
      plannedProgress: 98,
      actualProgress: 23,
      completedWorks: 97
    });
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
          {label: "Hợp đồng", value: 484974055904},
          {label: "Đã thực hiện", value: 30226660535},
          {label: "Đã nghiệm thu", value: 29676324721},
          {label: "CĐT còn nợ", value: -18958404654},
        ],
      },
      {
        title: "NHÀ THẦU (NT)",
        bgColor: "#FEE2E2",
        data: [
          {label: "Hợp đồng", value: 36644729318},
          {label: "Đã thực hiện", value: 11101225831},
          {label: "Còn nợ NT", value: -2580925000},
        ],
      },
      {
        title: "NHÀ CUNG CẤP (NCC)",
        bgColor: "#FFF5D1",
        data: [
          {label: "Hợp đồng", value: 31715860099},
          {label: "Còn nợ NCC", value: 5369219239},
        ],
      },
    ]);
    const searchCRForms = ref({
      searchValue: "",
    });
    const {
      getProjectDetails,
      projectDetails
    } = projectStore;
    const isShowBoxSearch = ref(false);

    onMounted(() => {
      getProjectDetails(route.params.id);
    });

    onUnmounted(() => {
    });

    const getContractDetails = (id) => {
      router.push({name: PAGE_NAME.CONTRACT.DETAILS, params: {id}});
    }

    // const handleDisplayModal = (user_id) => {
    //   isShowModalConfirm.value = !!user_id;
    //   delete_id.value = user_id;
    // };

    const handleRedirectToEdit = () => {
      router.push({name: PAGE_NAME.PROJECT.EDIT, params: {id: route.params.id}});
    }

    const handleBack = () => {
      router.push({name: PAGE_NAME.PROJECT.LIST});
    };

    const onSubmit = (isUpdate) => {
    };

    const handleOpenModalConfirm = (id) => {
    };

    const handleCloseModal = () => {
    };
    const handleCRSearchForm = () => {
      isShowBoxSearch.value = true;
    };

    const handleLoadMore = () => {

    };

    const handleAddTenants = (listAddTenants) => {
    };

    const handleConfirm = () => {
    };

    return {
      financialData,
      projectDetails,
      changeRequestData,
      activeCollapseItems,
      searchCRForms,
      isShowBoxSearch,
      TEXT_CONFIRM_DELETE,
      STATUSES,
      handleBack,
      handleLoadMore,
      handleCloseModal,
      handleConfirm,
      handleOpenModalConfirm,
      handleRedirectToEdit,
      onSubmit,
      handleCRSearchForm,
      getContractDetails,
      handleAddTenants,
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
