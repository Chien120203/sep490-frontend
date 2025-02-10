<template>
  <div class="project project-list">
    <div class="project-header">
      <h3 class="page__ttl">{{ $t("project.title") }}</h3>
      <div class="project-btn-box project-import-box">
        <el-row
            class="mb-4"
        >
          <el-button class="btn btn-save" @click="handleRedirectToCreate"
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
              <el-select v-model="searchForms.customerId" @change="handleCustomerChange">
                <el-option :label="$t('common.all')" value=""></el-option>
                <el-option
                    v-for="(cust, index) in listCustomers.value"
                    :key="index"
                    :label="cust.customer_code"
                    :value="cust.id"
                >
                </el-option>
              </el-select>
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

    <div class="bidding-body-table" style="margin-top: 16px; min-height: 400px">
      <ProjectTable
          :data="listProjects.value"
          @details="handleGetProjectDtls"
          @delete="handleDeleteProject"
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
import {onMounted, onUnmounted, ref} from "vue";
import {NUMBER_FORMAT, TEXT_CONFIRM_DELETE} from "@/constants/application.js";
import {useRouter} from "vue-router";
import {STATUSES} from "@/constants/project.js";
import ProjectTable from "@/pages/project/item/ProjectTable.vue";
import {useProjectStore} from "@/store/project.js";
import {useCustomerStore} from "@/store/customer.js";

export default {
  name: "customer-reqList",
  components: {
    ProjectTable,
    IconSetting,
    IconCircleClose,
    SingleOptionSelect,
    LoadMore,
    ModalConfirm,
  },
  setup() {
    const searchForms = ref({
      searchValue: "",
      status: null,
      customerId: null,
      pageNo: 0,
    });
    const projectStore = useProjectStore();
    const customerStore = useCustomerStore();
    const isShowBoxSearch = ref(false);
    const {
      validation,
      listProjects, // temporary
      totalItems,
      currentPage,
      projectDetails,
      isShowModalConfirm,
      getListProjects,
      handleGetProjectDtls,
      handleDeleteProject
    } = projectStore;
    const {
      listCustomers,
      getListCustomers
    } = customerStore;
    const delete_id = ref();
    const router = useRouter();
    const isDisabled = ref(false);

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

    const submitForm = () => {
      searchForms.value.pageNo = 0;
      currentPage.value = 0;
    };

    const handleLoadMore = () => {
      currentPage.value++;
      searchForms.value.pageNo++;
    };


    const handleRedirectToCreate = () => {
      router.push({name: ""})
    };

    const handleGetCustomeReqDtls = (id) => {
      router.push({name: "", params: {id}});
    };

    const handleCloseModal = () => {
      validation.value = [];
    };

    const handleDisplayModal = (customerReqId) => {
      isShowModalConfirm.value = !!customerReqId;
      delete_id.value = customerReqId;
    };

    const handleConfirm = () => {
      handleDeleteCustomerReq(delete_id.value);
    };

    return {
      NUMBER_FORMAT,
      TEXT_CONFIRM_DELETE,
      STATUSES,
      listProjects,
      searchForms,
      isDisabled,
      totalItems,
      isShowModalConfirm,
      listCustomers,
      isShowBoxSearch,
      handleSearchForm,
      handleClear,
      submitForm,
      handleLoadMore,
      handleDisplayModal,
      handleCloseModal,
      handleConfirm,
      handleRedirectToCreate,
      handleGetProjectDtls,
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
</style>
