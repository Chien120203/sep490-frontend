<template>
  <div class="human human-list">
    <div class="human-header">
      <h3 class="page__ttl">{{ $t("resource.human.title") }}</h3>
      <div class="human-btn-box human-import-box">
        <el-row class="mb-4">
          <el-button class="btn btn-save" @click="handleRedirectToCreate"
          >{{ $t("resource.add_new") }}
          </el-button>
        </el-row>
      </div>
    </div>
    <div class="human-body">
      <div class="human-search">
        <div class="human-search-box col-md-9 col-lg-9">
          <p class="human-search__ttl">
            {{ $t("resource.keyword") }}
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
        <div class="btn-search-select col-md-3 col-lg-3 human-box-btn-all">
          <el-button class="btn btn-search" @click="submitForm()">
            {{ $t("common.search") }}</el-button
          >
          <el-button class="btn btn-clear" @click="handleClear()">
            {{ $t("common.clear") }}</el-button
          >
        </div>
      </div>
    </div>

    <div class="human-body-table" style="">
      <humanTable
          :data="listHumanResources.value"
          @details="handleGetHumanResourcesDtls"
          @delete="handleDisplayModal"
      />
      <LoadMore
          :listData="listHumanResources.value"
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
        :message="$t('human.modal_confirm.message')"
        :title="$t('human.modal_confirm.title')"
    />
  </div>
</template>

<script>
import IconSetting from "@/svg/IconSettingMain.vue";
import IconCircleClose from "@/svg/IconCircleClose.vue";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import LoadMore from "@/components/common/LoadMore.vue";
import ModalConfirm from "@/components/common/ModalConfirm.vue";
import HumanTable from "./item/HumanTable.vue";
import { onMounted, onUnmounted, ref } from "vue";
import { NUMBER_FORMAT } from "@/constants/application.js";
import { TEXT_CONFIRM_DELETE } from "@/constants/application.js";
import { ADMIN } from "@/constants/roles.js";
import { useHumanResourcesStore } from "@/store/human-resources.js";
import { useRouter } from "vue-router";
import PAGE_NAME from "@/constants/route-name.js";

export default {
  name: "humanList",
  components: {
    IconSetting,
    IconCircleClose,
    SingleOptionSelect,
    LoadMore,
    HumanTable,
    ModalConfirm,
  },
  setup() {
    const searchForms = ref({
      search: "",
      pageIndex: 1,
    });
    const delete_id = ref();
    const router = useRouter();
    const humanStore = useHumanResourcesStore();
    const {
      validation,
      listHumanResources,
      totalItems,
      currentPage,
      isShowModalConfirm,
      getListHumanResources,
      handleDeleteHumanResources
    } = humanStore;
    const isDisabled = ref(false);

    onMounted(() => {
      getListHumanResources(searchForms.value);
    });

    onUnmounted(() => {
      listHumanResources.value = [];
    });

    const handleClear = () => {
      searchForms.value.search = "";
    };

    const submitForm = () => {
      searchForms.value.pageIndex = 1;
      currentPage.value = 1;
      getListHumanResources(searchForms.value);
    };

    const handleLoadMore = () => {
      currentPage.value++;
      searchForms.value.pageIndex++;
      getListHumanResources(searchForms.value);
    };

    const handleRedirectToCreate = () => {
      router.push({ name: PAGE_NAME.RESOURCE.HUMAN.CREATE });
    };

    const handleGetHumanResourcesDtls = (id) => {
      router.push({ name: PAGE_NAME.RESOURCE.HUMAN.DETAILS, params: { id } });
    };

    const handleCloseModal = () => {
      validation.value = [];
    };

    const handleDisplayModal = (human_id) => {
      isShowModalConfirm.value = !!human_id;
      delete_id.value = human_id;
    };

    const closeModalConfirm = () => {
      isShowModalConfirm.value = false;
    };

    const handleConfirm = () => {
      handleDeleteHumanResources(delete_id.value);
    };

    return {
      searchForms,
      NUMBER_FORMAT,
      ADMIN,
      isDisabled,
      TEXT_CONFIRM_DELETE,
      validation,
      totalItems,
      listHumanResources,
      isShowModalConfirm,
      closeModalConfirm,
      handleClear,
      submitForm,
      handleLoadMore,
      handleDisplayModal,
      handleGetHumanResourcesDtls,
      handleCloseModal,
      handleConfirm,
      handleRedirectToCreate,
    };
  },
};
</script>

<style lang="scss" scoped>
.human-list {
  .human-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .page__ttl {
      font-size: 1.5rem;
      font-weight: 600;
    }

    .human-btn-box {
      .btn-save {
        background-color: #409EFF;
        color: #fff;
        &:hover {
          background-color: #66b1ff;
        }
      }
    }
  }

  .human-body {
    .human-search {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      .human-search-box {
        display: flex;
        align-items: center;

        .human-search__ttl {
          font-size: 1rem;
          font-weight: 500;
          margin-right: 10px;
        }

        .ruleform {
          width: 100%;

          .el-input__inner {
            border-radius: 4px;
          }
        }
      }

      .btn-search-select {
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .btn-search,
        .btn-clear {
          margin-left: 10px;
        }

        .btn-search {
          background-color: #409EFF;
          color: #fff;
          &:hover {
            background-color: #66b1ff;
          }
        }

        .btn-clear {
          background-color: #f56c6c;
          color: #fff;
          &:hover {
            background-color: #f78989;
          }
        }
      }
    }

    .human-body-table {
      margin-top: 20px;
    }
  }
}

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
</style>