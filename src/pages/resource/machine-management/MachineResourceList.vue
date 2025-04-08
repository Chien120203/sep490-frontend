<template>
  <div class="machine machine-list">
    <!-- Header Section -->
    <div class="machine-header">
      <h3 class="page__ttl">{{ $t("resource.machine.title") }}</h3>
      <div class="machine-btn-box machine-import-box">
        <el-row class="mb-4">
          <el-button class="btn btn-save" @click="handleRedirectToCreate">
            {{ $t("resource.add_new") }}
          </el-button>
        </el-row>
      </div>
    </div>

    <!-- Search Section -->
    <div class="machine-body">
      <div class="machine-search">
        <div class="machine-search-box col-md-9 col-lg-9">
          <p class="machine-search__ttl">{{ $t("resource.keyword") }}</p>
          <div class="mb-0 ruleform">
            <el-input
                :placeholder="$t('common.input_keyword')"
                @keyup.enter="submitForm"
                v-model="searchForms.search"
                prop="search"
            ></el-input>
          </div>
        </div>
        <div class="btn-search-select col-md-3 col-lg-3 machine-box-btn-all">
          <el-button class="btn btn-search" @click="submitForm()">
            {{ $t("common.search") }}
          </el-button>
          <el-button class="btn btn-clear" @click="handleClear()">
            {{ $t("common.clear") }}
          </el-button>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="machine-body-table">
      <MachineTable
          :data="listMachineResources.value"
          @details="handleGetMachineResourcesDtls"
          @delete="handleDisplayModal"
      />
      <LoadMore
          :listData="listMachineResources.value"
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
        :message="$t('resource.machine.modal_confirm.message')"
        :title="$t('resource.machine.modal_confirm.title')"
    />
  </div>
</template>

<script>
import IconSetting from "@/svg/IconSettingMain.vue";
import IconCircleClose from "@/svg/IconCircleClose.vue";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import LoadMore from "@/components/common/LoadMore.vue";
import ModalConfirm from "@/components/common/ModalConfirm.vue";
import MachineTable from "./item/MachineTable.vue";
import { onMounted, onUnmounted, ref } from "vue";
import { NUMBER_FORMAT } from "@/constants/application.js";
import { TEXT_CONFIRM_DELETE } from "@/constants/application.js";
import { ADMIN } from "@/constants/roles.js";
import { useMachineResourcesStore } from "@/store/machine-resources.js";
import { useRouter } from "vue-router";
import PAGE_NAME from "@/constants/route-name.js";

export default {
  name: "machineList",
  components: {
    IconSetting,
    IconCircleClose,
    SingleOptionSelect,
    LoadMore,
    MachineTable,
    ModalConfirm,
  },
  setup() {
    const searchForms = ref({
      search: "",
      pageIndex: 1,
    });
    const delete_id = ref();
    const router = useRouter();
    const machineStore = useMachineResourcesStore();
    const {
      validation,
      listMachineResources,
      totalItems,
      currentPage,
      isShowModalConfirm,
      getListMachineResources,
      handleDeleteMachineResources,
    } = machineStore;
    const isDisabled = ref(false);

    onMounted(() => {
      getListMachineResources(searchForms.value);
    });

    onUnmounted(() => {
      listMachineResources.value = [];
    });

    const handleClear = () => {
      searchForms.value.search = "";
    };

    const submitForm = () => {
      searchForms.value.pageIndex = 1;
      currentPage.value = 1;
      getListMachineResources(searchForms.value);
    };

    const handleLoadMore = () => {
      currentPage.value++;
      searchForms.value.pageIndex++;
      getListMachineResources(searchForms.value);
    };

    const handleRedirectToCreate = () => {
      router.push({ name: PAGE_NAME.RESOURCE.MACHINE.CREATE });
    };

    const handleGetMachineResourcesDtls = (id) => {
      router.push({ name: PAGE_NAME.RESOURCE.MACHINE.DETAILS, params: { id } });
    };

    const handleCloseModal = () => {
      validation.value = [];
    };

    const handleDisplayModal = (machine_id) => {
      isShowModalConfirm.value = !!machine_id;
      delete_id.value = machine_id;
    };

    const closeModalConfirm = () => {
      isShowModalConfirm.value = false;
    };

    const handleConfirm = () => {
      handleDeleteMachineResources(delete_id.value);
    };

    return {
      searchForms,
      NUMBER_FORMAT,
      ADMIN,
      isDisabled,
      TEXT_CONFIRM_DELETE,
      validation,
      totalItems,
      listMachineResources,
      isShowModalConfirm,
      closeModalConfirm,
      handleClear,
      submitForm,
      handleLoadMore,
      handleDisplayModal,
      handleGetMachineResourcesDtls,
      handleCloseModal,
      handleConfirm,
      handleRedirectToCreate,
    };
  },
};
</script>

<style lang="scss" scoped>
.machine-list {
  /* Header Section */
  .machine-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .page__ttl {
      font-size: 1.25rem; /* Giảm kích thước tiêu đề */
      font-weight: 600;
      color: #0052cc; /* Màu xanh đậm cho tiêu đề */
    }

    .machine-btn-box {
      .btn-save {
        background-color: #0052cc; /* Màu xanh đậm cho nút Add New */
        color: #fff;
        border-radius: 4px;
        &:hover {
          background-color: #003f99; /* Đậm hơn khi hover */
        }
      }
    }
  }

  /* Search Section */
  .machine-body {
    .machine-search {
      display: flex;
      align-items: flex-start;
      margin-bottom: 20px;

      .machine-search-box {
        display: flex;
        flex-direction: column; /* Xếp dọc nhãn và ô nhập liệu */
        flex-grow: 1;

        .machine-search__ttl {
          font-size: 1rem;
          font-weight: 500;
          margin-bottom: 5px; /* Khoảng cách giữa nhãn và ô nhập liệu */
          color: #6c757d; /* Màu xám đậm cho nhãn */
        }

        .ruleform {
          width: 100%;

          .el-input {
            border-radius: 4px;
            border-color: #ced4da; /* Viền xám nhạt */
          }
        }
      }

      .btn-search-select {
        display: flex;
        align-items: center;
        margin-left: 10px; /* Khoảng cách giữa ô nhập liệu và nút */

        .btn-search {
          background-color: #a3bffa; /* Màu tím nhạt cho nút Search */
          color: #fff;
          margin-left: 10px;
          border-radius: 4px;
          &:hover {
            background-color: #8c9eff; /* Đậm hơn khi hover */
          }
        }

        .btn-clear {
          background-color: #a3bffa; /* Màu tím nhạt cho nút Clear */
          color: #fff;
          margin-left: 10px;
          border-radius: 4px;
          &:hover {
            background-color: #8c9eff; /* Đậm hơn khi hover */
          }
        }
      }
    }
  }

  /* Close Form Icon */
  .close-form {
    position: absolute;
    display: flex;
    justify-content: flex-end;
    right: 16px;
    top: 10px;
    cursor: pointer;

    svg {
      height: 30px;
      width: 30px;
    }
  }
}
</style>