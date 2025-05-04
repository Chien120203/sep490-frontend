<template>
  <el-card class="construction-log-details">
    <!-- Chọn công việc -->
    <SingleOptionSelect
        class="select-item"
        :defaultList="selectedRow"
        :optionKeys="{ id: 'id', value: 'workName' }"
        :listData="listTasks"
        :isRemote="true"
        :showClearable="true"
        :placeholder="$t('construct_log.details.select_task')"
        @handleSelectedParams="handleSelectTask"
        @remoteSearch="handleSearch"
    />

    <!-- Hiển thị thông tin công việc đã chọn -->
    <div v-if="selectedTask" class="selected-task-display">
      <el-alert
          type="info"
          show-icon
          :title="$t('construct_log.details.selected_task', { workName: selectedTask.workName })"
          :description="$t('construct_log.details.task_code', { index: selectedTask.index })"
          style="margin-bottom: 16px"
      />
    </div>

    <!-- Form nhập khối lượng và tài nguyên cho công việc đã chọn -->
    <div v-if="selectedTask">
      <el-divider content-position="left"></el-divider>
      <el-collapse v-model="activeCollapseItems">
        <div class="el-collapse-item-header">
          <div class="el-collapse-item-header-title">
            <h3>{{ selectedTask.workName ?? '-' }}</h3>
          </div>
          <div class="el-collapse-item-header-icon">
            <IconCircleClose class="close-icon" :width="15" :height="15" @click="handleDeleteLog(selectedTask.id)"/>
          </div>
        </div>
        <div>
          <el-form
              ref="workAmountForm"
              :model="{listWorkAmount}"
              :rules="rules"
              label-position="top"
              class="form-amount-box"
          >
            <el-form-item class="work-amount-item">
              <template #label>
                <span class="label-start">{{ $t('construct_log.details.planned_quantity') }}</span>
              </template>
              <el-input disabled v-model.number="selectedTask.quantity" type="number" :placeholder="$t('construct_log.details.enter_planned_quantity')" />
            </el-form-item>

            <el-form-item class="work-amount-item" :label="$t('construct_log.details.actual_quantity')" :prop="`listWorkAmount.0.workAmount`">
              <el-input-number disabled style="width: 100%" v-model.number="selectedTask.usedQuantity" :min="0" type="number" :placeholder="$t('construct_log.details.enter_actual_quantity')" />
            </el-form-item>

            <el-form-item class="work-amount-item" :label="$t('construct_log.details.remaining_quantity')" prop="remaining">
              <el-input disabled :value="selectedTask.quantity - selectedTask.usedQuantity" type="number" :placeholder="$t('construct_log.details.enter_remaining_quantity')" />
            </el-form-item>
          </el-form>
        </div>

        <!-- Vật liệu -->
        <el-collapse-item :name="selectedTask.index + '-1'">
          <template #title>
            <h3>{{ $t('construct_log.details.material') }}</h3>
          </template>
          <ListItems
              :resourceType="MATERIAL_TYPE"
              :resources="logDetails"
          />
        </el-collapse-item>

        <!-- Nhân công -->
        <el-collapse-item :name="selectedTask.index + '-2'">
          <template #title>
            <h3>{{ $t('construct_log.details.human') }}</h3>
          </template>
          <ListItems
              :resourceType="HUMAN_TYPE"
              :resources="logDetails"
          />
        </el-collapse-item>

        <!-- Phương tiện -->
        <el-collapse-item :name="selectedTask.index + '-3'">
          <template #title>
            <h3>{{ $t('construct_log.details.vehicle') }}</h3>
          </template>
          <ListItems
              :resourceType="MACHINE_TYPE"
              :resources="logDetails"
          />
        </el-collapse-item>
      </el-collapse>
    </div>
  </el-card>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import SingleOptionSelect from '@/components/common/SingleOptionSelect.vue';
import ListItems from '@/pages/inspection-report/item/ListItems.vue';
import IconCircleClose from '@/svg/IconCircleClose.vue';
import { HUMAN_TYPE, MACHINE_TYPE, MATERIAL_TYPE } from '@/constants/resource.js';
import {WAIT_FOR_INSPECT} from "@/constants/progress.js";

const { t } = useI18n();

const props = defineProps({
  progressDtls: { type: Object, default: () => ({}) },
  inspectionReportDetails: { type: Object, default: () => ({}) },
  rules: { type: Object, default: () => ({}) }
});

const activeCollapseItems = ref(['1', '2', '3']);
const selectedRow = ref(null);

const machineForm = ref(null);
const materialForm = ref(null);
const humanForm = ref(null);
const workAmountForm = ref(null);
defineExpose({ machineForm, materialForm, humanForm, workAmountForm });

const hasChildren = (parent) => props.progressDtls.progressItems.some(child => child.parentIndex === parent.index);
const listTasks = computed(() => props.progressDtls.progressItems?.filter(item => item.status === WAIT_FOR_INSPECT) || []);
// Chỉ lưu 1 workAmount cho task đang chọn
const listWorkAmount = ref([{ workAmount: 0 }]);

const selectedTask = computed(() => {
  if (!props.inspectionReportDetails.constructionProgressItemId) return null;
  return props.progressDtls.progressItems.find(task => task.id === props.inspectionReportDetails.constructionProgressItemId);
});
const logDetails = computed(() => selectedTask.value.details);

const handleSelectTask = (id) => {
  let selectedItem = props.progressDtls.progressItems.find(task => task.id === id);
  props.inspectionReportDetails.constructionProgressItemId = id;
  listWorkAmount.value = [{ workAmount: selectedItem.usedQuantity }];
};

const getListResourcesByType = (task, type) =>
    task.details
        .filter(({ resource }) => resource.type === type)
        .map(({ unit, quantity, resource }) => ({
          unit,
          plannedQuantity: quantity,
          ...resource,
        }));

const handleDeleteLog = (index) => {
  props.inspectionReportDetails.constructionProgressItemId = null;
  listWorkAmount.value = [{ workAmount: 0 }];
  emit('remove-task', index);
};

const handleSearch = (value) => {
  console.log(`${t('construct_log.details.search_value')}:`, value);
};
</script>

<style scoped>
.construction-log-details {
  padding: 20px;
}

.close-icon {
  cursor: pointer;
}

.el-collapse-item-header {
  display: flex;
}

.el-collapse-item-header-title {
  width: 95%;
}

.el-collapse-item-header-icon {
  width: 5%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-amount-box {
  display: flex;
  justify-content: space-evenly;
}

.work-amount-item {
  width: 30%;
}

.progress-details {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  align-items: center;
}

.selected-task-display {
  margin-bottom: 16px;
}
</style>