<template>
  <div class="selection-filters">
    <div class="form-container">
      <div>
        <!-- Tên kế hoạch -->
        <el-form-item label-class="custom-label">
          <template #label> Tên kế hoạch </template>
          <el-input v-model="planDetails.planName" />
        </el-form-item>
      </div>

      <div>
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
  planDetails: {
    type: Object,
    default: () => {},
  }
});

const selectedFollowers = ref([]);

const emit = defineEmits([ "updateFollowers", "search"]);
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
