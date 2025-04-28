<template>
  <div class="mobilization mobilization-list">
    <div class="mobilization-header">
      <h3 class="page__ttl">{{ $t("construct_team.title") }}</h3>
      <div class="customer-btn-box customer-import-box">
        <el-row
            class="mb-4"
        >
          <el-button v-if="allowEdit" class="btn btn-save" @click="handleOpenModalTeam"
          >{{ $t("customer.add_new") }}
          </el-button>
        </el-row>
      </div>
    </div>

    <div class="mobilization-body">
      <!-- SEARCH -->
      <div class="mobilization-search">
        <div class="mobilization-search-box col-md-9 col-lg-9">
          <p class="mobilization-search__ttl">
            {{ $t("common.keyword") }}
          </p>
          <div class="mb-0 ruleform">
            <el-input
                :placeholder="$t('common.input_keyword')"
                @keyup.enter="submitForm"
                v-model="searchForms.teamName"
                prop="search"
            >
              <template #append>
                <span @click="handleSearchForm" class="btn-setting">
                  <IconSetting/>
                </span>
              </template>
            </el-input>
          </div>
        </div>
        <div class="btn-search-select col-md-3 col-lg-3 mobilization-box-btn-all">
          <el-button class="btn btn-search" @click="submitForm()">
            {{ $t("common.search") }}
          </el-button>
          <el-button class="btn btn-clear" @click="handleClear()">
            {{ $t("common.clear") }}
          </el-button>
        </div>
      </div>
      <div class="form-search" :class="{ active: isShowBoxSearch }">
        <div class="close-form">
          <IconCircleClose @click="isShowBoxSearch = false"/>
        </div>
        <div class="form-search-box">
          <div class="item">
            <el-form-item :label="$t('construct_team.manager')">
              <SingleOptionSelect
                  v-model="searchForms.teamManager"
                  :optionKeys="{ id: 'id', value: 'username' }"
                  :listData="listUsers.value"
                  :role="CONSTRUCTION_MANAGER"
                  :isRemote="true"
                  @remoteSearch="handleSearchUsers"
              />
            </el-form-item>
          </div>
        </div>
      </div>
    </div>

    <!-- TABLES BY TYPE -->
    <div class="mobilization-body-table">
      <ConstructTeamTable
          :allowEdit="allowEdit"
          :data="listHumanResources.value"
          @details="handleGetTeamDetails"
          @delete="handleDeleteTeam"
      />
      <LoadMore
          :listData="listHumanResources.value"
          :totalItems="totalItems.value"
          @loadMore="handleLoadMore"
      />
    </div>
    <ConstructTeamModal
        :show="isShowModalTeam"
        :teamInfo="humanResourcesDetails.value"
        :allowEdit="allowEdit"
        :managers="managersList"
        :employees="employeesList"
        @search="handleSearchUsers"
        @remove="handleRemoveTeamMember"
        @close="closeTeamModal"
        @submit="handleSave"
    />
    <ModalConfirm
        :isShowModal="isShowModalConfirm.value"
        @close-modal="() => isShowModalConfirm.value = false"
        @confirmAction="handleConfirm"
        :message="$t('resource.human.modal_confirm.message')"
        :title="$t('resource.human.modal_confirm.title')"
    />
    <ModalConfirm
        :isShowModal="isShowModalConfirmDelMember"
        @close-modal="() => isShowModalConfirmDelMember = false"
        @confirmAction="handleConfirmRemove"
        :message="$t('resource.human.modal_confirm.msg_member')"
        :title="$t('resource.human.modal_confirm.title_member')"
    />
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted, computed, watch} from "vue";
import {usePersistenceStore} from "@/store/persistence.js";
import LoadMore from "@/components/common/LoadMore.vue";
import ConstructTeamTable from "@/pages/resource/human-management/item/ConstructTeamTable.vue";
import {useHumanResourcesStore} from "@/store/human-resources.js";
import IconSetting from "@/svg/IconSettingMain.vue";
import IconCircleClose from "@/svg/IconCircleClose.vue";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import {useUserStore} from "@/store/user.js";
import {ADMIN, CONSTRUCTION_EMPLOYEE, CONSTRUCTION_MANAGER, RESOURCE_MANAGER} from "@/constants/roles.js";
import ConstructTeamModal from "@/pages/resource/human-management/item/modal/ConstructTeamModal.vue";
import ModalConfirm from "@/components/common/ModalConfirm.vue";

