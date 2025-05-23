<template>
  <div class="material material-list">
    <div class="material-header">
      <h3 class="page__ttl">{{ $t("resource.material.title") }}</h3>
      <div class="material-btn-box material-import-box">
        <el-row class="mb-4">
          <el-button v-if="allowEdit" class="btn btn-save" @click="handleRedirectToCreate"
          >{{ $t("resource.add_new") }}
          </el-button>
        </el-row>
      </div>
    </div>
    <div class="material-body">
      <div class="material-search">
        <div class="material-search-box col-md-9 col-lg-9">
          <p class="material-search__ttl">
            {{ $t("resource.keyword") }}
          </p>
          <div class="mb-0 ruleform">
            <el-input
                :placeholder="$t('common.input_keyword')"
                @keyup.enter="submitForm"
                v-model="searchForms.keyword"
                prop="keyword"
            >
            </el-input>
          </div>
        </div>
        <div class="btn-search-select col-md-3 col-lg-3 material-box-btn-all">
          <el-button class="btn btn-search" @click="submitForm()">
            {{ $t("common.search") }}</el-button
          >
          <el-button class="btn btn-clear" @click="handleClear()">
            {{ $t("common.clear") }}</el-button
          >
        </div>
      </div>
    </div>

    <div class="material-body-table" style="">
      <MaterialTable
          :allowEdit="allowEdit"
          :data="listMaterialResources.value"
          @details="handleGetMaterialResourcesDtls"
          @delete="handleDisplayModal"
      />
      <LoadMore
          :listData="listMaterialResources.value"
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
        :message="$t('resource.material.modal_confirm.message')"
        :title="$t('resource.material.modal_confirm.title')"
    />
  </div>
</template>

<script>
import IconSetting from "@/svg/IconSettingMain.vue";
import IconCircleClose from "@/svg/IconCircleClose.vue";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import LoadMore from "@/components/common/LoadMore.vue";
import ModalConfirm from "@/components/common/ModalConfirm.vue";
import MaterialTable from "./item/MaterialTable.vue";
import {computed, onMounted, onUnmounted, ref} from "vue";
import { NUMBER_FORMAT } from "@/constants/application.js";
import { TEXT_CONFIRM_DELETE } from "@/constants/application.js";
import { ADMIN } from "@/constants/roles.js";
import { useMaterialResourcesStore } from "@/store/material-resources.js";
import { useRouter } from "vue-router";
import PAGE_NAME from "@/constants/route-name.js";
import {usePersistenceStore} from "@/store/persistence.js";

export default {
  name: "materialList",
  components: {
    IconSetting,
    IconCircleClose,
    SingleOptionSelect,
    LoadMore,
    MaterialTable,
    ModalConfirm,
  },
  setup() {
    const searchForms = ref({
      keyword: "",
      pageIndex: 1,
      pageSize: 15,
    });
    const delete_id = ref();
    const router = useRouter();
    const materialStore = useMaterialResourcesStore();
    const {
      validation,
      listMaterialResources,
      totalItems,
      currentPage,
      isShowModalConfirm,
      getListMaterialResources,
      handleDeleteMaterialResources
    } = materialStore;
    const isDisabled = ref(false);
    const allowEdit = computed(() => localStorage.getItem('role') === ADMIN);
    const persist = usePersistenceStore();
    const {
      loggedIn
    } = persist;
    onMounted(() => {
      if (loggedIn.value) {
        getListMaterialResources(searchForms.value);
      }
    });

    onUnmounted(() => {
      listMaterialResources.value = [];
    });

    const handleClear = () => {
      searchForms.value.keyword = "";
    };

    const submitForm = () => {
      searchForms.value.pageIndex = 1;
      currentPage.value = 1;
      getListMaterialResources(searchForms.value);
    };

    const handleLoadMore = () => {
      currentPage.value++;
      searchForms.value.pageIndex++;
      getListMaterialResources(searchForms.value);
    };

    const handleRedirectToCreate = () => {
      router.push({ name: PAGE_NAME.RESOURCE.MATERIAL.CREATE });
    };

    const handleGetMaterialResourcesDtls = (id) => {
      router.push({ name: PAGE_NAME.RESOURCE.MATERIAL.DETAILS, params: { id } });
    };

    const handleCloseModal = () => {
      validation.value = [];
    };

    const handleDisplayModal = (material_id) => {
      isShowModalConfirm.value = !!material_id;
      delete_id.value = material_id;
    };

    const closeModalConfirm = () => {
      isShowModalConfirm.value = false;
    };

    const handleConfirm = () => {
      handleDeleteMaterialResources(delete_id.value);
    };

    return {
      searchForms,
      NUMBER_FORMAT,
      ADMIN,
      isDisabled,
      allowEdit,
      TEXT_CONFIRM_DELETE,
      validation,
      totalItems,
      listMaterialResources,
      isShowModalConfirm,
      closeModalConfirm,
      handleClear,
      submitForm,
      handleLoadMore,
      handleDisplayModal,
      handleGetMaterialResourcesDtls,
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
    width: 30px;
  }
}
</style>