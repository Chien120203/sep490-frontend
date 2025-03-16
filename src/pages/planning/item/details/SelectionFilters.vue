<template>
  <div class="selection-filters">
    <div class="form-container">
      <div>
        <!-- Kỳ lập kế hoạch -->
        <el-form-item label="Tên kế hoạch">
          <el-input v-model="selectedPlan" />
        </el-form-item>

        <!-- Kế hoạch tháng -->
        <el-form-item label="Ngày lên kế hoạch">
          <el-date-picker
              v-model="selectedMonth"
              style="width: 100%"
              placeholder="Chọn tháng"
              @change="emit('updateMonth', selectedMonth)"
          />
        </el-form-item>
      </div>

      <div>
        <!-- Người phụ trách -->
        <el-form-item label="Người phụ trách">
          <el-select v-model="selectedManager" placeholder="Chọn người phụ trách" @change="emit('updateManager', selectedManager)">
            <el-option v-for="user in managers" :key="user.id" :label="user.name" :value="user.id"></el-option>
          </el-select>
        </el-form-item>

        <!-- Người theo dõi -->
        <el-form-item label="Người theo dõi">
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

.search-work {
  width: 60%;
}

.form-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* 2 columns */
  gap: 15px;
}
</style>
