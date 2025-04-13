<template>
  <div class="planning-block">
    <div class="planning planning-create planning-detail">
      <div>
        <div class="progress-details-nav">
          <TitleNavigation
              :listTabs="listTabs"
              :selectedTab="selectedTab"
              @tabChange="handleTabChange"
          />
        </div>

        <div v-if="selectedTab === 'statistic'">
          <StatisticTable :taskDetails="task" :taskPlan="taskPlan" :listLogsByTask="listLogsByTask" />
        </div>

        <div v-if="selectedTab === 'log'">
          <ConstructionLogTable
              :title="title"
              :dateRange="searchForm"
              :listLog="listLogsByTask"
              @choose-date="handleChooseDate"
          />
        </div>

        <div v-if="selectedTab === 'dependency'">
          <DependencyTaskTable
              ref="dependentFormRef"
              :rules="PLANNING_RULES"
              :tasks="tasks"
              :selectedRow="selectedRow"
          />
        </div>

        <div v-if="selectedTab === 'employee'">
          <div class="add-new-dependency-container">
            <el-button class="btn btn-save" @click="handleDisplayDependencyModal">
              {{ $t("customer.add_new") }}
            </el-button>
          </div>
          <EmployeeTable
            :listUsers="dataUsers"
            @details="handleGetEmployeeDtls"
            @delete="handleDisplayDeleteEmployeeModal"
          />
        </div>
      </div>
    </div>
    <ModalConfirm
        :isShowModal="isShowModalConfirm"
        @close-modal="handleDisplayDeleteDepModal(false)"
        @confirmAction="handleConfirmDeleteDep"
        :message="message"
        :title="title"
    />
  </div>
</template>

<script setup>
import {defineProps, onMounted, onUnmounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import TitleNavigation from "@/components/common/TitleNavigation.vue";
import StatisticTable from "@/pages/progress/items/modal/items/progress-details/StatisticTable.vue";
import ConstructionLogTable from "@/pages/construction-log/items/ConstructionLogTable.vue";
import DependencyTaskTable from "@/pages/planning/item/modal/items/DependencyTaskTable.vue";
import EmployeeTable from "@/pages/progress/items/modal/items/progress-details/EmployeeTable.vue";
import {getPlanningRules} from "@/rules/planning/index.js";
import ModalConfirm from "@/components/common/ModalConfirm.vue";

const props = defineProps({
  listLogsByTask: {
    type: Array,
    default: () => []
  },
  taskPlan: {
    type: Object,
    default: () => {}
  },
  task: {
    type: Object,
    default: () => {}
  }
});
const searchForm = ref({
  startDate: "2025-04-01",
  endDate: "2025-04-30"
});
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
  },
  {
    name: "employee",
    label: "Danh sách người thực hiện",
  }
]);
const dataUsers = ref([
  {
    id: 1,
    username: "hungdung10",
    fullName: "Đỗ Hùng Dũng",
    email: "hungdung10@example.com",
    dob: "1993-09-08",
    gender: "male",
    role: "BAN CHỈ HUY",
    phone: "0987654321"
  },
  {
    id: 2,
    username: "quanghai19",
    fullName: "Nguyễn Quang Hải",
    email: "quanghai19@example.com",
    dob: "1997-04-12",
    gender: "male",
    role: "KỸ SƯ GIÁM SÁT",
    phone: "0971122334"
  },
  {
    id: 3,
    username: "dinhtrong04",
    fullName: "Trần Đình Trọng",
    email: "dinhtrong04@example.com",
    dob: "1997-04-25",
    gender: "male",
    role: "KỸ SƯ HIỆN TRƯỜNG",
    phone: "0965566778"
  },
  {
    id: 4,
    username: "xuantruong06",
    fullName: "Lương Xuân Trường",
    email: "xuantruong06@example.com",
    dob: "1995-04-28",
    gender: "male",
    role: "GIÁM SÁT AN TOÀN",
    phone: "0983344556"
  },
  {
    id: 5,
    username: "duchuy08",
    fullName: "Phạm Đức Huy",
    email: "duchuy08@example.com",
    dob: "1995-01-20",
    gender: "male",
    role: "CÔNG NHÂN",
    phone: "0977889912"
  },
  {
    id: 6,
    username: "tiendung01",
    fullName: "Bùi Tiến Dũng",
    email: "tiendung01@example.com",
    dob: "1997-02-28",
    gender: "male",
    role: "LÁI MÁY XÚC",
    phone: "0988997766"
  },
  {
    id: 7,
    username: "vanthanh17",
    fullName: "Vũ Văn Thanh",
    email: "vanthanh17@example.com",
    dob: "1996-09-14",
    gender: "male",
    role: "KẾ TOÁN DỰ ÁN",
    phone: "0966554433"
  },
  {
    id: 8,
    username: "vantoan09",
    fullName: "Nguyễn Văn Toàn",
    email: "vantoan09@example.com",
    dob: "1996-04-12",
    gender: "male",
    role: "THỢ CƠ KHÍ",
    phone: "0977554422"
  },
  {
    id: 9,
    username: "ducchinh22",
    fullName: "Hà Đức Chinh",
    email: "ducchinh22@example.com",
    dob: "1997-09-22",
    gender: "male",
    role: "THỢ ĐIỆN",
    phone: "0988332211"
  },
  {
    id: 10,
    username: "ngochai03",
    fullName: "Quế Ngọc Hải",
    email: "ngochai03@example.com",
    dob: "1993-05-15",
    gender: "male",
    role: "KỸ SƯ XÂY DỰNG",
    phone: "0977331122"
  }
]);
const title = ref('');
const message = ref('');
const isShowModalConfirm = ref(false);

const PLANNING_RULES = getPlanningRules();

const route = useRoute();
const router = useRouter();

onMounted(async () => {
});

onUnmounted(() => {
});

const ruleFormRef = ref(null);

const handleChooseDate = (date) => {
  const logUrl = `/construct-log/details?date=${date.day}`
  window.open(logUrl, '_blank')
}

const handleTabChange = (tab) => {
  selectedTab.value = tab;
  if(tab === "dependency") {

  }
};

const handleDisplayDeleteEmployeeModal = (isDisplay = true) => {
  title.value = "Delete Employee";
  message.value = "Do you really want to delete Employee?";
  isShowModalConfirm.value = isDisplay;
}

const handleGetEmployeeDtls = () => {

}
</script>

<style scoped>
.progress-details-nav {
  padding: 20px 0;
}
.add-new-dependency-container {
  display: flex;
  justify-content: end;
  margin-bottom: 20px;
}
</style>
