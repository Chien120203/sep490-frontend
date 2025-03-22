<template>
  <el-card class="construction-log-details">
    <SingleOptionSelect
        class="select-item"
        :optionKeys="{ id: 'TaskID', value: 'TaskName' }"
        :listData="tasks"
        :isRemote="true"
        :placeholder="'Chọn công việc'"
        @handleSelectedParams="handleSelectItem"
        @remoteSearch="handleSearch"
    />
    <div v-for="task in selectedTasks" :key="task.TaskID">
      <el-collapse v-model="activeCollapseItems">
        <div class="el-collapse-item-header">
          <div class="el-collapse-item-header-title">
            <h3>{{task.TaskName}}</h3>
          </div>
          <div class="el-collapse-item-header-icon">
            <IconCircleClose class="close-icon" :width="15" :height="15" @click="handleDeleteLog(task.TaskID)"/>
          </div>
        </div>
        <div>
          <el-form label-position="top" class="progress-details">
            <el-form-item label="Khu vực thi công">
              <el-input v-model="area" placeholder="Nhập khu vực thi công" />
            </el-form-item>

            <el-form-item label="Khối lượng kế hoạch">
              <el-input v-model="plannedVolume" disabled />
            </el-form-item>

            <el-form-item label="Khối lượng thi công">
              <el-input v-model="constructionVolume" type="number" @input="updateRemaining" />
            </el-form-item>

            <el-form-item label="Tích lũy">
              <el-input v-model="accumulated" disabled />
            </el-form-item>

            <el-form-item label="Còn lại">
              <el-input v-model="remaining" disabled />
            </el-form-item>

            <el-form-item label="Đơn vị">
              <el-input v-model="unit" />
            </el-form-item>
          </el-form>
        </div>
        <!--      Meterial-->
        <el-collapse-item name="1">
          <template #title>
            <h3>Vat Lieu</h3>
          </template>
          <ListItems
              :listData="mockDataMaterials"
              :optionKeys="materialOptionKeys"
              :isExport="true"
          />
        </el-collapse-item>
        <!--      Employee-->
        <el-collapse-item name="2">
          <template #title>
            <h3>Nhan Cong</h3>
          </template>
          <ListItems
              :listData="mockDataMaterials"
              :optionKeys="userOptionKeys"
              :isExport="false"
          />
        </el-collapse-item>
        <!--      Vehicle-->
        <el-collapse-item name="3">
          <template #title>
            <h3>Phuong Tien</h3>
          </template>
          <ListItems
              :listData="mockDataVehicles"
              :optionKeys="vehicleOptionKeys"
              :isExport="false"
          />
        </el-collapse-item>
      </el-collapse>
    </div>
  </el-card>
</template>

<script setup>
import {ref} from 'vue';
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import ListItems from "@/pages/construction-log/items/details/ListItems.vue";
import IconCircleClose from "@/svg/IconCircleClose.vue";

