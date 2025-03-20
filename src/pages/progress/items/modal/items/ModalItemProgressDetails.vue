<template>
  <div class="planning-block">
    <div class="planning planning-create planning-detail">
      <div>
        <TitleNavigation
            :listTabs="listTabs"
            :selectedTab="selectedTab"
            @tabChange="handleTabChange"
        />

        <div v-if="selectedTab === 'statistic'">
          <GanttTable :tasks="mockTasks" />
        </div>

        <div v-if="selectedTab === 'log'">
          <ConstructionLogTable/>
        </div>

        <div v-if="selectedTab === 'dependency'">
          <DependencyTaskTable/>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import TitleNavigation from "@/components/common/TitleNavigation.vue";
import PAGE_NAME from "@/constants/route-name.js";
import {useProjectStore} from "@/store/project.js";
import {useCustomerStore} from "@/store/customer.js";
import {useUserStore} from "@/store/user.js";
import {mixinMethods} from "@/utils/variables.js";
import {useContractStore} from "@/store/contract.js";
import GanttTable from "@/pages/progress/items/modal/items/progress-details/GanttTable.vue";
import ConstructionLogTable from "@/pages/construction-log/items/ConstructionLogTable.vue";
import DependencyTaskTable from "@/pages/progress/items/modal/items/progress-details/DependencyTaskTable.vue";

const selectedTab = ref("statistic"); // Default tab
const listTabs =ref([
  {
    name: "statistic",
    label: "Thống kê",
  },
  {
    name: "log",
    label: "Nhật ký thi công",
  },
  {
    name: "dependency",
    label: "Công việc phụ thuộc",
  }
]);
const mockTasks = [
  {
    id: 1,
    name: "Vận chuyển đất bằng ô tô 5T",
    plan: 33.41,
    actual: 33.41,
    progress: 100,
    dates: {
      "13/01": 0,
      "14/01": 10,
      "15/01": 0,
      "16/01": 0,
      "17/01": 10,
      "18/01": 10,
      "19/01": 3.41
    },
    children: [
      {
        id: 2,
        name: "Ô tô tự đổ 5T",
        plan: 6.9,
        actual: 6.9,
        progress: 100,
        dates: {
          "14/01": 2.07,
          "15/01": 0,
          "16/01": 0,
          "17/01": 2.07,
          "18/01": 2.07,
          "19/01": 0.7
        }
      }
    ]
  }
];


const isShowModalItemDtls = ref(false);
const isUpdate = computed(() => !!route.params.id);

// Store Data
const projectStore = useProjectStore();
const customerStore = useCustomerStore();
const userStore = useUserStore();
const contractStore = useContractStore();

const {
  contractDetails,
  getContractDetails,
} = contractStore;
const {listUsers, getListUsers} = userStore;
const {listCustomers, getListCustomers} = customerStore;
const {validation, projectDetails, saveProject, getProjectDetails, clearProjectDetails} = projectStore;

const route = useRoute();
const router = useRouter();

onMounted(async () => {
});

onUnmounted(() => {
  clearProjectDetails();
});

const handleBack = () => {
  router.push({name: PAGE_NAME.PLANNING.LIST});
};

const updateItems = (newItems) => {
  contractDetails.value.contractDetails = newItems;
};

const handleEditPlanDetails = (id) => {
  isShowModalItemDtls.value = true;
}

const handleCloseModal = () => {
  isShowModalItemDtls.value = false;
}

const ruleFormRef = ref(null);

const submitForm = () => {
  projectDetails.value.budget = mixinMethods.handleChangeNumber(projectDetails.value.budget);
  ruleFormRef.value.validate(valid => {
    if (valid) {
      saveProject(projectDetails.value);
    }
  });
};

// Handle Tab Change from TitleNavigation
const handleTabChange = (tab) => {
  selectedTab.value = tab;
};
</script>
