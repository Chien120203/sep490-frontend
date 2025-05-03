<template>
  <div class="planning-block">
    <div class="planning planning-create planning-detail">
      <div class="planning-header">
        <div class="contract-save-title">
          <h3 class="page__ttl">
            <span class="btn-back" @click="handleBack"><IconBackMain/></span>
            {{
              isUpdate ? $t('planning.edit.title') : $t('planning.create.title')
            }}
          </h3>
        </div>
        <div class="contract-save-btn">
          <div class="btn-container">
            <el-button v-if="allowApprove && isCurrentUserLock" style="height: 36px" type="success" @click="handleApprove()">{{ $t("common.approve") }}</el-button>
            <el-button v-if="allowReject && isCurrentUserLock" class="btn btn-refuse" @click="handleReject()">{{ $t("common.reject") }}</el-button>
            <el-button :disabled="disableBtn || !allowEdit || !isCurrentUserLock" v-if="allowEdit" class="btn btn-save" @click="submitForm">
              {{ $t("common.save") }}
            </el-button>
          </div>
        </div>
      </div>

      <div>
        <!-- Title Navigation -->
        <TitleNavigation
            :listTabs="listTabs"
            :selectedTab="selectedTab"
            @tabChange="handleTabChange"
        />

        <!-- Conditional Rendering Based on Selected Tab -->
        <div v-if="selectedTab === 'info'">
          <SelectionFilters
              ref="selectionFormRef"
              :allowEdit="allowEdit && isCurrentUserLock"
              :lockInfo="lockInfo.value"
              :rules="PLANNING_RULES"
              :planDetails="planningDetails.value"
              :contractDetails="contractDetails.value"
              @disable-btn="handleDisableBtn"
          />
          <PlanningDetails
              ref="detailsFormRef"
              :allowEdit="allowEdit && isCurrentUserLock"
              :rules="PLANNING_RULES"
              :items="planningDetails.value.planItems"
              :isUpdate="isUpdate" @update:items="updateItems"
              @editPlanDetails="handleEditPlanDetails"
          />
        </div>

        <div v-if="selectedTab === 'activity'">
          <ActivityComponent
              :statuses="statuses"
              :currentStep="currentStep"
              :activities="activities"
          />
        </div>

      </div>
    </div>
  </div>
  <PlanItemDetailsModal
      :rules="PLANNING_RULES"
      :show="isShowModalItemDtls"
      :selectedRow="selectedRow"
      :allowEdit="allowEdit && isCurrentUserLock"
      :tasks="planningDetails.value.planItems"
      :isUpdate="isUpdate"
      :materials="listMaterialResources.value"
      :users="listHumanResources.value"
      :vehicles="listMachineResources.value"
      @search="handleSearch"
      @close="handleCloseModal"
      @submit="handleSaveItemDetails"
  />
</template>

<script setup>
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import IconBackMain from "@/svg/IconBackMain.vue";
import TitleNavigation from "@/components/common/TitleNavigation.vue";
import SelectionFilters from "@/pages/planning/item/details/SelectionFilters.vue";
import PlanningDetails from "@/pages/planning/item/details/PlanningDetails.vue";
import ActivityComponent from "@/pages/planning/item/details/ActivityComponent.vue";
import PAGE_NAME from "@/constants/route-name.js";
import {useProjectStore} from "@/store/project.js";
import {useUserStore} from "@/store/user.js";
import PlanItemDetailsModal from "@/pages/planning/item/modal/PlanItemDetailsModal.vue";
import {useContractStore} from "@/store/contract.js";
import {usePlanningStore} from "@/store/planning.js";
import {usePersistenceStore} from "@/store/persistence.js";
import {mixinMethods} from "@/utils/variables.js";
import {getPlanningRules} from "@/rules/planning/index.js";
import {useHumanResourcesStore} from "@/store/human-resources.js";
import {useMachineResourcesStore} from "@/store/machine-resources.js";
import {useMaterialResourcesStore} from "@/store/material-resources.js";
import {useI18n} from "vue-i18n";
import {HUMAN_TYPE, MACHINE_TYPE, MATERIAL_TYPE} from "@/constants/resource.js";
import {CONSTRUCTION_MANAGER, EXECUTIVE_BOARD, RESOURCE_MANAGER, TECHNICAL_MANAGER} from "@/constants/roles.js";
import {DATE_TIME_FORMAT} from "@/constants/application.js";

const selectedTab = ref("info"); // Default tab
const listTabs = ref([
  {
    name: "info",
    label: "Info",
  },
  {
    name: "activity",
    label: "Activity",
  },
]);
const isShowModalItemDtls = ref(false);
const disableBtn = ref(false);
const isUpdate = computed(() => !!route.params.id);
const selectedRow = ref({});
const PLANNING_RULES = getPlanningRules();
const showLockWarning = ref(false);
const heartbeatInterval = ref(null);

