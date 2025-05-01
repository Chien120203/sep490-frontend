<template>
  <div class="project project-list">
    <div class="project-header">
      <h3 class="page__ttl">{{ $t("project.title") }}</h3>
      <div class="project-btn-box project-import-box">
        <el-row
            class="mb-4"
        >
          <el-button v-if="allowCreateProject" class="btn btn-save" @click="handleRedirectToCreate"
          >{{ $t("project.add_new") }}
          </el-button>
        </el-row>
      </div>
    </div>

    <!--    DASHBOARD AND USER TASK-->
    <div class="project-container">
      <div class="project-items">
        <!--    charts-->
        <div class="project-body">
          <div v-if="listProjects.value !== 0" class="project-chart">
            <DonutChart :chart-data="chartData"/>
          </div>
        </div>

        <!--    financialData-->
        <div class="project-body">
          <FinancialSummary :sections="financialData"/>
        </div>
      </div>
      <!--    Task And CR-->
      <div class="project-task">
        <TaskAndCR :title="'HÔM NAY'" :date="'Thứ 5, ngày 13/02/2025'" :tasks="tasks"/>
      </div>
    </div>

    <!--    search and filter-->
    <div class="project-body">
      <div class="project-search">
        <div class="project-search-box col-md-9 col-lg-9">
          <p class="project-search__ttl">
            {{ $t("project.keyword") }}
          </p>
          <div class="mb-0 ruleform">
            <el-input
                :placeholder="$t('common.input_keyword')"
                @keyup.enter="submitForm"
                v-model="searchForms.keyWord"
                prop="keyWord"
            >
              <template #append>
                <span @click="handleSearchForm" class="btn-setting">
                  <IconSetting/>
                </span>
              </template>
            </el-input>
          </div>
        </div>
        <div class="btn-search-select col-md-3 col-lg-3 project-box-btn-all">
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
            <el-form-item :label="$t('project.customer')">
              <SingleOptionSelect
                  v-model="searchForms.customerId"
                  :optionKeys="{ id: 'id', value: 'customerCode' }"
                  :listData="listCustomers.value"
                  :isRemote="true"
                  :disabled="isDisabled"
                  @remoteSearch="handleSearchCustomer"
              />
            </el-form-item>
          </div>
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

    <div class="bidding-body-table" style="margin-top: 10px; min-height: 480px; overflow-y: auto;">
      <ProjectTable
          :data="listProjects.value"
          @details="handleToProjectDtls"
          @delete="handleDisplayModal"
      />
      <LoadMore
          :listData="listProjects.value"
          :totalItems="totalItems.value"
          @loadMore="handleLoadMore"
      />
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

<script>
import IconSetting from "@/svg/IconSettingMain.vue";
import IconCircleClose from "@/svg/IconCircleClose.vue";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import LoadMore from "@/components/common/LoadMore.vue";
import ModalConfirm from "@/components/common/ModalConfirm.vue";
import {computed, onMounted, onUnmounted, reactive, ref} from "vue";
import {NUMBER_FORMAT, TEXT_CONFIRM_DELETE} from "@/constants/application.js";
import {ADMIN, BUSINESS_EMPLOYEE} from "@/constants/roles.js"
import {useRouter} from "vue-router";
import {STATUSES} from "@/constants/project.js";
import ProjectTable from "@/pages/project/item/list/ProjectTable.vue";
import {useProjectStore} from "@/store/project.js";
import {useCustomerStore} from "@/store/customer.js";
import DonutChart from "./item/list/ProjectChart.vue";
import FinancialSummary from "./item/list/FinancialSummary.vue";
import TaskAndCR from "@/pages/project/item/list/TaskAndCR.vue";
import PAGE_NAME from "@/constants/route-name.js";
import {usePersistenceStore} from "@/store/persistence.js";

