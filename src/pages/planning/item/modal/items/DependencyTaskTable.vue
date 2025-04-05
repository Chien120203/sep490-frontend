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
      :model="selectRow"
      :rules="rules"
      class="form-search-box"
  >
    <el-table :data="listSelectedTasks" style="width: 100%" border stripe>
      <el-table-column label="Index">
        <template #default="{ row }">
          {{ row.index }}
        </template>
      </el-table-column>
      <!-- Task Name -->
      <el-table-column prop="workName" label="Task Name" sortable />

      <!-- Due Date -->
      <el-table-column label="Start Date" sortable>
        <template #default="{ row }">
          {{ mixinMethods.showDateTime(row.startDate) }}
        </template>
      </el-table-column>
      <!-- Due Date -->
      <el-table-column label="Due Date" sortable>
        <template #default="{ row }">
          {{ mixinMethods.showDateTime(row.endDate) }}
        </template>
      </el-table-column>

      <!-- Dependency -->
      <el-table-column label="Depends Type" width="390">
        <template #default="{ row }">
          <el-form-item :prop="`itemRelations.${row.index}`" :rules="rules.dependency">
            <el-select v-model="selectRow.itemRelations[row.index]" @change="handleChangeDependency">
              <el-option :label="$t('common.no_dependency')" value=""></el-option>
              <el-option
                  v-for="(type, index) in TASK_RELATIONSHIPS"
                  :key="index"
                  :label="$t(type.label)"
                  :value="type.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>


      <el-table-column label="Actions" width="100">
        <template #default="{ row }">
          <div>
            <button @click="handleRemoveTask(row.index)" class="btn-edit">
              <IconTrash />
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
import {reactive, ref} from "vue";
import {mixinMethods} from "@/utils/variables.js";

const props = defineProps({
  selectedRow: {
    type: Object,
    default: () => {}
  },
  tasks: {
    type: Array,
    default: () => []
  },
  rules: {
    type: Object,
    default: () => {
    }
  }
});

const ruleFormRef = ref(null);
defineExpose({
  ruleFormRef,
});

const emit = defineEmits(["update-dependency"]);
const dependencyOptions = ref({id: "index", value: "workName"});
const selectRow = reactive({
  ...props.selectedRow,
  itemRelations: props.selectedRow.itemRelations ? { ...props.selectedRow.itemRelations } : {}
});
const listSelectedTasks = ref( props.tasks.filter(task =>
    Object.keys(props.selectedRow.itemRelations || {}).includes(String(task.index))
) || []);

const handleSelectTask = (selectedIndex) => {
  let task = props.tasks.find(task => task.index === selectedIndex);

  if (task) {
    // Ensure selectRow and itemRelations exist
    if (!selectRow.itemRelations) {
      selectRow.itemRelations = {};
    }

    // Insert new relation
    selectRow.itemRelations[task.index] = "";

    listSelectedTasks.value.push(task);
  }
};

const handleRemoveTask = (removeIndex) => {
  delete selectRow.itemRelations[removeIndex];
  listSelectedTasks.value = listSelectedTasks.value.filter(task => task.index !== removeIndex);
  emit("update-dependency", selectRow);
};

const handleChangeDependency = () => {
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      emit("update-dependency", selectRow);
    }
    console.log(valid)
  });
}

</script>

<style scoped>
/* Custom styling */
</style>