const currentStep = ref(1);
const activities = ref([]); // Placeholder for activity data
const {t} = useI18n();
// Store Data
const contractStore = useContractStore();
const planningStore = usePlanningStore();
const persistence = usePersistenceStore();
const humanStore = useHumanResourcesStore();
const machineStore = useMachineResourcesStore();
const materialStore = useMaterialResourcesStore();

const {projectId} = persistence;
const {
  contractDetails,
  getContractDetails,
} = contractStore;
const {listHumanResources, getListHumanResources} = humanStore;
const {listMachineResources, getListMachineResources} = machineStore;
const {listMaterialResources, getListMaterialResources} = materialStore;
const {
  planningDetails,
  planSelectedRow,
  approveStatuses,
  isLocked,
  lockInfo,
  approvePlanning,
  rejectPlanning,
  clearPlanningDetails,
  getPlanningDetails,
  savePlanning,
  acquireLock,
  releaseLock,
  checkLockStatus,
  extendLock
} = planningStore;
const currentEmail = localStorage.getItem("email");
const currentRole = localStorage.getItem("role");
const allowReject = computed(() => {
  const status = approveStatuses.value.find(p => p.role === EXECUTIVE_BOARD && p.email === currentEmail);
  return status?.isApproved === null || status?.isApproved === false;
});

const allowApprove = computed(() => {
  const status = approveStatuses.value.find(p => p.email === currentEmail);
  return status?.isApproved === null  || status?.isApproved === false;
});
const allowEdit = computed(() => {
  const isCreate = !route.params.id;

  if (isCreate) {
    return currentRole === CONSTRUCTION_MANAGER;
  }

  const statusMap = approveStatuses.value.reduce((acc, item) => {
    acc[item.role] = item.isApproved;
    return acc;
  }, {});

  if (currentRole === EXECUTIVE_BOARD) {
    return false; // Executive Board never allowed to edit
  }

  if (currentRole === CONSTRUCTION_MANAGER || currentRole === RESOURCE_MANAGER) {
    return statusMap[RESOURCE_MANAGER] === null && statusMap[TECHNICAL_MANAGER] === null;
  }

  if (currentRole === TECHNICAL_MANAGER) {
    return statusMap[TECHNICAL_MANAGER] === null;
  }

  return false;
});

// Check if current user owns the lock
const isCurrentUserLock = computed(() => {
  if (!isLocked.value || !lockInfo.value) return true; // If not locked, user can edit
  return lockInfo.value.isCurrentUserLock;
});

const statuses = computed(() => {

  const resourceApprove = approveStatuses.value.find(p => p.role === RESOURCE_MANAGER)?.isApproved;
  const techApprove = approveStatuses.value.find(p => p.role === TECHNICAL_MANAGER)?.isApproved;
  const bodApprove = approveStatuses.value.find(p => p.role === EXECUTIVE_BOARD)?.isApproved;
  const bodStatus = bodApprove === null ? "process" : (bodApprove === true ? "success" : "error");

  return [
    { title: "Khởi tạo",
      description: "",
      status: "success" },
    {
      title: "Phòng tài nguyên",
      status: resourceApprove ? "success" : "process"
    },
    {
      title: "Phòng kỹ thuật",
      status: techApprove ? "success" : "process"
    },
    {
      title: "Giám đốc duyệt",
      description: "",
      status: bodStatus
    }
  ];
});
const route = useRoute();
const router = useRouter();

onMounted(async () => {
  // Add window event listeners for visibility changes
  window.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('beforeunload', handleBeforeUnload);
  
  await getContractDetails(projectId.value);
  if (!route.params.id) {
    planningDetails.value.planItems = contractDetails.value.contractDetails.map(
        ({contractId, deleted, workCode, ...rest}) => ({...rest})
    );
  } else {
    await getPlanningDetails(route.params.id);
    
    // Check if plan is locked and try to acquire lock
    if (allowEdit.value) {
      await checkLockStatus(route.params.id);
      
      if (isLocked.value && !isCurrentUserLock.value) {
        // Show warning that plan is being edited
        showLockWarning.value = true;
      } else {
        // Try to acquire the lock
        await acquireLock(route.params.id);
        
        // Start the heartbeat to keep the lock active
        startHeartbeat();
      }
    }
  }
  await getListHumanResources({pageIndex: 1}, false);
  await getListMachineResources({pageIndex: 1}, false);
  await getListMaterialResources({pageIndex: 1}, false);
});

// Watch for lock changes (can happen when acquiring a lock fails)
watch(isLocked, (newValue) => {
  if (newValue && !isCurrentUserLock.value) {
    showLockWarning.value = true;
  }
});

