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
              v-model="searchForms.search"
              prop="search"
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

    <div class="customer-body-table" style="">
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
      @close-modal="closeModalConfirm"
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
import { ADMIN } from "@/constants/roles.js";
import {useCustomerStore} from "@/store/customer.js";
import { useRouter } from "vue-router";
import PAGE_NAME from "@/constants/route-name.js";
import {usePersistenceStore} from "@/store/persistence.js";

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
      search: "",
      pageIndex: 1,
      pageSize: 15,
    });
    const delete_id = ref();
    const router = useRouter();
    const customerStore = useCustomerStore();
    const persist = usePersistenceStore();
    const {
      loggedIn
    } = persist;
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
      if (loggedIn.value) {
        getListCustomers(searchForms.value);
      }
    });

    onUnmounted(() => {
      listCustomers.value = [];
    });

    const handleClear = () => {
      searchForms.value.search = "";
    };

    const submitForm = () => {
      searchForms.value.pageIndex = 1;
      currentPage.value = 1;
      getListCustomers(searchForms.value);
    };

    const handleLoadMore = () => {
      currentPage.value++;
      searchForms.value.pageIndex++;
      getListCustomers(searchForms.value);
    };

    const handleRedirectToCreate = () => {
      router.push({name: PAGE_NAME.CUSTOMER.CREATE})
    };

    const handleGetCustomerDtls = (id) => {
      router.push({name: PAGE_NAME.CUSTOMER.DETAILS, params: {id}});
    };

    const handleCloseModal = () => {
      validation.value = [];
    };

    const handleDisplayModal = (customer_id) => {
      isShowModalConfirm.value = !!customer_id;
      delete_id.value = customer_id;
    };

    const closeModalConfirm = () => {
      isShowModalConfirm.value = false;
    }

    const handleConfirm = () => {
        handleDeleteCustomer(delete_id.value);
    };

    return {
      searchForms,
      NUMBER_FORMAT,
      ADMIN,
      isDisabled,
      TEXT_CONFIRM_DELETE,
      validation,
      totalItems,
      listCustomers,
      isShowModalConfirm,
      closeModalConfirm,
      handleClear,
      submitForm,
      handleLoadMore,
      handleDisplayModal,
      handleGetCustomerDtls,
      handleCloseModal,
      handleConfirm,
      handleRedirectToCreate,
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
