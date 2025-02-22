<template>
  <div class="user user-list">
    <div class="user-header">
      <h3 class="page__ttl">{{ $t("user.title") }}</h3>
      <div class="user-btn-box user-import-box">
        <el-row
            class="mb-4"
        >
          <el-button class="btn btn-save" @click="handleRedirectToCreate"
          >{{ $t("user.add_new") }}
          </el-button>
        </el-row>
      </div>
    </div>
    <div class="user-body">
      <div class="user-search">
        <div class="user-search-box col-md-9 col-lg-9">
          <p class="user-search__ttl">
            {{ $t("user.keyword") }}
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
        <div class="btn-search-select col-md-3 col-lg-3 user-box-btn-all">
          <el-button class="btn btn-search" @click="submitForm()">
            {{ $t("common.search") }}</el-button
          >
          <el-button class="btn btn-clear" @click="handleClear()">
            {{ $t("common.clear") }}</el-button
          >
        </div>
      </div>
    </div>

    <div class="user-body-table" style="margin-top: 16px; min-height: 400px">
      <UserTable
          :data="listUsers.value"
          @details="handleGetUserDtls"
          @delete="handleDisplayModal"
      />
      <LoadMore
          :listData="listUsers.value"
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
        :message="$t('user.delete.text_delete')"
        :title="$t('user.delete.title_delete')"
    />
  </div>
</template>

<script>
import IconSetting from "@/svg/IconSettingMain.vue";
import IconCircleClose from "@/svg/IconCircleClose.vue";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import LoadMore from "@/components/common/LoadMore.vue";
import ModalConfirm from "@/components/common/ModalConfirm.vue";
import UserTable from "./item/UserTable.vue";
import { onMounted, onUnmounted, ref } from "vue";
import { NUMBER_FORMAT } from "@/constants/application.js";
import { TEXT_CONFIRM_DELETE } from "@/constants/application.js";
import { ADMIN } from "@/constants/roles.js";
import {useUserStore} from "@/store/user.js";
import { useRouter } from "vue-router";
import PAGE_NAME from "@/constants/route-name.js";

export default {
  name: "userList",
  components: {
    IconSetting,
    IconCircleClose,
    SingleOptionSelect,
    LoadMore,
    UserTable,
    ModalConfirm,
  },
  setup() {
    const searchForms = ref({
      search: "",
      pageIndex: 1,
    });
    const delete_id = ref();
    const router = useRouter();
    const userStore = useUserStore();
    const {
      validation,
      listUsers, // temporary
      totalItems,
      currentPage,
      isShowModalConfirm,
      getListUsers,
      handleDeleteUser
    } = userStore;
    const isDisabled = ref(false);

    onMounted(() => {
      getListUsers(searchForms.value);
    });

    onUnmounted(() => {
      listUsers.value = [];
    });

    const handleClear = () => {
      searchForms.value.search = "";
    };

    const submitForm = () => {
      searchForms.value.pageIndex = 0;
      currentPage.value = 0;
      getListUsers(searchForms.value);
    };

    const handleLoadMore = () => {
      currentPage.value++;
      searchForms.value.pageIndex++;
      getListUsers(searchForms.value);
    };

    const handleRedirectToCreate = () => {
      router.push({name: PAGE_NAME.USER.CREATE})
    };

    const handleGetUserDtls = (id) => {
      router.push({name: PAGE_NAME.USER.DETAILS, params: {id}});
    };

    const handleCloseModal = () => {
      validation.value = [];
    };

    const handleSaveContract = () => {
    };

    const handleDisplayModal = (user_id) => {
      isShowModalConfirm.value = !!user_id;
      delete_id.value = user_id;
    };

    const closeModalConfirm = () => {
      isShowModalConfirm.value = false;
    }

    const handleConfirm = () => {
      handleDeleteUser(delete_id.value);
    };

    return {
      searchForms,
      NUMBER_FORMAT,
      ADMIN,
      isDisabled,
      TEXT_CONFIRM_DELETE,
      validation,
      totalItems,
      listUsers,
      isShowModalConfirm,
      closeModalConfirm,
      handleClear,
      submitForm,
      handleLoadMore,
      handleDisplayModal,
      handleGetUserDtls,
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
