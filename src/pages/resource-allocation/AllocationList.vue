<template>
  <div class="mobilization mobilization-list">
    <div class="mobilization-header">
      <h3 class="page__ttl">{{ $t("allocation.title") }}</h3>
      <div class="mobilization-btn-box mobilization-import-box">
        <el-row
            class="mb-4"
        >
          <el-button class="btn btn-save" @click="handleDisplayModalSave(true)"
          >{{ $t("allocation.add_new") }}
          </el-button>
        </el-row>
      </div>
    </div>
    <div class="mobilization-body">
      <div class="mobilization-search">
        <div class="mobilization-search-box col-md-9 col-lg-9">
          <p class="mobilization-search__ttl">
            {{ $t("mobilization.keyword") }}
          </p>
          <div class="mb-0 ruleform">
            <el-input
                :placeholder="$t('common.input_keyword')"
                @keyup.enter="submitForm"
                v-model="searchForms.search"
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
            <el-form-item :label="$t('project.status')">
              <el-select v-model="searchForms.status">
                <el-option :label="$t('common.all')" value=""></el-option>
                <el-option
                    v-for="(status, index) in STATUS_LABELS"
                    :key="index"
                    :label="$t(status)"
                    :value="index"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
      </div>
    </div>

    <div class="mobilization-body-table" style="">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="From Current Project" name="from-project">
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
        <el-tab-pane label="To Current Project" name="to-project">
          <AllocationTable
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
      </el-tabs>
    </div>
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
        :listProjects="listProjects.value"
        @searchProjects="handleSearchProjects"
        @close="handleDisplayModalSave"
        @submit="handleSaveRequest"
    />
  </div>
</template>
<script setup>
import {ref, onMounted, onUnmounted, watch} from "vue";
import LoadMore from "@/components/common/LoadMore.vue";
import ModalConfirm from "@/components/common/ModalConfirm.vue";
import AllocationTable from "@/pages/resource-allocation/items/AllocationTable.vue";
import {usePersistenceStore} from "@/store/persistence.js";
import IconCircleClose from "@/svg/IconCircleClose.vue";
import {STATUS_LABELS} from "@/constants/allocation.js";
import IconSetting from "@/svg/IconSettingMain.vue";
import SaveAllocationModal from "@/pages/resource-allocation/items/SaveAllocationModal.vue";
import {useAllocationStore} from "@/store/allocation.js";
import {useProjectStore} from "@/store/project.js";

const allocationStore = useAllocationStore();
const persist = usePersistenceStore();
const projectStore = useProjectStore();
const {
  projectId
} = persist;
const {
  validation,
  totalItems,
  currentPage,
  allocationDetails,
  listAllocations,
  getListAllocations,
  getAllocationDtls,
  saveRequest
} = allocationStore;
const {
  listProjects,
  getListProjects,
} = projectStore;

const delete_id = ref(null);
const isShowModalConfirm = ref(false);
const isShowModalSave = ref(false);
const isShowBoxSearch = ref(false);
const activeTab = ref("from-project"); // Default active tab
const searchForms = ref({fromProjectId: projectId.value, toProjectId: null, status: "", pageIndex: 1});
const formSearchProject = ref({keyWord: "",  pageIndex: 1});
const handleClear = () => {
  searchForms.value.search = "";
};

const handleSearchForm = () => {
  isShowBoxSearch.value = !isShowBoxSearch.value;
};

const handleDisplayModalSave = (show = false) => {
  isShowModalSave.value = show;
}

const submitForm = () => {
  searchForms.value.pageIndex = 1;
  currentPage.value = 1;
  getListAllocations(searchForms.value);
};

const handleLoadMore = () => {
  currentPage.value++;
  searchForms.value.pageIndex++;
  getListAllocations(searchForms.value);
};

const handleSaveRequest = (data) => {
  allocationDetails.value.resourceAllocationDetails = data
  saveRequest(allocationDetails.value);
  handleDisplayModalSave();
}

const handleDisplayModal = (mobilization_id) => {
  isShowModalConfirm.value = !!mobilization_id;
  delete_id.value = mobilization_id;
};

const closeModalConfirm = () => {
  isShowModalConfirm.value = false;
};

const handleConfirm = () => {
  closeModalConfirm();
  // handleDeleteMobilization(delete_id.value);
};

const handleGetAllocationDtls = (id) => {
  isShowModalSave.value = true;
  getAllocationDtls(id);
}

const handleSearchProjects = (value) => {
  formSearchProject.value.keyWord = value;
  getListProjects(formSearchProject.value);
}

onMounted(() => {
  getListAllocations(searchForms.value);
  getListProjects(formSearchProject.value);
});

onUnmounted(() => {
  totalItems.value = 0;
});

watch(activeTab, (newValue) => {
  if(newValue === "from-project") {
    searchForms.value.fromProjectId = projectId.value;
    searchForms.value.toProjectId = null;
    getListAllocations(searchForms.value);
  }

  if(newValue === "to-project") {
    searchForms.value.toProjectId = projectId.value;
    searchForms.value.fromProjectId = null;
    getListAllocations(searchForms.value);
  }
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
