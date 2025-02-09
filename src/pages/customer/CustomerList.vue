<template>
  <div class="customer customer-list">
    <div class="customer-header">
      <h3 class="page__ttl">{{ $t("customer.title") }}</h3>
      <div class="customer-btn-box customer-import-box">
        <el-row
          class="mb-4"
        >
          <el-button class="btn btn-save" @click="handleRedirectToCreate"
            >{{ $t("customer.add_new") }}
          </el-button>
        </el-row>
      </div>
    </div>
    <div class="customer-body">
      <div class="customer-search">
        <div class="customer-search-box col-md-9 col-lg-9">
          <p class="customer-search__ttl">
            {{ $t("customer.keyword") }}
          </p>
          <div class="mb-0 ruleform">
            <el-input
              :placeholder="$t('common.input_keyword')"
              @keyup.enter="submitForm"
              v-model="searchForms.searchValue"
              prop="searchValue"
            >
            </el-input>
          </div>
        </div>
        <div class="btn-search-select col-md-3 col-lg-3 customer-box-btn-all">
          <el-button class="btn btn-search" @click="submitForm()">
            {{ $t("common.search") }}</el-button
          >
          <el-button class="btn btn-clear" @click="handleClear()">
            {{ $t("common.clear") }}</el-button
          >
        </div>
      </div>
    </div>

    <div class="bidding-body-table" style="margin-top: 16px; min-height: 400px">
      <CustomerTable
        :data="listCustomers.value"
        @details="handleGetCustomerDtls"
        @delete="handleDisplayModal"
      />
      <LoadMore
        :listData="listCustomers.value"
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
      :message="$t('customer.modal_confirm.message')"
      :title="$t('customer.modal_confirm.title')"
    />
  </div>
</template>

<script>
import IconSetting from "@/svg/IconSettingMain.vue";
import IconCircleClose from "@/svg/IconCircleClose.vue";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import LoadMore from "@/components/common/LoadMore.vue";
import ModalConfirm from "@/components/common/ModalConfirm.vue";
import CustomerTable from "./item/CustomerTable.vue";
import { onMounted, onUnmounted, ref } from "vue";
import { NUMBER_FORMAT } from "@/constants/application.js";
import { TEXT_CONFIRM_DELETE } from "@/constants/application.js";
import { ADMIN, LANDLORD } from "@/constants/roles.js";
import { mixinMethods } from "@/utils/variables";
import {useCustomerStore} from "@/store/customer.js";
import { useRouter } from "vue-router";
import PAGE_NAME from "@/constants/route-name.js";

export default {
  name: "CustomerList",
  components: {
    IconSetting,
    IconCircleClose,
    SingleOptionSelect,
    LoadMore,
    CustomerTable,
    ModalConfirm,
  },
  setup() {
    const searchForms = ref({
      searchValue: "",
      status: null,
      roomId: null,
      startDate: "",
      endDate: "",
      tenantId: null,
      type: null,
      landlordId: null,
      pageNo: 0,
    });
    const delete_id = ref();
    const router = useRouter();
    const customerStore = useCustomerStore();
    const {
      validation,
      listCustomers, // temporary
      totalItems,
      currentPage,
      isShowModalConfirm,
      getListCustomers,
      handleDeleteCustomer
    } = customerStore;
    const isDisabled = ref(false);

    onMounted(() => {
      getListCustomers(searchForms.value);
    });

    onUnmounted(() => {
      listCustomers.value = [];
    });

    const handleClear = () => {
      searchForms.value.searchValue = "";
      searchForms.value.status = null;
      searchForms.value.roomId = null;
      searchForms.value.startDate = "";
      searchForms.value.endDate = "";
      searchForms.value.tenantId = null;
      searchForms.value.type = null;
      searchForms.value.landlordId = null;
      dateRange.value = [];
    };

    const submitForm = () => {
      searchForms.value.pageNo = 0;
      currentPage.value = 0;
      getListCustomers(searchForms.value);
    };

    const handleLoadMore = () => {
      currentPage.value++;
      searchForms.value.pageNo++;
      getListCustomers(searchForms.value);
    };

    const handleChangeDate = (date) => {
      searchForms.value.startDate = mixinMethods.showDateTime(date[0]);
      searchForms.value.endDate = mixinMethods.showDateTime(date[1]);
    };

    const handleRedirectToCreate = () => {
      router.push({name: PAGE_NAME.CUSTOMER.CREATE})
    };

    const handleGetCustomerDtls = (id) => {
      router.push({name: PAGE_NAME.CUSTOMER.DEATILS, params: {id}});
    };

    const handleCloseModal = () => {
      validation.value = [];
    };

    const handleSaveContract = () => {
    };

    const handleDisplayModal = (customer_id) => {
      isShowModalConfirm.value = !!customer_id;
      delete_id.value = customer_id;
    };

    const handleConfirm = () => {
        handleDeleteCustomer(delete_id.value);
    };

    return {
      searchForms,
      NUMBER_FORMAT,
      ADMIN,
      LANDLORD,
      isDisabled,
      TEXT_CONFIRM_DELETE,
      validation,
      totalItems,
      listCustomers,
      isShowModalConfirm,
      handleClear,
      submitForm,
      handleLoadMore,
      handleDisplayModal,
      handleChangeDate,
      handleGetCustomerDtls,
      handleCloseModal,
      handleConfirm,
      handleRedirectToCreate,
      handleSaveContract,
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