const activeCollapseItems = ref(["1", "2", "3"]);
const selectedTasks = ref([]);
const tasks = ref([
  {
    TaskID: 1,
    TaskName: "Planning",
    StartDate: new Date("02/03/2017"),
    EndDate: new Date("02/07/2017"),
    BaselineStartDate: new Date("02/02/2017"),
    BaselineEndDate: new Date("02/06/2017"),
    Progress: 100,
    Duration: 5,
    subtasks: [
      {
        TaskID: 2,
        TaskName: "Plan timeline",
        StartDate: new Date("02/03/2017"),
        EndDate: new Date("02/07/2017"),
        BaselineStartDate: new Date("02/02/2017"),
        BaselineEndDate: new Date("02/06/2017"),
        Duration: 5,
        Progress: 100
      },
      {
        TaskID: 3,
        TaskName: "Plan budget",
        StartDate: new Date("02/03/2017"),
        EndDate: new Date("02/07/2017"),
        BaselineStartDate: new Date("02/02/2017"),
        BaselineEndDate: new Date("02/06/2017"),
        Duration: 5,
        Progress: 100,
        Predecessor: "2SS"
      },
      {
        TaskID: 4,
        TaskName: "Allocate resources",
        StartDate: new Date("02/03/2017"),
        EndDate: new Date("02/07/2017"),
        BaselineStartDate: new Date("02/02/2017"),
        BaselineEndDate: new Date("02/06/2017"),
        Duration: 5,
        Progress: 100,
        Predecessor: "3SS"
      },
      {
        TaskID: 5,
        TaskName: "Planning complete",
        StartDate: new Date("02/07/2017"),
        EndDate: new Date("02/07/2017"),
        BaselineStartDate: new Date("02/06/2017"),
        BaselineEndDate: new Date("02/06/2017"),
        Duration: 0,
        Progress: 0,
        Predecessor: "4FS"
      }
    ]
  },
  {
    TaskID: 6,
    TaskName: "Design",
    StartDate: new Date("02/10/2017"),
    EndDate: new Date("02/14/2017"),
    BaselineStartDate: new Date("02/09/2017"),
    BaselineEndDate: new Date("02/13/2017"),
    Duration: 3,
    Progress: 86,
    subtasks: [
      {
        TaskID: 7,
        TaskName: "Software Specification",
        StartDate: new Date("02/10/2017"),
        EndDate: new Date("02/12/2017"),
        BaselineStartDate: new Date("02/09/2017"),
        BaselineEndDate: new Date("02/11/2017"),
        Duration: 3,
        Progress: 60
      },
      {
        TaskID: 8,
        TaskName: "Develop prototype",
        StartDate: new Date("02/10/2017"),
        EndDate: new Date("02/12/2017"),
        BaselineStartDate: new Date("02/09/2017"),
        BaselineEndDate: new Date("02/11/2017"),
        Duration: 3,
        Progress: 100,
        Predecessor: "7SS"
      },
      {
        TaskID: 9,
        TaskName: "Get approval from customer",
        StartDate: new Date("02/13/2017"),
        EndDate: new Date("02/14/2017"),
        BaselineStartDate: new Date("02/12/2017"),
        BaselineEndDate: new Date("02/13/2017"),
        Duration: 2,
        Progress: 100,
        Predecessor: "8FS"
      },
      {
        TaskID: 10,
        TaskName: "Design Documentation",
        StartDate: new Date("02/13/2017"),
        EndDate: new Date("02/14/2017"),
        BaselineStartDate: new Date("02/12/2017"),
        BaselineEndDate: new Date("02/13/2017"),
        Duration: 2,
        Progress: 100,
        Predecessor: "9SS"
      },
      {
        TaskID: 11,
        TaskName: "Design complete",
        StartDate: new Date("02/14/2017"),
        EndDate: new Date("02/14/2017"),
        BaselineStartDate: new Date("02/13/2017"),
        BaselineEndDate: new Date("02/13/2017"),
        Duration: 0,
        Progress: 0,
        Predecessor: "10FS"
      }
    ]
  },
  {
    TaskID: 12,
    TaskName: "Development",
    StartDate: new Date("02/15/2017"),
    EndDate: new Date("03/01/2017"),
    Duration: 10,
    Progress: 50,
    subtasks: [
      {
        TaskID: 13,
        TaskName: "Backend Development",
        StartDate: new Date("02/15/2017"),
        EndDate: new Date("02/24/2017"),
        Duration: 7,
        Progress: 70
      },
      {
        TaskID: 14,
        TaskName: "Frontend Development",
        StartDate: new Date("02/16/2017"),
        EndDate: new Date("02/25/2017"),
        Duration: 7,
        Progress: 60,
        Predecessor: "13FS"
      },
      {
        TaskID: 15,
        TaskName: "Integration",
        StartDate: new Date("02/26/2017"),
        EndDate: new Date("03/01/2017"),
        Duration: 4,
        Progress: 30,
        Predecessor: "14FS"
      }
    ]
  },
  {
    TaskID: 16,
    TaskName: "Testing",
    StartDate: new Date("03/02/2017"),
    EndDate: new Date("03/10/2017"),
    Duration: 7,
    Progress: 20,
    subtasks: [
      {
        TaskID: 17,
        TaskName: "Unit Testing",
        StartDate: new Date("03/02/2017"),
        EndDate: new Date("03/05/2017"),
        Duration: 3,
        Progress: 40
      },
      {
        TaskID: 18,
        TaskName: "Integration Testing",
        StartDate: new Date("03/06/2017"),
        EndDate: new Date("03/08/2017"),
        Duration: 3,
        Progress: 30,
        Predecessor: "17FS"
      },
      {
        TaskID: 19,
        TaskName: "User Acceptance Testing",
        StartDate: new Date("03/09/2017"),
        EndDate: new Date("03/10/2017"),
        Duration: 2,
        Progress: 10,
        Predecessor: "18FS"
      }
    ]
  }
]);
//mock data
const mockDataMaterials = [
  { id: "1", value: "Item A" },
  { id: "2", value: "Item B" },
  { id: "3", value: "Item C" },
];
const mockDataEmployees = [
  { id: "E001", value: "John Doe" },
  { id: "E002", value: "Jane Smith" },
  { id: "E003", value: "Michael Johnson" },
];
const mockDataVehicles = [
  { id: "V001", value: "Vehicle 1" },
  { id: "V002", value: "Vehicle 2" },
  { id: "V003", value: "Vehicle 3" },
];
const area = ref("");
const plannedVolume = ref(61.17);
const constructionVolume = ref(3);
const accumulated = ref(15);
const remaining = ref(46.17);
const unit = ref("m3");
const materialOptionKeys = ref({id: 'id', value:'value'});
const userOptionKeys = ref({id: 'id', value:'value'});
const vehicleOptionKeys = ref({id: 'id', value:'value'});

const handleSelectItem = (id) => {
  let selectedTask = tasks.value.find(task => task.TaskID === id);
  selectedTasks.value.push(selectedTask);
}

const handleDeleteLog = (id) => {
  selectedTasks.value = selectedTasks.value.filter((item) => item.TaskID !== id);
}

const handleSearch = (value) => {

}
</script>

<style scoped>
.construction-log-details {
  padding: 20px;
}
.close-icon {
  cursor: pointer;
}
.el-collapse-item-header{
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
.progress-details{
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  align-items: center;
}
</style>