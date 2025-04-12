import {defineStore} from "pinia";
import {reactive} from "vue";
import {mixinMethods} from "@/utils/variables";
import services from "@/plugins/services";
import {useI18n} from "vue-i18n";

export const useProgressStore = defineStore(
  "progress",
  () => {
    const {t} = useI18n();
    const validation = reactive({value: {}});
    const progressDetails = reactive({
      value: {}
    });

    const getProgressDetails = () => {
      let data = {
        id: 20,
        projectId: 5,
        planId: 20,
        progressItems: [
          {
            id: 1,
            workCode: "EW05-016",
            index: "1",
            parentIndex: null,
            workName: "Work 1",
            unit: "m2",
            quantity: 10,
            unitPrice: 222,
            totalPrice: 2220,
            progress: 20,
            status: 1,
            planStartDate: "2025-04-09T17:00:00",
            planEndDate: "2025-04-17T17:00:00",
            actualStartDate: "2025-04-09T17:00:00",
            actualEndDate: "2025-04-17T17:00:00",
            itemRelations: {
              "2": "FS"
            },
            details: [],
            teams: []
          },
          {
            id: 2,
            workCode: "EW05-1-002",
            index: "1.1",
            parentIndex: "1",
            workName: "Work 1.1",
            unit: "m2",
            progress: 20,
            quantity: 22,
            status: 1,
            unitPrice: 333,
            totalPrice: 7326,
            planStartDate: "2025-04-15T17:00:00",
            planEndDate: "2025-04-17T17:00:00",
            actualStartDate: "2025-04-15T17:00:00",
            actualEndDate: "2025-04-17T17:00:00",
            itemRelations: {
              "2": "FS"
            },
            details: [],
            teams: []
          },
          {
            id: 3,
            workCode: "EW05-017",
            index: "2",
            parentIndex: null,
            workName: "Work 2",
            unit: "m2",
            progress: 20,
            status: 1,
            quantity: 12,
            unitPrice: 1231,
            totalPrice: 14772,
            planStartDate: "2025-04-17T17:00:00",
            planEndDate: "2025-04-25T17:00:00",
            actualStartDate: "2025-04-17T17:00:00",
            actualEndDate: "2025-04-25T17:00:00",
            itemRelations: {},
            details: [],
            teams: []
          },
        ]
      };
      data.progressItems = convertProgressToTasks(data.progressItems);
      progressDetails.value = data;
    }

    const convertProgressToTasks = (progressItems) => {
      progressItems.forEach((item) => {
        if (item.itemRelations) {
          Object.entries(item.itemRelations).forEach(([relatedIndex, relation]) => {
            const relatedTask = progressItems.find(t => t.index === relatedIndex);
            if (relatedTask) {
              const newRelation = `${item.index.toString().trim()}${relation.toString().trim()}`;
              if (!relatedTask.predecessor) {
                relatedTask.predecessor = newRelation;
              } else {
                relatedTask.predecessor += `,${newRelation}`;
              }
            }
          });
        }
      });

      return progressItems;
    };

    return {
      validation,
      progressDetails,
      getProgressDetails,
      convertProgressToTasks
    };
  }
);