const startHeartbeat = () => {
  // Clear any existing interval
  if (heartbeatInterval.value) {
    clearInterval(heartbeatInterval.value);
  }
  
  // Set a new interval to extend the lock every 5 minutes
  heartbeatInterval.value = setInterval(() => {
    if (route.params.id && isLocked.value && isCurrentUserLock.value) {
      extendLock(route.params.id);
    }
  }, 5 * 60 * 1000); // 5 minutes
};

const handleApprove = () => {
  allowReject.value = false;
  allowApprove.value = false;
  approvePlanning();
};

const handleReject = () => {
  allowReject.value = false;
  allowApprove.value = false;
  rejectPlanning();
};

onUnmounted(() => {
  // Remove window event listeners
  window.removeEventListener('visibilitychange', handleVisibilityChange);
  window.removeEventListener('beforeunload', handleBeforeUnload);
  
  clearPlanningDetails();
  
  // Release the lock when leaving the page
  if (route.params.id && isLocked.value && isCurrentUserLock.value) {
    releaseLock(route.params.id);
  }
  
  // Clear the heartbeat interval
  if (heartbeatInterval.value) {
    clearInterval(heartbeatInterval.value);
  }
});

const handleBack = () => {
  // Release the lock when navigating away
  if (route.params.id && isLocked.value && isCurrentUserLock.value) {
    releaseLock(route.params.id);
  }
  
  router.push({name: PAGE_NAME.PLANNING.LIST});
};

const updateItems = (newItems) => {
  planningDetails.value.planItems = newItems;
};

const handleEditPlanDetails = (row) => {
  selectedRow.value = JSON.parse(JSON.stringify(row));
  planSelectedRow.value = selectedRow.value;
  isShowModalItemDtls.value = true;
}

const handleDisableBtn = (data) => {
  disableBtn.value = data;
}

const handleCloseModal = () => {
  selectedRow.value = {};
  planSelectedRow.value = {};
  isShowModalItemDtls.value = false;
}

const handleSaveItemDetails = (data) => {
  planningDetails.value.planItems = planningDetails.value.planItems.map(item =>
      item.index === selectedRow.value.index ? {...item, ...data} : item
  );
  handleCloseModal();
};

const handleTabChange = (tab) => {
  selectedTab.value = tab;
};

const selectionFormRef = ref(null);
const detailsFormRef = ref(null);

const handleSearch = (data) => {
  switch (data.type) {
    case MACHINE_TYPE:
      getListMachineResources({licensePlate: data.value, pageIndex: 1}, false);
      break;
    case HUMAN_TYPE:
      getListHumanResources({teamName: data.value, pageIndex: 1}, false);
      break;
    case MATERIAL_TYPE:
      getListMaterialResources({materialName: data.value, pageIndex: 1}, false);
  }
}

const submitForm = async () => {
  planningDetails.value.projectId = projectId.value;
  const payload = {
    id: planningDetails.value.id,
    planName: planningDetails.value.planName,
    projectId: planningDetails.value.projectId,
    planItems: planningDetails.value.planItems,
  };
  const method = !!route.params.id ? "update" : "create";
  const forms = [
    {
      ref: selectionFormRef,
      name: t("planning.form_ref.planning_info"),
    },
    {
      ref: detailsFormRef,
      name: t("planning.form_ref.planning_items"),
    }
  ];

  for (const form of forms) {
    const isValid = await new Promise((resolve) => {
      form.ref.value?.ruleFormRef.validate((valid) => resolve(valid));
    });

    if (!isValid) {
      mixinMethods.notifyError(
          t("planning.errors.invalid_form", {form: form.name})
      );
      return; // stop here if one form is invalid
    }
  }
  await savePlanning(payload, method);
}

// Handle visibility change (tab switching, minimizing browser)
const handleVisibilityChange = () => {
  if (document.hidden && route.params.id && isLocked.value && isCurrentUserLock.value) {
    // Page is hidden, release the lock
    releaseLock(route.params.id);
  } else if (!document.hidden && route.params.id && allowEdit.value) {
    // Page is visible again, try to reacquire the lock
    checkLockStatus(route.params.id).then(() => {
      if (!isLocked.value) {
        acquireLock(route.params.id).then(() => {
          if (isLocked.value && isCurrentUserLock.value) {
            startHeartbeat();
          }
        });
      } else if (!isCurrentUserLock.value) {
        showLockWarning.value = true;
      }
    });
  }
};

// Handle page unload (closing browser, refreshing page)
const handleBeforeUnload = (event) => {
  if (route.params.id && isLocked.value && isCurrentUserLock.value) {
    // Try to release the lock before unloading
    // This may not always work as the page might close before the API call completes
    releaseLock(route.params.id);
  }
};
</script>

<style scoped>
.btn-container {
  display: flex;
}
</style>
