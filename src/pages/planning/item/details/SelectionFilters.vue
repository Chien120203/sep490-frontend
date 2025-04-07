<template>
  <div class="selection-filters">
    <el-form
        ref="ruleFormRef"
        :model="planDetails"
        :rules="rules"
        class="form-search-box"
    >
      <div class="form-container">
        <div>
          <!-- Tên kế hoạch -->
          <el-form-item prop="planName" label-class="custom-label">
            <template #label> {{$t('planning.form.name')}} </template>
            <el-input required v-model="planDetails.planName" />
          </el-form-item>
        </div>

        <div>
          <!-- Người theo dõi -->
          <el-form-item prop="selectedFollowers" label-class="custom-label">
            <template #label> {{$t('planning.form.inspector')}} </template>
            <el-select v-model="selectedFollowers" multiple @change="emit('updateFollowers', selectedFollowers)">
              <el-option v-for="user in followers" :key="user.id" :label="user.username" :value="user.id"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import {ref, defineProps, defineEmits, computed} from "vue";

const props = defineProps({
  followers: Array,
  planDetails: {
    type: Object,
    default: () => {},
  },
  rules: {
    type: Object,
    default: () => {}
  }
});
const ruleFormRef = ref(null);
defineExpose({
  ruleFormRef,
});

const selectedFollowers = ref(
    props.planDetails.reviewers?.map((r) => r.id) || []
);
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
