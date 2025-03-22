<template>
  <el-card shadow="hover">
    <el-collapse class="user-card" v-model="activeCollapseItems">
      <el-collapse-item name="1">
        <template #title>
          <h3>Danh sách người thực hiện</h3>
        </template>
        <div>
          <div v-for="user in assignedUsers" :key="user.id" class="user">
            <el-avatar :src="user.avatar"/>
            <span>{{ user.name }} ({{ user.role }})</span>
          </div>
        </div>
      </el-collapse-item>

      <el-collapse-item name="2">
        <template #title>
          <h3>Danh sách người theo dõi</h3>
        </template>
        <div>
          <div v-for="user in assignedUsers" :key="user.id" class="user">
            <el-avatar :src="user.avatar"/>
            <span>{{ user.name }} ({{ user.role }})</span>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>

    <div class="section">
      <h3>Thông tin người giao việc</h3>
      <p><strong>Người giao:</strong> {{ assigner.name }}</p>
      <p><strong>Ngày giao:</strong> {{ assignDate }}</p>
    </div>
  </el-card>
</template>

<script setup>
import {ref} from "vue";

const activeCollapseItems = ref(["1", "2", "4"]);
const assignedUsers = ref([
  {
    id: 1,
    name: "Đỗ Hùng Dũng",
    role: "BAN CHỈ HUY",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
  },
  {
    id: 2,
    name: "Nguyễn Quang Hải",
    role: "KỸ SƯ GIÁM SÁT",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
  },
  {
    id: 3,
    name: "Trần Đình Trọng",
    role: "KỸ SƯ HIỆN TRƯỜNG",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
  },
  {
    id: 4,
    name: "Lương Xuân Trường",
    role: "GIÁM SÁT AN TOÀN",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
  },
  {
    id: 5,
    name: "Phạm Đức Huy",
    role: "CÔNG NHÂN",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
  },
  {
    id: 6,
    name: "Bùi Tiến Dũng",
    role: "LÁI MÁY XÚC",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
  },
  {
    id: 7,
    name: "Vũ Văn Thanh",
    role: "KẾ TOÁN DỰ ÁN",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
  },
  {
    id: 8,
    name: "Nguyễn Văn Toàn",
    role: "THỢ CƠ KHÍ",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
  },
  {
    id: 9,
    name: "Hà Đức Chinh",
    role: "THỢ ĐIỆN",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
  },
  {
    id: 10,
    name: "Quế Ngọc Hải",
    role: "KỸ SƯ XÂY DỰNG",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
  }
]);


const assigner = ref({name: "Trần Văn Bằng"});
const assignDate = ref("25/04/2024");

const reminder = ref({
  perform: "Không nhắc",
  deadline: "Nhắc tự động",
  notifier: "Người thực hiện"
});

const editAssignedUsers = () => {
  console.log("Edit assigned users");
};

const editWatchers = () => {
  console.log("Edit watchers");
};

const editCollaborators = () => {
  console.log("Edit collaborators");
};

const editReminder = () => {
  console.log("Edit reminder settings");
};
</script>

<style scoped>
.section {
  margin-bottom: 16px;
}

.user {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.el-link {
  cursor: pointer;
}
</style>