// State
const persist = usePersistenceStore();
const humanResourceStore = useHumanResourcesStore();
const userStore = useUserStore();
const {
  listHumanResources,
  humanResourcesDetails,
  totalItems,
  currentPage,
  isShowModalConfirm,
  saveHumanResources,
  getHumanResourcesDetails,
  getListHumanResources,
  clearHumanResourcesDetails,
  handleDeleteHumanResources
} = humanResourceStore;
const {
  projectId
} = persist;
const {
  listUsers,
  getListUsers
} = userStore;

const searchForms = ref({
  teamManager: "",
  teamName: "",
  pageIndex: 1
});

// Local state to store cloned and filtered lists
const managersList = ref([]);
const employeesList = ref([]);
const allowCreate = computed(() => true);
// Deep copy and split when store list updates
watch(
    () => listUsers.value,
    (newVal) => {
      // Deep clone before filtering
      const cloned = JSON.parse(JSON.stringify(newVal));

      managersList.value = cloned.filter(user => user.role === CONSTRUCTION_MANAGER);
      employeesList.value = cloned.filter(user => user.role === CONSTRUCTION_EMPLOYEE); // Or use EMPLOYEE constant
    },
    { immediate: true }
);
const isShowBoxSearch = ref(false);
const isShowModalTeam = ref(false);
const isShowModalConfirmDelMember = ref(false);
const allowEdit = computed(() => localStorage.getItem('role') === ADMIN);
const delete_id = ref();
const delete_mem_id = ref();
const handleSearchForm = () => {
  isShowBoxSearch.value = !isShowBoxSearch.value;
};
const handleClear = () => {
  searchForms.value.teamName = "";
  searchForms.value.teamManager = "";
};

const submitForm = () => {
  isShowBoxSearch.value = false;
  currentPage.value = 1;
  getListHumanResources(searchForms.value);
};

const handleLoadMore = () => {
  currentPage.value++;
  searchForms.value.pageIndex++;
  getListHumanResources(searchForms.value);
};

const closeTeamModal = () => {
  isShowModalTeam.value = false;
  clearHumanResourcesDetails();
}

const handleRemoveTeamMember = (id) => {
  delete_mem_id.value = id?.id || id;
  isShowModalConfirmDelMember.value = true;
};

const handleConfirmRemove = () => {
  humanResourcesDetails.value.teamMemberIds = humanResourcesDetails.value.teamMemberIds.filter(memId => memId !== delete_mem_id.value);
  isShowModalConfirmDelMember.value = false;
}

const handleGetTeamDetails = (teamId) => {
  getHumanResourcesDetails(teamId);
  isShowModalTeam.value = true;
};

const handleDeleteTeam = (userId) => {
  isShowModalConfirm.value = true;
  delete_id.value = userId;
};

const handleSearchUsers = (data) => {
  getListUsers({
    keyWord: data.value,
    role: data.role,
    pageIndex: 1,
    pageSize: 50
  }, false)
};

const handleOpenModalTeam = () => {
  isShowModalTeam.value = true;
}

const handleSave = (data) => {
  let param = {
      id: data.id,
    teamName: data.teamName,
    teamManager: data.teamManager,
    description: data.description,
    teamMemberIds: data.teamMemberIds,
  };
  saveHumanResources(param);
};

const handleConfirm = () => {
  handleDeleteHumanResources(delete_id.value);
};

// Lifecycle
onMounted(() => {
  getListHumanResources(searchForms.value);
  getListUsers({
    keyWord: "",
    pageIndex: 1,
    pageSize: 50,
  }, false)
});

onUnmounted(() => {
  totalItems.value = 0;
});
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
