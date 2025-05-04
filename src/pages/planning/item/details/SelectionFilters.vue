<template>
  <div class="selection-filters">
    <el-form
        ref="ruleFormRef"
        :model="planDetails"
        :rules="rules"
        class="form-search-box"
        label-width="15%"
    >
      <div class="form-container">
        <div>
          <!-- Tên kế hoạch -->
          <el-form-item prop="planName">
            <template #label> {{$t('planning.form.name')}} </template>
            <el-input :disabled="!allowEdit" required v-model="planDetails.planName" />
          </el-form-item>

          <!-- Người theo dõi -->
          <el-form-item prop="reviewers">
            <template #label> {{$t('planning.form.inspector')}} </template>
            <el-select disabled v-model="listSelectedUsers" multiple>
              <el-option
                  v-for="user in planDetails.reviewers"
                  :key="user.id"
                  :label="user.name"
                  :value="user.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>

        <div>
          <!-- Ngày bắt đầu -->
          <el-form-item>
            <template #label> {{$t('planning.form.ctr_start_date')}} </template>
            <el-date-picker
                style="width: 100%"
                class="custom-input"
                v-model="contractDetails.startDate"
                type="date"
                :disabled="true"
                :placeholder="$t('planning.form.select_date')"
            />
          </el-form-item>

          <!-- Ngày kết thúc -->
          <el-form-item>
            <template #label> {{$t('planning.form.ctr_end_date')}} </template>
            <el-date-picker
                style="width: 100%"
                class="custom-input"
                v-model="contractDetails.endDate"
                type="date"
                :disabled="true"
                placeholder="Select Date"
            />
          </el-form-item>

          <!-- Ngân sách -->
          <el-form-item>
            <template #label> {{$t('planning.form.budget')}} </template>
            <el-input
                v-model="totalPrice"
                :formatter="(value) => mixinMethods.formatInputMoney(value)"
                :parser="(value) => mixinMethods.parseInputCurrency(value)"
                :disabled="true"
            />
            <p style="margin-bottom: 18px" class="error-feedback">
              {{ exceedMessages }}
            </p>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <!-- Hiển thị thông tin công việc đã chọn -->
    <div v-if="lockData != null && !lockData?.isCurrentUserLock" class="selected-task-display">
      <el-alert
          type="warning"
          show-icon
          :title="$t('planning.alert.locked_title', { userName: lockData?.userName })"
          :description="$t('planning.alert.locked_description')"
          style="margin-bottom: 16px"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps,defineEmits, computed } from "vue";
import { mixinMethods } from "@/utils/variables.js";
import {useI18n} from "vue-i18n";
import {DATE_TIME_FORMAT} from "@/constants/application.js";

const props = defineProps({
  planDetails: {
    type: Object,
    default: () => ({}),
  },
  contractDetails: {
    type: Object,
    default: () => ({}),
  },
  lockInfo: {
    type: Object,
    default: () => ({}),
  },
  rules: {
    type: Object,
    default: () => ({}),
  },
  allowEdit: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["disable-btn"]);
const ruleFormRef = ref(null);
const {t} = useI18n();
const listSelectedUsers = computed(() =>
    props.planDetails.reviewers.map((user) => user.id)
);

const lockData = computed(() => props.lockInfo);

const totalPrice = computed(() =>
    props.contractDetails.contractDetails.reduce((sum, item) => sum + item.total, 0)
);

const formatLockTime = (dateTimeString) => {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  return mixinMethods.showDateTime(date, DATE_TIME_FORMAT);
};

const exceedMessages = computed(() => {
  const hasChildren = (task) => props.planDetails.planItems.some(child => child.parentIndex === task.index);

  // Correctly calculate the actual budget by summing only leaf nodes (items without children)
  const actualBudget = props.planDetails.planItems.reduce((sum, item) => {
    return sum + (hasChildren(item) ? 0 : item.totalPrice);
  }, 0);

  if(totalPrice.value < actualBudget) {
    emit("disable-btn", true);
    return t('planning.errors.exceed_budget');
  }
  emit("disable-btn", false);
  return '';
});

defineExpose({
  ruleFormRef,
});
</script>

<style scoped>
.selection-filters {
  padding: 10px;
}

.form-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}
</style>
