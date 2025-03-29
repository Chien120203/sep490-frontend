<template>
  <div class="planning-block">
    <div class="planning planning-create planning-detail">
      <div class="planning-header">
        <h3 class="page__ttl">
          <span class="btn-back" @click="handleBack"><IconBackMain/></span>
          {{
            isUpdate ? $t('planning.edit.title') : $t('planning.create.title')
          }}
        </h3>
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
              :planDetails="planningDetails.value"
              :managers="managers"
              :followers="followers"
              @updateFollowers="updateListQAs"
          />
          <PlanningDetails :items="planningDetails.value.planItems" :isUpdate="isUpdate" @update:items="updateItems" @editPlanDetails="handleEditPlanDetails"/>
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
      :show="isShowModalItemDtls"
      :materials="materials"
      :selectedRow="selectedRow"
      :tasks="planningDetails.value.planItems"
      :isUpdate="isUpdate"
      :users="listEmployees"
      :vehicles="listVehicles"
      @close="handleCloseModal"
      @submit="handleSaveItemDetails"
  />
</template>

<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import IconBackMain from "@/svg/IconBackMain.vue";
import TitleNavigation from "@/components/common/TitleNavigation.vue";
import SelectionFilters from "@/pages/planning/item/details/SelectionFilters.vue";
import PlanningDetails from "@/pages/planning/item/details/PlanningDetails.vue";
import ActivityComponent from "@/pages/planning/item/details/ActivityComponent.vue";
import PAGE_NAME from "@/constants/route-name.js";
import {useProjectStore} from "@/store/project.js";
import {useCustomerStore} from "@/store/customer.js";
import {useUserStore} from "@/store/user.js";
import {mixinMethods} from "@/utils/variables";
import {CONSTRUCTION_MANAGER, RESOURCE_MANAGER, TECHNICAL_MANAGER} from "@/constants/roles.js";
import PlanItemDetailsModal from "@/pages/planning/item/modal/PlanItemDetailsModal.vue";
import {useContractStore} from "@/store/contract.js";
import {usePlanningStore} from "@/store/planning.js";

