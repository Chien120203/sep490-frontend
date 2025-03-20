<template>
  <el-card shadow="hover">
    <div class="section">
      <h3>Danh sách người thực hiện</h3>
      <div v-for="user in assignedUsers" :key="user.id" class="user">
        <el-avatar :src="user.avatar" />
        <span>{{ user.name }} ({{ user.role }})</span>
      </div>
      <el-link type="primary" @click="editAssignedUsers">Bạn muốn thay đổi người thực hiện?</el-link>
    </div>

    <div class="section">
      <h3>Danh sách người theo dõi</h3>
      <el-link type="primary" @click="editWatchers">Bạn muốn thay đổi người theo dõi?</el-link>
    </div>

    <div class="section">
      <h3>Người phối hợp (CĐT)</h3>
      <el-link type="primary" @click="editCollaborators">Bạn muốn thay đổi người phối hợp (CĐT)?</el-link>
    </div>

    <div class="section">
      <h3>Thông tin người giao việc</h3>
      <p><strong>Người giao:</strong> {{ assigner.name }}</p>
      <p><strong>Ngày giao:</strong> {{ assignDate }}</p>
    </div>

    <div class="section">
      <h3>Lịch nhắc việc</h3>
      <p><strong>Thực hiện:</strong> {{ reminder.perform }}</p>
      <p><strong>Hạn hoàn thành:</strong> {{ reminder.deadline }}</p>
      <p><strong>Người nhắc:</strong> {{ reminder.notifier }}</p>
      <el-link type="primary" @click="editReminder">Bạn muốn thay đổi lịch nhắc?</el-link>
    </div>
  </el-card>
</template>

<script setup>
import { ref } from "vue";

const assignedUsers = ref([
  { id: 1, name: "Đỗ Hùng Dũng", role: "BAN CHỈ HUY", avatar: "https://via.placeholder.com/40" }
]);

const assigner = ref({ name: "Trần Văn Bằng" });
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
