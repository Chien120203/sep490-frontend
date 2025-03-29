<!-- GanttChart.vue -->
<script setup>
import {defineEmits, defineProps, ref} from 'vue';
import {provide} from "vue";
import {GanttComponent, ColumnsDirective, ColumnDirective, Toolbar, Filter, Selection} from "@syncfusion/ej2-vue-gantt";

// Accept dataset from the parent component
const props = defineProps({
  tasks: Array
});

const emit = defineEmits(["handleSelectRow", "addTask", "addAllocation"]);

const handleAddNewTask = () => {
  emit("addTask");
}
const handleAddNewAllocation = () => {
  emit("addAllocation");
}

const gantt = ref(null);
// Configure task mappings
const taskSettings = ref({
  id: "TaskID",
  name: "TaskName",
  startDate: "StartDate",
  endDate: "EndDate",
  duration: "Duration",
  progress: "Progress",
  child: "subtasks",
  dependency: "Predecessor",
  baselineStartDate: "BaselineStartDate",
  baselineEndDate: "BaselineEndDate"
});

const labelSettings = {
  taskLabel: '${Progress}%'
};

const toolbar = [
  'Add',
  'Edit',
  'Delete',
  'Cancel',
  'ExpandAll',
  'CollapseAll',
  'PrevTimeSpan',
  'NextTimeSpan',
  'ZoomIn',
  'ZoomOut',
  'ZoomToFit'
];

const selectionOptions = {
  type: "Single"
}

const rowSelected = function(args) {
  let ganttObj = gantt.value.ej2Instances;
  let selectedRecords = ganttObj.selectionModule.getSelectedRecords();  // get the selected records.
  emit("handleSelectRow", selectedRecords);
}
const searchValue = ref('');

const searchSettings = ref({fields: ['TaskName'], operator: 'contains', key: searchValue.value, ignoreCase: true});

// Reactive timeline settings
const timelineSettings = ref({
  timelineViewMode: "Week"
});

const isCollapse = ref(true);

const handleSearch = (isClear = false) => {
  let ganttObj = gantt.value.ej2Instances;
  searchValue.value = isClear ? '' : searchValue.value;
  ganttObj.search(searchValue.value);
}

const handleCreateCR = () => {

}

const change = (isOpen) => {
  let ganttObj = gantt.value.ej2Instances;
  let collapse = isOpen ? '100%' : '50%';
  ganttObj.setSplitterPosition(collapse, 'position');
  isCollapse.value = !isOpen;
}

provide('gantt', [Toolbar, Filter, Selection]);
</script>

<template>
  <div class="gantt-chart-container">
    <h2 class="text-lg font-bold mb-4">Gantt Chart - Danh sách công việc</h2>
    <div class="project-search">
      <div class="col-md-9 col-lg-9">
        <div class="project-search-box col-md-9 col-lg-9">
          <div class="mb-0 ruleform">
            <el-input
                :placeholder="$t('common.input_keyword')"
                @keyup.enter="handleSearch"
                v-model="searchValue"
                prop="searchValue"
            >
            </el-input>
          </div>
        </div>
        <div class="btn-search-select col-md-3 col-lg-3 project-box-btn-all">
          <el-button class="btn btn-search" @click="handleSearch()">
            {{ $t("common.search") }}
          </el-button
          >
          <el-button class="btn btn-clear" @click="handleSearch(true)">
            {{ $t("common.clear") }}
          </el-button
          >
        </div>
      </div>
      <div class="col-md-3 col-lg-3 d-flex btn-cr">
        <el-button class="btn btn-save" @click="change(isCollapse)"
        >Ẩn Gantt Chart
        </el-button>
        <el-dropdown>
          <el-button class="btn btn-save">
            Add New CR<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleAddNewTask">Add New Task</el-dropdown-item>
              <el-dropdown-item @click="handleAddNewAllocation">Add New ALlocation</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div style="padding-top: 70px">
      <GanttComponent
          ref='gantt'
          :dataSource="props.tasks"
          :taskFields="taskSettings"
          :labelSettings="labelSettings"
          :height="'100%'"
          :width="'100%'"
          :timelineSettings="timelineSettings"
          :selectionSettings="selectionOptions"
          :renderBaseline="true"
          :allowFiltering='true'
          :baselineColor="'#ffd180'"
          :toolbar="toolbar"
          :searchSettings="searchSettings"
          :rowSelected="rowSelected"
      >
        <ColumnsDirective>
          <ColumnDirective field="TaskID" headerText="STT" width="60"></ColumnDirective>
          <ColumnDirective field="TaskName" headerText="Công việc" width="200"></ColumnDirective>
          <ColumnDirective field="StartDate" headerText="Ngày bắt đầu" width="120"></ColumnDirective>
          <ColumnDirective field="EndDate" headerText="Ngày kết thúc" width="120"></ColumnDirective>
          <ColumnDirective field="BaselineStartDate" headerText="Thời gian bắt đầu dự kiến" width="120"></ColumnDirective>
          <ColumnDirective field="BaselineEndDate" headerText="Thời gian kết thúc dự kiến" width="120"></ColumnDirective>
          <ColumnDirective field="Duration" headerText="Thời lượng" width="100"></ColumnDirective>
          <ColumnDirective field="Progress" headerText="Tiến độ (%)" width="100"></ColumnDirective>
        </ColumnsDirective>
      </GanttComponent>
    </div>
  </div>
</template>

<style scoped>

h2 {
  text-align: center;
  margin-bottom: 20px;
}
.project-search {
  width: 100%;
}
.btn-cr {
  justify-content: end;
}
.gantt-chart-container {
}
</style>
