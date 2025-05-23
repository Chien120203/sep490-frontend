<template>
  <SingleOptionSelect
      :isDisabled="!allowEdit"
      :defaultList="selectedValue"
      style="width: 30%"
      class="select-item"
      :optionKeys="dependencyOptions"
      :listData="listSelectTasks"
      @handleSelectedParams="handleSelectTask"
  />
  <el-form
      ref="ruleFormRef"
      :model="selectedRow"
      :rules="rules"
      class="form-search-box"
  >
    <el-table :data="listSelectedTasks" style="width: 100%" border stripe>
      <el-table-column :label="t('progress.table.index')">
        <template #default="{ row }">
          {{ row.index }}
        </template>
      </el-table-column>
      <el-table-column prop="workName" :label="t('progress.table.task_name')" sortable/>
      <el-table-column :label="t('progress.table.start_date')" sortable>
        <template #default="{ row }">
          {{ mixinMethods.showDateTime(row.planStartDate) ?? "-" }}
        </template>
      </el-table-column>
      <el-table-column :label="t('progress.table.due_date')" sortable>
        <template #default="{ row }">
          {{ mixinMethods.showDateTime(row.planEndDate) ?? "-" }}
        </template>
      </el-table-column>
      <el-table-column :label="t('progress.table.dependency_type')" width="390">
        <template #default="{ row }">
          <el-form-item :prop="`itemRelations.${row.index}`" :rules="rules.dependency.map(rule => ({ ...rule, relatedIndex: row.index }))">
            <el-select :disabled="!allowEdit" v-model="selectedRow.itemRelations[row.index]">
              <el-option
                  v-for="(type, index) in TASK_RELATIONSHIPS"
                  :key="index"
                  :label="$t(type.label)"
                  :value="type.value"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column :label="t('progress.table.actions')" width="100">
        <template #default="{ row }">
          <div>
            <button v-if="allowEdit" @click="handleRemoveTask(row.index); $event.preventDefault()" class="btn-edit">
              <IconTrash/>
            </button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
</template>

<script setup>
import {TASK_RELATIONSHIPS} from "@/constants/project.js";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import IconTrash from "@/svg/IconTrash.vue";
import {computed, reactive, ref} from "vue";
import {mixinMethods} from "@/utils/variables.js";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  selectedRow: {
    type: Object,
    default: () => {
    }
  },
  tasks: {
    type: Array,
    default: () => []
  },
  rules: {
    type: Object,
    default: () => {
    }
  },
  allowEdit: {
    type: Boolean,
    default: false
  }
});

const ruleFormRef = ref(null);
defineExpose({
  ruleFormRef,
});

const emit = defineEmits(["update-dependency"]);
const dependencyOptions = ref({id: "index", value: "workName"});
const listSelectedTasks = ref(props.tasks.filter(task =>
    Object.keys(props.selectedRow.itemRelations || {}).includes(String(task.index))
) || []);
const selectedValue = ref(null);
const listSelectTasks = computed(() => {
  const selectedRelationKeys = Object.keys(props.selectedRow?.itemRelations || {});
  return props.tasks.filter(item => {
    let itemRelationKeys = Object.keys(item?.itemRelations || {});
    return item.index !== props.selectedRow.index &&
        item.index !== props.selectedRow.parentIndex &&
        !selectedRelationKeys.includes(item.index) &&
        !itemRelationKeys.includes(props.selectedRow.index)
  });
});

const handleSelectTask = (selectedIndex) => {
  let task = props.tasks.find(task => task.index === selectedIndex);
  selectedValue.value = selectedIndex;
  if (task) {
    // Ensure selectRow and itemRelations exist
    if (!props.selectedRow.itemRelations) {
      props.selectedRow.itemRelations = {};
    }

    props.selectedRow.itemRelations[task.index] = "";

    listSelectedTasks.value.push(task);
  }
};

const handleRemoveTask = (removeIndex) => {
  selectedValue.value = null;
  delete props.selectedRow.itemRelations[removeIndex];
  listSelectedTasks.value = listSelectedTasks.value.filter(task => task.index !== removeIndex);
};

</script>

<style scoped>
/* Custom styling */
</style>
