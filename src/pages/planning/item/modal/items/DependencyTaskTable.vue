<template>
  <SingleOptionSelect
      style="width: 30%"
      class="select-item"
      :optionKeys="dependencyOptions"
      :listData="tasks.filter(item => item.index !== selectedRow.index && item.index !== selectedRow.parentIndex)"
      @handleSelectedParams="handleSelectTask"
  />
  <el-table :data="listSelectedTasks" style="width: 100%" border stripe>
    <el-table-column prop="index" label="Index">
      <template #default="{ row }">
        {{ row.index }}
      </template>
    </el-table-column>
    <!-- Task Name -->
    <el-table-column prop="workName" label="Task Name" sortable />

    <!-- Due Date -->
    <el-table-column prop="startDate" label="Start Date" sortable>
      <template #default="{ row }">
        {{ formatDate(row.startDate) }}
      </template>
    </el-table-column>
    <!-- Due Date -->
    <el-table-column prop="endDate" label="Due Date" sortable>
      <template #default="{ row }">
        {{ formatDate(row.endDate) }}
      </template>
    </el-table-column>

    <!-- Dependency -->
    <el-table-column prop="dependency" label="Depends Type">
      <template #default="{ row }">
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
      </template>
    </el-table-column>


    <el-table-column label="Actions">
      <template #default="{ row }">
        <div>
          <button @click="handleRemoveTask(row.index)" class="btn-edit">
            <IconTrash />
          </button>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import {TASK_RELATIONSHIPS} from "@/constants/project.js";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import IconTrash from "@/svg/IconTrash.vue";
import {ref} from "vue";

const props = defineProps({
  selectedRow: {
    type: Object,
    default: () => {}
  },
  tasks: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(["update-dependency"]);
const dependencyOptions = ref({id: "index", value: "workName"});
const selectRow = ref({...props.selectedRow, itemRelations: props.selectedRow.itemRelations || {}} || {});
  const listSelectedTasks = ref( props.tasks.filter(task =>
    Object.keys(props.selectedRow.itemRelations || {}).includes(String(task.index))
) || []);
// Format date
const formatDate = (date) => {
  if(!date) return '';
  return new Date(date).toLocaleDateString();
};

const handleSelectTask = (selectedIndex) => {
  let task = props.tasks.find(task => task.index === selectedIndex);

  if (task) {
    // Ensure itemRelations exists
    selectRow.value.itemRelations = selectRow.value.itemRelations || {};

    // Insert new relation without overwriting existing ones
    selectRow.value.itemRelations[task.index] = "";

    listSelectedTasks.value.push(task);
  }
};

const handleRemoveTask = (removeIndex) => {
  delete selectRow.value.itemRelations[removeIndex];
  listSelectedTasks.value = listSelectedTasks.value.filter(task => task.index !== removeIndex);
  emit("update-dependency", selectRow.value);
};

const handleChangeDependency = () => {
  emit("update-dependency", selectRow.value);
}

</script>

<style scoped>
/* Custom styling */
</style>