const selectedTab = ref("info"); // Default tab
const listTabs =ref([
  {
    name: "info",
    label: "Info",
  },
  {
    name: "activity",
    label: "Activity",
  },
]);
const listConstructionManagers = ref([]);
const listTechnicalManagers = ref([]);
const listResourceManagers = ref([]);
const isShowModalItemDtls = ref(false);
const isUpdate = computed(() => !!route.params.id);
const selectedRow = ref({});
// Mock Data
const statuses = ref([
  {title: "Khởi tạo", description: "", status: "success"},
  {
    title: "Duyệt phòng ban",
    description: "Phòng kỹ thuật, Phòng tài nguyên",
    status: "process"
  },
  {title: "Giám đốc duyệt", description: "", status: ""}
]);
const materials = ref([
  {id: 1, name: "Cát xây dựng", unit: "kg", rate: 1, coefficient: 1, quantity: 100, unitPrice: 50000},
  {id: 2, name: "Xi măng", unit: "kg", rate: 0.5, coefficient: 1, quantity: 50, unitPrice: 70000},
]);
const listEmployees = ref([
  {id: 1, name: "Nhân viên 1", unit: "kg", rate: 1, coefficient: 1, quantity: 100, unitPrice: 50000},
  {id: 2, name: "Nhân viên 2", unit: "kg", rate: 0.5, coefficient: 1, quantity: 50, unitPrice: 70000},
]);
const listVehicles = ref([
  {id: 1, name: "Xe 1", unit: "kg", rate: 1, coefficient: 1, quantity: 100, unitPrice: 50000},
  {id: 2, name: "Xe 2", unit: "kg", rate: 0.5, coefficient: 1, quantity: 50, unitPrice: 70000},
]);
const currentStep = ref(1);
const managers = ref([{id: 1, name: 'Trần Văn Bằng'}]);
const followers = ref([{id: 2, name: 'Đặng Xuân Trường'}]);
const tasks = ref(
    [
      {
        "index": "1",
        "parentIndex": null,
        "workName": "Excavation Work",
        "workCode": "EXC-001",
        "unit": "m³",
        "quantity": 10,
        "unitPrice": 500000,
        "total": 5000000,
        "deleted": false
      },
      {
        "index": "2",
        "parentIndex": "1",
        "workName": "Concrete Pouring",
        "workCode": "CON-002",
        "unit": "m³",
        "quantity": 8,
        "unitPrice": 750000,
        "total": 6000000,
        "deleted": false
      },
      {
        "index": "3",
        "parentIndex": "2",
        "workName": "Steel Reinforcement",
        "workCode": "STE-003",
        "unit": "Kg",
        "quantity": 500,
        "unitPrice": 20000,
        "total": 10000000,
        "deleted": false
      },
      {
        "index": "4",
        "parentIndex": null,
        "workName": "Bricklaying",
        "workCode": "BRI-004",
        "unit": "m²",
        "quantity": 50,
        "unitPrice": 150000,
        "total": 7500000,
        "deleted": false
      },
      {
        "index": "5",
        "parentIndex": "4",
        "workName": "Plastering",
        "workCode": "PLA-005",
        "unit": "m²",
        "quantity": 60,
        "unitPrice": 120000,
        "total": 7200000,
        "deleted": false
      }
    ]
);
const teams = ref([{id: 1, name: 'BCH - BAN CHỈ HUY'}]);
const activities = ref([
  {
    id: 1,
    username: "Trần Văn Bằng",
    text: "đã cập nhật kế hoạch thi công",
    time: "14:36",
    icon: "✏️",
    type: "edit",
    date: "23/05/2024",
  },
  {
    id: 2,
    username: "Nguyễn Văn A",
    text: "đã thêm mới kế hoạch thi công",
    time: "15:20",
    icon: "➕",
    type: "add",
    date: "23/05/2024",
  },
  {
    id: 3,
    username: "Lê Thị B",
    text: "đã xác nhận hoàn thành kế hoạch",
    time: "16:45",
    icon: "✅",
    type: "confirm",
    date: "24/05/2024",
  },
]); // Placeholder for activity data

// Store Data
const projectStore = useProjectStore();
const customerStore = useCustomerStore();
const userStore = useUserStore();
const contractStore = useContractStore();
const planningStore = usePlanningStore();

const {
  contractDetails,
  getContractDetails,
} = contractStore;
const {listUsers, getListUsers} = userStore;
const {listCustomers, getListCustomers} = customerStore;
const {validation, projectDetails, saveProject, getProjectDetails, clearProjectDetails} = projectStore;
const {
  planningDetails
} = planningStore;

const route = useRoute();
const router = useRouter();

onMounted(async () => {
  await getContractDetails(34);
  await getListCustomers({search: "", pageIndex: 1}, false);
  await getListUsers({keyWord: "", pageIndex: 1}, false);
  listConstructionManagers.value = listUsers.value.filter(item => item.role === CONSTRUCTION_MANAGER);
  listResourceManagers.value = listUsers.value.filter(item => item.role === RESOURCE_MANAGER);
  listTechnicalManagers.value = listUsers.value.filter(item => item.role === TECHNICAL_MANAGER);
});

onUnmounted(() => {
  clearProjectDetails();
});

const handleBack = () => {
  router.push({name: PAGE_NAME.PLANNING.LIST});
};

const updateItems = (newItems) => {
  planningDetails.value.planItems = newItems;
};

const handleEditPlanDetails = (row) => {
  selectedRow.value = row;
  isShowModalItemDtls.value = true;
}

const handleCloseModal = () => {
  isShowModalItemDtls.value = false;
}

const handleSaveItemDetails = (data) => {
  planningDetails.value.planItems = planningDetails.value.planItems.map(item =>
      item.index === selectedRow.value.index ? { ...item, ...data } : item
  );
  handleCloseModal();
  console.log(planningDetails.value);
};

// Handle Tab Change from TitleNavigation
const handleTabChange = (tab) => {
  selectedTab.value = tab;
};
</script>
