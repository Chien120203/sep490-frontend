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
                placeholder="Select Date"
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
  </div>
</template>

<script setup>
import { ref, defineProps,defineEmits, computed } from "vue";
import { mixinMethods } from "@/utils/variables.js";
import {MATERIAL_TYPE} from "@/constants/resource.js";
import {useI18n} from "vue-i18n";

const props = defineProps({
  planDetails: {
    type: Object,
    default: () => ({}),
  },
  contractDetails: {
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

const totalPrice = computed(() =>
    props.contractDetails.contractDetails.reduce((sum, item) => sum + item.total, 0)
);

const exceedMessages = computed(() => {
  const actualBudget = props.planDetails.planItems.reduce((sum, item) => sum + item.totalPrice, 0);
  if(totalPrice.value < actualBudget) {
    emit("disable-btn", true);
    return t('planning.errors.exceed_budget');
  }
  emit("disable-btn", false);
  return ''
})

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
