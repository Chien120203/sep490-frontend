<template>
  <div class="mobilization mobilization-list">
    <div class="mobilization-header">
      <h3 class="page__ttl">{{ $t("allocation.title") }}</h3>
      <div class="mobilization-btn-box mobilization-import-box">
        <el-row class="mb-4">
          <el-button class="btn btn-save" @click="handleDisplayModalSave(true)">
            {{ $t("allocation.add_new") }}
          </el-button>
        </el-row>
      </div>
    </div>

    <!-- Table section -->
    <div class="mobilization-body-table">
      <el-tabs v-model="activeTab" @tab-click="handleTabChange">
        <el-tab-pane label="From Current Project To Other" name="project">
          <AllocationTable
              :isFrom="true"
              :data="listAllocations.value"
              @details="handleGetAllocationDtls"
              @delete="handleDisplayModal"
          />
          <LoadMore
              :listData="listAllocations.value"
              :totalItems="totalItems.value"
              @loadMore="handleLoadMore"
          />
        </el-tab-pane>

        <el-tab-pane label="Project To Task" name="project-to-task">
          <AllocationTable
              :isFrom="true"
              :data="listAllocations.value"
              @details="handleGetAllocationDtls"
              @delete="handleDisplayModal"
              @changeStatus="handleChangeStatus"
          />
          <LoadMore
              :listData="listAllocations.value"
              :totalItems="totalItems.value"
              @loadMore="handleLoadMore"
          />
        </el-tab-pane>

        <el-tab-pane label="Task to Task" name="task">
          <AllocationTable
              :isFrom="true"
              :data="listAllocations.value"
              @details="handleGetAllocationDtls"
              @delete="handleDisplayModal"
              @changeStatus="handleChangeStatus"
          />
          <LoadMore
              :listData="listAllocations.value"
              :totalItems="totalItems.value"
              @loadMore="handleLoadMore"
          />
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- Modals -->
    <ModalConfirm
        :isShowModal="isShowModalConfirm"
        @close-modal="closeModalConfirm"
        @confirmAction="handleConfirm"
        :message="$t('mobilization.modal_confirm.message')"
        :title="$t('mobilization.modal_confirm.title')"
    />
    <SaveAllocationModal
        :show="isShowModalSave"
        :data="allocationDetails.value"
        :listProjects="listFilteredProjects"
        :progressDetails="progressDetails.value"
        @searchProjects="handleSearchProjects"
        @searchTask="handleSearchTasks"
        @close="handleDisplayModalSave"
        @submit="handleSaveRequest"
    />
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted, computed} from "vue";
import LoadMore from "@/components/common/LoadMore.vue";
import ModalConfirm from "@/components/common/ModalConfirm.vue";
import AllocationTable from "@/pages/resource-allocation/items/AllocationTable.vue";
import SaveAllocationModal from "@/pages/resource-allocation/items/SaveAllocationModal.vue";
import { usePersistenceStore } from "@/store/persistence.js";
import { useAllocationStore } from "@/store/allocation.js";
import { useProjectStore } from "@/store/project.js";
import {PROJECT_TO_PROJECT, PROJECT_TO_TASK, TASK_TO_TASK} from "@/constants/allocation.js";
import {useProgressStore} from "@/store/progress.js";
import {useI18n} from "vue-i18n";

const persist = usePersistenceStore();
const allocationStore = useAllocationStore();
const projectStore = useProjectStore();
const progressStore = useProgressStore();

const { projectId } = persist;
const {
  listAllocations,
  totalItems,
  currentPage,
  allocationDetails,
  getListAllocations,
  handleDeleteAllocation,
  handleChangeRequestStatus,
  getAllocationDtls,
  saveRequest
} = allocationStore;
const {
  progressDetails,
  getProgressDetails
} = progressStore;
const { listProjects, getListProjects } = projectStore;
const listFilteredProjects = computed(() => listProjects.value.filter(project => project.id != projectId.value) || []);
const isShowModalConfirm = ref(false);
const isShowModalSave = ref(false);
const activeTab = ref("project");
const delete_id = ref(null);
const changeObject = ref({});
const title = ref("");
const {t} = useI18n();

const searchForms = ref({
  fromProjectId: projectId.value,
  requestType: 1,
  pageIndex: 1
});
const formSearchProject = ref({
  keyWord: "",
  pageIndex: 1
});

const formSearchTask = ref({
  keyWord: "",
  pageIndex: 1
});

const handleDisplayModalSave = (show = false) => {
  isShowModalSave.value = show;
};

const handleLoadMore = () => {
  currentPage.value++;
  searchForms.value.pageIndex++;
  getListAllocations(searchForms.value);
};

const handleSaveRequest = (data) => {
  allocationDetails.value.resourceAllocationDetails = data;
  allocationDetails.value.fromProjectId = projectId.value;
  saveRequest(allocationDetails.value);
  handleDisplayModalSave(false);
};

const handleDisplayModal = (mobilization_id) => {
  isShowModalConfirm.value = !!mobilization_id;
  delete_id.value = mobilization_id;
};

const closeModalConfirm = () => {
  isShowModalConfirm.value = false;
};

const handleConfirm = async () => {
  closeModalConfirm();
  if(delete_id.value) {
    await handleDeleteAllocation(delete_id.value);
    delete_id.value = null;
  } else {
    await handleChangeRequestStatus(changeObject.value.id, changeObject.value.type);
  }
  await getListAllocations(searchForms.value);
};

const handleGetAllocationDtls = (id) => {
  isShowModalSave.value = true;
  getAllocationDtls(id);
};

const handleSearchProjects = (value) => {
  formSearchProject.value.keyWord = value;
  getListProjects(formSearchProject.value);
};

// need to add function query task from progress later
const handleSearchTasks = (value) => {
  formSearchTask.value.keyWord = value;
};

const handleChangeStatus = (data) => {
  changeObject.value = data;
  title.value = t('mobilization.modal_confirm.message_change_status');
  isShowModalConfirm.value = true;
};

const handleTabChange = (tab) => {
  let selectedTab = tab.props.name;
  if (selectedTab === "project") {
    searchForms.value.requestType = PROJECT_TO_PROJECT;
  } else if (selectedTab === "task") {
    searchForms.value.fromProjectId = projectId.value;
    searchForms.value.requestType = TASK_TO_TASK;
  }else if (selectedTab === "project-to-task") {
    searchForms.value.fromProjectId = projectId.value;
    searchForms.value.requestType = PROJECT_TO_TASK;
  }
  searchForms.value.pageIndex = 1;
  currentPage.value = 1;
  getListAllocations(searchForms.value);
};

onMounted(() => {
  getListAllocations(searchForms.value);
  getListProjects(formSearchProject.value);
  getProgressDetails(projectId.value, false);
});

onUnmounted(() => {
  totalItems.value = 0;
});
</script>

<style scoped lang="scss">
.tab-select-wrapper {
  padding: 10px 0;
  max-width: 200px;
}
</style>
