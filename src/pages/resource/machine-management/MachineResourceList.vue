<template>
  <div class="machine machine-list">
    <div class="machine-header">
      <h3 class="page__ttl">{{ $t("resource.machine.title") }}</h3>
      <div class="machine-btn-box machine-import-box">
        <el-row class="mb-4">
          <el-button v-if="allowEdit" class="btn btn-save" @click="handleRedirectToCreate">
            {{ $t("resource.add_new") }}
          </el-button>
        </el-row>
      </div>
    </div>

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
    <div class="machine-body-table" style="">
      <MachineTable
          :allowEdit="allowEdit"
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
import {computed, onMounted, onUnmounted, ref} from "vue";
import { NUMBER_FORMAT } from "@/constants/application.js";
import { TEXT_CONFIRM_DELETE } from "@/constants/application.js";
import { ADMIN } from "@/constants/roles.js";
import { useMachineResourcesStore } from "@/store/machine-resources.js";
import { useRouter } from "vue-router";
import PAGE_NAME from "@/constants/route-name.js";
import {usePersistenceStore} from "@/store/persistence.js";

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
    const persist = usePersistenceStore();
    const {
      loggedIn
    } = persist;
    const delete_id = ref();
    const router = useRouter();
    const allowEdit = computed(() => localStorage.getItem('role') === ADMIN);
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
      if (loggedIn.value) {
        getListMachineResources(searchForms.value);
      }
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
      allowEdit,
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