<template>
  <div class="planning planning-list">
    <div class="planning-header">
      <h3 class="page__ttl">
      <span class="btn-back" @click="handleBack"><IconBackMain/></span>
        {{ $t("planning.title") }}
      </h3>
      <div class="planning-btn-box planning-import-box">
        <el-row
            class="mb-4"
        >
          <el-button class="btn btn-save" @click="handleRedirectToCreate"
          >{{ $t("planning.add_new") }}
          </el-button>
        </el-row>
      </div>
    </div>
    <!--    search and filter-->
    <div class="planning-body">
      <div class="planning-search">
        <div class="planning-search-box col-md-9 col-lg-9">
          <p class="planning-search__ttl">
            {{ $t("planning.keyword") }}
          </p>
          <div class="mb-0 ruleform">
            <el-input
                :placeholder="$t('common.input_keyword')"
                @keyup.enter="submitForm"
                v-model="searchForms.searchValue"
                prop="searchValue"
            >
              <template #append>
                <span @click="handleSearchForm" class="btn-setting">
                  <IconSetting/>
                </span>
              </template>
            </el-input>
          </div>
        </div>
        <div class="btn-search-select col-md-3 col-lg-3 planning-box-btn-all">
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
            <el-form-item :label="$t('planning.customer')">
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item :label="$t('planning.status')">
            </el-form-item>
          </div>
        </div>
      </div>
    </div>

    <div class="bidding-body-table" style="margin-top: 10px; min-height: 480px; overflow-y: auto;">
      <PlanningTable
          :data="listPlanning"
          @details="handleGetPlanningDtls"
          @delete="handleDeletePlanning"
      />
      <LoadMore
          :listData="listPlanning"
          :totalItems="0"
          @loadMore="handleLoadMore"
      />
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
  </div>
</template>

<script>
import IconSetting from "@/svg/IconSettingMain.vue";
import IconCircleClose from "@/svg/IconCircleClose.vue";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import LoadMore from "@/components/common/LoadMore.vue";
import ModalConfirm from "@/components/common/ModalConfirm.vue";
import {onMounted, onUnmounted, reactive, ref} from "vue";
import {NUMBER_FORMAT, TEXT_CONFIRM_DELETE} from "@/constants/application.js";
import {BUSINESS_EMPLOYEE} from "@/constants/roles.js"
import {useRouter} from "vue-router";
import PlanningTable from "@/pages/planning/item/list/PlanningTable.vue";
import PAGE_NAME from "@/constants/route-name.js";
import IconBackMain from "@/svg/IconBackMain.vue";
import {usePersistanceStore} from "@/store/persistance.js";

export default {
  name: "planning-list",
  components: {
    IconBackMain,
    PlanningTable,
    IconSetting,
    IconCircleClose,
    SingleOptionSelect,
    LoadMore,
    ModalConfirm,
  },
  setup() {
    const persistenceStore = usePersistanceStore();

    const {
      projectId
    } = persistenceStore;
    const searchForms = ref({
      keyWord: "",
      status: null,
      customerId: null,
      pageIndex: 1,
    });
    const isShowBoxSearch = ref(false);
    const delete_id = ref();
    const router = useRouter();
    const isDisabled = ref(false);
    const listPlanning = ref([
      {
        id: 1,
        title: "Project Kickoff",
        date: "2025-03-20",
        status: 1,
        creator: "Employee 1",
        tasks: [
          { taskId: 1, name: "Define project scope", completed: false },
          { taskId: 2, name: "Assign team roles", completed: true },
        ],
      },
      {
        id: 2,
        title: "Development Phase 1",
        date: "2025-03-25",
        status: 2,
        creator: "Employee 2",
        tasks: [
          { taskId: 3, name: "Setup project repository", completed: true },
          { taskId: 4, name: "Develop core features", completed: false },
        ],
      },
      {
        id: 3,
        title: "Testing & Review",
        date: "2025-04-05",
        status: 3,
        creator: "Employee 3",
        tasks: [
          { taskId: 5, name: "Unit testing", completed: false },
          { taskId: 6, name: "Code review", completed: false },
        ],
      },
    ]);
    const isShowModalConfirm = ref(false);

    onMounted(() => {
    });

    onUnmounted(() => {
    });

    const handleSearchForm = () => {
      isShowBoxSearch.value = !isShowBoxSearch.value;
    };

    const handleClear = () => {
      searchForms.value.searchValue = "";
      searchForms.value.status = null;
      searchForms.value.customerId = null;
    };

    const handleDisplayCreateModal = (isClose = false) => {
    }

    const submitForm = () => {
      isShowBoxSearch.value = false;
      searchForms.value.pageIndex = 1;
      // currentPage.value = 1;
      // getlistPlanning(searchForms.value);
    };

    const handleLoadMore = () => {
      // currentPage.value++;
      // searchForms.value.pageIndex++;
      // getlistPlanning(searchForms.value);
    };

    const handleRedirectToCreate = () => {
      router.push({name: PAGE_NAME.PLANNING.CREATE})
    };

    const handleGetPlanningDtls = (id) => {
      router.push({name: PAGE_NAME.PLANNING.DETAILS, params: {id: 1}});
    };

    const handleDisplayModal = (customerReqId) => {
      isShowModalConfirm.value = false;
      delete_id.value = customerReqId;
    };

    const handleConfirm = () => {
    };

    const handleCloseModal = () => {
      // validation.value = [];
    };

    const handleDeletePlanning = () => {
      isShowModalConfirm.value = true;
    }

    const handleBack = () => {
      router.push({name: PAGE_NAME.PROJECT.DETAILS, params: {id: projectId.value}});
    }

    return {
      NUMBER_FORMAT,
      TEXT_CONFIRM_DELETE,
      BUSINESS_EMPLOYEE,
      searchForms,
      isDisabled,
      isShowModalConfirm,
      isShowBoxSearch,
      listPlanning,
      handleConfirm,
      handleDisplayModal,
      handleDeletePlanning,
      handleSearchForm,
      handleClear,
      submitForm,
      handleBack,
      handleLoadMore,
      handleCloseModal,
      handleRedirectToCreate,
      handleGetPlanningDtls,
      handleDisplayCreateModal,
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

.planning-chart {
  display: flex;
  justify-content: center;
}

.planning-container {
  display: flex;

  .planning-items {
    width: 80%;
  }

  .planning-task {
    width: 20%;
  }
}
</style>
