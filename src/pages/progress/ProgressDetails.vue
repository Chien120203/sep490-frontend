<script setup>
import {ref} from 'vue';
import ProgressGanttChart from "@/pages/progress/items/ProgressGanttChart.vue";
import IconBackMain from "@/svg/IconBackMain.vue";
import PAGE_NAME from "@/constants/route-name.js";
import {useRouter} from "vue-router";
import {usePersistenceStore} from "@/store/persistence.js";
import ProgressDetailsModal from "@/pages/progress/items/modal/ProgressDetailsModal.vue"

const router = useRouter();
const persistenceStore = usePersistenceStore();

const {
  projectId
} = persistenceStore;

// mock data
const task2 = ref([
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
const progressItem = ref([]);
const isShowModal = ref(false);
const handleBack = () => {
  router.push({name: PAGE_NAME.PROJECT.DETAILS, params: {id: projectId.value}});
}

const handleEditProgressItem = (item) => {
  isShowModal.value = true;
  progressItem.value = item;
}

const handleAddAllocation = () => {

}

const handleAddTask = () => {

}

const handleCloseModal = () => {
  isShowModal.value = false;
}
</script>

<template>
  <div class="progress-block">
    <div class="progress progress-create progress-detail">
      <div class="progress-header">
        <h3 class="page__ttl">
          <span class="btn-back" @click="handleBack"><IconBackMain/></span>
          {{
            $t('progress.details.title')
          }}
        </h3>
      </div>
      <div>
        <ProgressGanttChart
            :tasks="task2"
            @handleSelectRow="handleEditProgressItem"
            @add-task="handleAddTask"
            @add-allocation="handleAddAllocation"
        />
      </div>
    </div>
    <ProgressDetailsModal
        :progressDetails="progressItem"
        :show="isShowModal"
        @close="handleCloseModal"
    />
  </div>
</template>
