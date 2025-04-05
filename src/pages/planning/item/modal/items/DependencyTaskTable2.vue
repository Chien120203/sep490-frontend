<template>
  <SingleOptionSelect
      style="width: 30%"
      class="select-item"
      :optionKeys="dependencyOptions"
      :listData="tasks.filter(item => item.index !== selectedRow.index && item.index !== selectedRow.parentIndex)"
      @handleSelectedParams="handleSelectTask"
  />

  <el-form
      ref="ruleFormRef"
      :model="formModel"
      :rules="rules"
      class="form-search-box"
  >
    <el-table :data="formModel.selectRows" style="width: 100%" border stripe>
      <el-table-column label="Index">
        <template #default="{ row }">
          {{ row.index }}
        </template>
      </el-table-column>

      <el-table-column label="Task Name" sortable>
        <template #default="{ row }">
          {{ getRowInfor(row.index, 'workName') }}
        </template>
      </el-table-column>

      <el-table-column label="Start Date" sortable>
        <template #default="{ row }">
          {{ mixinMethods.showDateTime(getRowInfor(row.index, 'startDate')) }}
        </template>
      </el-table-column>

      <el-table-column label="Due Date" sortable>
        <template #default="{ row }">
          {{ mixinMethods.showDateTime(getRowInfor(row.index, 'endDate')) }}
        </template>
      </el-table-column>

      <el-table-column label="Depends Type">
        <template #default="{ row, $index }">
          <el-form-item
              :prop="`selectRows.${row.index}.dependency`"
              :rules="rules.dependency"
          >
            <el-select
                v-model="formModel.selectRows[$index].dependency"
                @change="handleChangeDependency"
                placeholder="Select dependency"
            >
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

      <el-table-column label="Actions" width="60">
        <template #default="{ row }">
          <button @click="handleRemoveTask(row.index)" class="btn-edit">
            <IconTrash />
          </button>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
</template>

<script setup>
import { reactive, ref } from "vue";
import { TASK_RELATIONSHIPS } from "@/constants/project.js";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import IconTrash from "@/svg/IconTrash.vue";
import { mixinMethods } from "@/utils/variables.js";

// Props
const props = defineProps({
  selectedRow: { type: Object, default: () => ({}) },
  tasks: { type: Array, default: () => [] },
  rules: { type: Object, default: () => ({}) }
});

const emit = defineEmits(["update-dependency"]);

// Form reference
const ruleFormRef = ref(null);
defineExpose({ ruleFormRef });

// Dependency select config
const dependencyOptions = ref({ id: "index", value: "workName" });

// selectRows inside formModel for validation tracking
const selectRows = ref(
    Object.entries(props.selectedRow.itemRelations || {}).map(([index, dependency]) => ({
      index: Number(index),
      dependency
    }))
);

// Make model reactive
const formModel = reactive({
  selectRows
});

// Helpers
const getRowInfor = (index, field) => {
  const task = props.tasks.find(task => task.index === index);
  return task?.[field] ?? "";
};

const handleSelectTask = (selectedIndex) => {
  const exists = formModel.selectRows.some(row => row.index === selectedIndex);
  if (!exists) {
    formModel.selectRows.push({ index: selectedIndex, dependency: "" });
  }
};

const handleRemoveTask = (removeIndex) => {
  formModel.selectRows = formModel.selectRows.filter(row => row.index !== removeIndex);
  emit("update-dependency", getItemRelations());
};

const handleChangeDependency = () => {
  emit("update-dependency", getItemRelations());
};

const getItemRelations = () => {
  const result = {};
  formModel.selectRows.forEach(row => {
    result[row.index] = row.dependency;
  });
  return result;
};
</script>

<style scoped>
.select-item {
  margin-bottom: 20px;
}
.btn-edit {
  background: none;
  border: none;
  cursor: pointer;
}
</style>
