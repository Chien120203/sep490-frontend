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
          <GanttTable :tasks="mockTasks" />
        </div>

        <div v-if="selectedTab === 'log'">
          <ConstructionLogTable
            @choose-date="handleChooseDate"
          />
        </div>

        <div v-if="selectedTab === 'dependency'">
          <div class="add-new-dependency-container">
            <el-button class="btn btn-save" @click="handleDisplayDependencyModal">
              {{ $t("customer.add_new") }}
            </el-button>
          </div>
          <DependencyTaskTable
            @details="handleDisplayDependencyModal"
            @delete="handleDisplayDeleteDepModal"
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

<!--    Dependency Modal-->
    <DependencyModal
      :show="isShowModalDependency"
      @close="handleDisplayDependencyModal(false)"
      @submit="handleSaveDependency"
    />
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
import {computed, onMounted, onUnmounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import TitleNavigation from "@/components/common/TitleNavigation.vue";
import GanttTable from "@/pages/progress/items/modal/items/progress-details/GanttTable.vue";
import ConstructionLogTable from "@/pages/construction-log/items/ConstructionLogTable.vue";
import DependencyTaskTable from "@/pages/progress/items/modal/items/progress-details/DependencyTaskTable.vue";
import EmployeeTable from "@/pages/progress/items/modal/items/progress-details/EmployeeTable.vue";
import DependencyModal from "@/pages/progress/items/modal/DependencyModal.vue";
import ModalConfirm from "@/components/common/ModalConfirm.vue";

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
const mockTasks = [
  {
    id: 1,
    name: "Vận chuyển đất bằng ô tô 5T",
    plan: 100,
    actual: 100,
    progress: 100,
    dates: {
      "01/01": 7.8,
      "02/01": 7.98,
      "03/01": 0.8,
      "04/01": 1.79,
      "05/01": 1.71,
      "06/01": 0,
      "07/01": 0.56,
      "08/01": 6.32,
      "09/01": 0,
      "10/01": 8.11,
      "11/01": 0.69,
      "12/01": 5.56,
      "13/01": 8.9,
      "14/01": 1.93,
      "15/01": 0,
      "16/01": 9.58,
      "17/01": 1.61,
      "18/01": 0,
      "19/01": 3.77,
      "20/01": 0,
      "21/01": 9.07,
      "22/01": 0,
      "23/01": 6.77,
      "24/01": 7.94,
      "25/01": 8.83,
      "26/01": 0,
      "27/01": 6.7,
      "28/01": 1.37,
      "29/01": 0,
      "30/01": 0,
      "31/01": 5.54
    },
    children: [
      {
        id: 2,
        name: "Ô tô tự đổ 5T",
        plan: 50,
        actual: 50,
        progress: 100,
        dates: {
          "01/01": 6.14,
          "02/01": 5.48,
          "03/01": 3.34,
          "04/01": 0,
          "05/01": 7.39,
          "06/01": 6.97,
          "07/01": 0,
          "08/01": 0,
          "09/01": 0,
          "10/01": 2.6,
          "11/01": 8.89,
          "12/01": 0,
          "13/01": 0,
          "14/01": 5.89,
          "15/01": 0,
          "16/01": 0,
          "17/01": 0,
          "18/01": 0,
          "19/01": 6.17,
          "20/01": 0,
          "21/01": 0,
          "22/01": 0.74,
          "23/01": 1.97,
          "24/01": 3.22,
          "25/01": 2.46,
          "26/01": 6.24,
          "27/01": 0,
          "28/01": 0,
          "29/01": 0,
          "30/01": 7.15,
          "31/01": 9.57
        }
      }
    ]
  }
];
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
const isShowModalDependency = ref(false);
const isShowModalConfirm = ref(false);

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
};

const handleDisplayDependencyModal = (isDisplay = true) => {
  isShowModalDependency.value = isDisplay;
}

const handleDisplayDeleteDepModal = (isDisplay = true) => {
  title.value = "Delete Dependency";
  message.value = "Do you really want to delete Dependency?";
  isShowModalConfirm.value = isDisplay;
}

const handleSaveDependency = (obj) => {
  console.log(obj);
}

const handleConfirmDeleteDep = () => {

}

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
