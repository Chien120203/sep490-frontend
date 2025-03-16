<template>
  <div class="selection-filters">
    <div class="form-container">
      <div>
        <!-- Tên kế hoạch -->
        <el-form-item label-class="custom-label">
          <template #label> Tên kế hoạch </template>
          <el-input v-model="selectedPlan" />
        </el-form-item>

        <!-- Mã kế hoạch -->
        <el-form-item label-class="custom-label">
          <template #label> Mã kế hoạch </template>
          <el-input v-model="selectedPlanCode" />
        </el-form-item>
      </div>

      <div>
        <!-- Người phụ trách -->
        <el-form-item label-class="custom-label">
          <template #label> Người phụ trách </template>
          <el-select v-model="selectedManager" placeholder="Chọn người phụ trách" @change="emit('updateManager', selectedManager)">
            <el-option v-for="user in managers" :key="user.id" :label="user.name" :value="user.id"></el-option>
          </el-select>
        </el-form-item>

        <!-- Người theo dõi -->
        <el-form-item label-class="custom-label">
          <template #label> Người theo dõi </template>
          <el-select v-model="selectedFollowers" multiple placeholder="Chọn người theo dõi" @change="emit('updateFollowers', selectedFollowers)">
            <el-option v-for="user in followers" :key="user.id" :label="user.name" :value="user.id"></el-option>
          </el-select>
        </el-form-item>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps({
  managers: Array,
  followers: Array,
});

const selectedPlan = ref("monthly");
const selectedPlanCode = ref("code1");
const selectedMonth = ref("2024-01");
const selectedManager = ref(null);
const selectedFollowers = ref([]);
const searchQuery = ref("");

const emit = defineEmits(["updatePlan", "updateMonth", "updateManager", "updateFollowers", "search"]);
</script>

<style scoped>
.selection-filters {
  padding: 10px;
}

.custom-label {
  width: 20%;
  display: inline-block;
}

.form-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* 2 columns */
  gap: 15px;
}
</style>