export default {
  name: "customer-reqList",
  components: {
    ProjectTable,
    IconSetting,
    IconCircleClose,
    SingleOptionSelect,
    LoadMore,
    ModalConfirm,
    DonutChart,
    TaskAndCR,
    FinancialSummary,
  },
  setup() {
    const searchForms = ref({
      keyWord: "",
      status: null,
      customerId: null,
      pageIndex: 1,
    });
    const projectStore = useProjectStore();
    const persist = usePersistenceStore();
    const customerStore = useCustomerStore();
    const isShowBoxSearch = ref(false);
    const role = localStorage.getItem('role');
    const allowCreateProject = computed(() => role === BUSINESS_EMPLOYEE)
    const {
      validation,
      listProjects, // temporary
      totalItems,
      currentPage,
      projectDetails,
      isShowModalConfirm,
      chartData,
      isShowModalCreate,
      getListProjects,
      getProjectChart,
      handleDeleteProject
    } = projectStore;
    const {
      projectId,
      loggedIn
    } = persist;
    const {
      listCustomers,
      getListCustomers
    } = customerStore;
    const delete_id = ref();
    const router = useRouter();
    const isDisabled = ref(false);

    //sample data
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
    const tasks = ref([
      {title: 'Công việc hôm nay', expanded: false, color: 'orange'},
      {title: 'Lịch họp', expanded: false, color: 'green'},
      {title: 'Đề xuất cần duyệt', expanded: false, color: 'blue'},
      {title: 'Phiếu thu/chi cần duyệt', expanded: false, color: 'blue'},
      {title: 'Văn bản cần xử lý', expanded: false, color: 'teal'},
    ]);

    onMounted(() => {
      if(role === ADMIN) router.push({name: PAGE_NAME.USER.LIST});
      projectId.value = null;
      if (loggedIn.value) {
        getListProjects(searchForms.value);
        getListCustomers();
        getProjectChart();
      }
    });

    onUnmounted(() => {
    });

    const handleSearchForm = () => {
      isShowBoxSearch.value = !isShowBoxSearch.value;
    };

    const handleClear = () => {
      searchForms.value.keyWord = "";
      searchForms.value.status = null;
      searchForms.value.customerId = null;
    };

    const handleDisplayCreateModal = (isClose = false) => {
      isShowModalCreate.value = !!isClose;
    }

    const submitForm = () => {
      isShowBoxSearch.value = false;
      searchForms.value.pageIndex = 1;
      currentPage.value = 1;
      getListProjects(searchForms.value);
    };

    const handleLoadMore = () => {
      currentPage.value++;
      searchForms.value.pageIndex++;
      getListProjects(searchForms.value);
    };

    const handleRedirectToCreate = () => {
      router.push({name: PAGE_NAME.PROJECT.CREATE})
    };

    const handleToProjectDtls = (id) => {
      router.push({name: PAGE_NAME.PROJECT.DETAILS, params: {id}});
    };

    const handleCloseModal = () => {
      validation.value = [];
    };

    const handleDisplayModal = (customerReqId) => {
      isShowModalConfirm.value = !!customerReqId;
      delete_id.value = customerReqId;
    };

    const handleConfirm = () => {
      handleDeleteProject(delete_id.value);
    };

    const handleSearchCustomer = (searchValue) => {
      getListCustomers({search: searchValue, pageIndex: 1}, false);
    }

    return {
      NUMBER_FORMAT,
      TEXT_CONFIRM_DELETE,
      STATUSES,
      BUSINESS_EMPLOYEE,
      listProjects,
      searchForms,
      isDisabled,
      role,
      totalItems,
      isShowModalConfirm,
      listCustomers,
      isShowBoxSearch,
      tasks,
      financialData,
      chartData,
      validation,
      isShowModalCreate,
      projectDetails,
      allowCreateProject,
      handleSearchForm,
      handleSearchCustomer,
      handleClear,
      submitForm,
      handleLoadMore,
      handleDisplayModal,
      handleCloseModal,
      handleConfirm,
      handleRedirectToCreate,
      handleToProjectDtls,
      handleDisplayCreateModal,
      handleDeleteProject
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

.project-chart {
  display: flex;
  justify-content: center;
}

.project-container {
  display: flex;

  .project-items {
    width: 80%;
  }

  .project-task {
    width: 20%;
  }
}
</style>
