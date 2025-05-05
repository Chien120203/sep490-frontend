<!-- GanttChart.vue -->
<script setup>
import {computed, defineEmits, defineProps, ref, watch} from 'vue';
import {provide} from "vue";
import {GanttComponent, ColumnsDirective, ColumnDirective, Toolbar, Filter, Selection, CriticalPath} from "@syncfusion/ej2-vue-gantt";
import {EXECUTIVE_BOARD, TECHNICAL_MANAGER} from "@/constants/roles.js";
import {
  CANCELED,
  COMPLETED,
  IN_PROGRESS,
  INSPECT_FAILED,
  PAUSED,
  STATUS_NOT_START,
  WAIT_FOR_INSPECT
} from "@/constants/progress.js";

// Accept dataset from the parent component
const props = defineProps({
  tasks: Array
});
const gantt = ref(null);
watch(
    () => props.tasks,
    (newVal) => {
      // if (newVal && newVal.length > 0) {
      //   if (gantt.value?.ej2Instances && gantt.value?.ej2Instances.dataSource) {
      //     let ganttObj = gantt.value.ej2Instances;
      //     ganttObj.hideSpinner();
      //     ganttObj.dataSource = newVal;
      //     ganttObj.refresh();
      //   }
      // }
    },
    {immediate: true, deep: true} // `immediate` handles initial assignment; `deep` tracks nested changes
);
const handleRefresh = () => {
  let ganttObj = gantt.value.ej2Instances;
  ganttObj.hideSpinner();
  ganttObj.dataSource = props.tasks;
  ganttObj.refresh();
}
const emit = defineEmits(["handleSelectRow", "addTask", "addAllocation"]);

const handleAddNewTask = () => {
  emit("addTask");
}
const handleAddNewAllocation = () => {
  emit("addAllocation");
}

// Configure task mappings
const taskSettings = ref({
  id: "id",
  name: "workName",
  startDate: "actualStartDate",
  endDate: "actualEndDate",
  progress: "progress",
  parentID: "parentId",
  dependency: "predecessor",
  baselineStartDate: "planStartDate",
  baselineEndDate: "planEndDate"
});
const currentRole = computed(() => localStorage.getItem("role"));
const labelSettings = {
  taskLabel: '${progress}%'
};

const queryTaskbarInfo = (args) => {
  // Set progress bar color based on task status
  switch (args.data.taskData.status) {
    case STATUS_NOT_START: // 0
      args.progressBarBgColor = "#808080"; // Gray
      args.taskbarBgColor = "#A9A9A9"; // Darker Gray
      break;
    case IN_PROGRESS: // 1
      args.progressBarBgColor = "#1E90FF"; // DodgerBlue
      args.taskbarBgColor = "#87CEFA"; // LightSkyBlue (lighter)
      break;
    case COMPLETED: // 2
      args.progressBarBgColor = "#32CD32"; // LimeGreen
      args.taskbarBgColor = "#90EE90"; // LightGreen (lighter)
      break;
    case PAUSED: // 3
      args.progressBarBgColor = "#FFA500"; // Orange
      args.taskbarBgColor = "#FFD700"; // Gold (lighter)
      break;
    case CANCELED: // 4
      args.progressBarBgColor = "#FF0000"; // Red
      args.taskbarBgColor = "#FFA07A"; // LightSalmon (lighter)
      break;
    case WAIT_FOR_INSPECT: // 5
      args.progressBarBgColor = "#9370DB"; // MediumPurple
      args.taskbarBgColor = "#B19CD9"; // Light Purple (lighter)
      break;
    case INSPECT_FAILED: // 6
      args.progressBarBgColor = "#FF6347"; // Tomato
      args.taskbarBgColor = "#FFA07A"; // LightSalmon (lighter)
      break;
    default:
      args.progressBarBgColor = "#808080"; // Default gray
      args.taskbarBgColor = "#A9A9A9"; // Default darker gray
  }
}
const taskbarHeight = 40;
const rowHeight = 40;
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

const rowSelected = function (args) {
  let ganttObj = gantt.value.ej2Instances;
  let selectedRecords = ganttObj.selectionModule.getSelectedRecords();  // get the selected records.
  emit("handleSelectRow", selectedRecords);
}
const searchValue = ref('');

const searchSettings = ref({fields: ['workName'], operator: 'contains', key: searchValue.value, ignoreCase: true});

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

const change = (isOpen) => {
  let ganttObj = gantt.value.ej2Instances;
  let collapse = isOpen ? '100%' : '50%';
  ganttObj.setSplitterPosition(collapse, 'position');
  isCollapse.value = !isOpen;
}

provide('gantt', [Toolbar, Filter, Selection, CriticalPath]);
</script>

<template>
  <div class="gantt-chart-container">
    <h2 class="text-lg font-bold mb-4">{{ $t('progress.title') }}</h2>
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
          </el-button>
          <el-button class="btn btn-clear" @click="handleRefresh">
            {{ $t("common.refresh") }}
          </el-button>
        </div>
      </div>
      <div class="col-md-3 col-lg-3 d-flex btn-cr">
        <el-button class="btn btn-save" @click="change(isCollapse)"
        >{{$t('progress.hide_gantt_chart')}}
        </el-button>
        <el-button v-if="currentRole === TECHNICAL_MANAGER || currentRole === EXECUTIVE_BOARD" @click="handleAddNewTask" class="btn btn-save">
          {{ $t('common.add_new') }}
        </el-button>
      </div>
    </div>
    <div style="padding-top: 70px">
      <GanttComponent
          ref='gantt'
          :dataSource="tasks"
          :taskFields="taskSettings"
          :labelSettings="labelSettings"
          :height="'100%'"
          :width="'100%'"
          :taskbarHeight="taskbarHeight"
          :rowHeight="rowHeight"
          :queryTaskbarInfo="queryTaskbarInfo"
          :timelineSettings="timelineSettings"
          :enableCriticalPath="true"
          :selectionSettings="selectionOptions"
          :renderBaseline="true"
          :allowFiltering='true'
          :baselineColor="'#ffd180'"
          :toolbar="toolbar"
          :searchSettings="searchSettings"
          :rowSelected="rowSelected"
      >
        <ColumnsDirective>
          <ColumnDirective field="index" :headerText="$t('progress.columns.index')" width="60"></ColumnDirective>
          <ColumnDirective field="workName" :headerText="$t('progress.columns.task')" width="200"></ColumnDirective>
          <ColumnDirective field="predecessor" :headerText="$t('progress.columns.dependency')" width="120"></ColumnDirective>
          <ColumnDirective field="planStartDate" format="yyyy-MM-dd" :headerText="$t('progress.columns.plan_start_date')"
                           width="120"></ColumnDirective>
          <ColumnDirective field="planEndDate" format="yyyy-MM-dd" :headerText="$t('progress.columns.plan_end_date')"
                           width="120"></ColumnDirective>
          <ColumnDirective field="progress" :headerText="$t('progress.columns.progress')" width="100"></ColumnDirective>
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
