import {defineStore} from "pinia";
import {reactive} from "vue";
import {mixinMethods} from "@/utils/variables";
import services from "@/plugins/services";
import {useI18n} from "vue-i18n";
import {usePersistenceStore} from "@/store/persistence.js";

export const useProgressStore = defineStore(
  "progress",
  () => {
    const {t} = useI18n();
    const persist = usePersistenceStore();
    const { projectId } = persist;
    const validation = reactive({value: {}});
    const progressDetails = reactive({
      value: {}
    });
    const selectedProgressItem = reactive({
      value: {
        progressId: 0,
        workCode: "",
        index: "",
        parentIndex: "",
        workName: "",
        unit: "",
        quantity: 0,
        unitPrice: 0,
        totalPrice: 0,
        progress: 0,
        status: 0,
        planStartDate: "",
        planEndDate: "",
        actualStartDate: "",
        actualEndDate: "",
        usedQuantity: 0,
        itemRelations: {}
      },
    })
    const getProgressDetails = async (projectId, isLoading) => {
      if(isLoading) mixinMethods.startLoading();
      await services.ProgressAPI.details(
        projectId,
        {},
        (response) => {
          progressDetails.value = response.data;
          progressDetails.value.progressItems = convertProgressToTasks(progressDetails.value.progressItems);
          mixinMethods.endLoading();
        },
        (error) => {
          mixinMethods.notifyError(t("response.message.get_progress_dtls_failed"));
          mixinMethods.endLoading();
        }
      );
    }

    const convertProgressToTasks = (progressItems) => {
      // First, map indexes to items for quick lookup
      const indexMap = new Map();
      progressItems.forEach(item => {
        indexMap.set(item.index, item);
      });

      // Clear existing predecessor values first
      progressItems.forEach(item => {
        item.predecessor = "";
      });

      // Set parentId based on parentIndex
      progressItems.forEach(item => {
        if (item.parentIndex) {
          const parentItem = indexMap.get(item.parentIndex);
          item.parentId = parentItem ? parentItem.id : null;
        } else {
          item.parentId = null;
        }
      });

      progressItems.forEach((item) => {
        if (item.itemRelations) {
          Object.entries(item.itemRelations).forEach(([relatedIndex, relation]) => {
            const relatedTask = indexMap.get(relatedIndex);
            if (relatedTask) {
              const newRelation = `${item.id.toString().trim()}${relation.toString().trim()}`;
              if (!relatedTask.predecessor) {
                relatedTask.predecessor = newRelation;
              } else {
                const existing = new Set(relatedTask.predecessor.split(','));
                if (!existing.has(newRelation)) {
                  relatedTask.predecessor += `,${newRelation}`;
                }
              }
            }
          });
        }
      });

      return progressItems;
    };

    const saveProgressItem = async (params) => {
      mixinMethods.startLoading();
      await services.ProgressAPI.saveItem(
        params,
        (response) => {
          getProgressDetails(projectId.value);
          validation.value = [];
          mixinMethods.notifySuccess(t("response.message.save_progress_item_success"));
          mixinMethods.endLoading();
        },
        (error) => {
          validation.value = mixinMethods.handleErrorResponse(error.responseCode);
          mixinMethods.notifyError(t("response.message.save_progress_item_failed"));
          mixinMethods.endLoading();
        }
      );
    };

    const updateItem = async (params) => {
      mixinMethods.startLoading();
      await services.ProgressAPI.updateItem(
        params,
        (response) => {
          getProgressDetails(projectId.value);
          clearSelectedProgressItem();
          validation.value = [];
          mixinMethods.notifySuccess(t("response.message.save_progress_item_success"));
          mixinMethods.endLoading();
        },
        (error) => {
          validation.value = mixinMethods.handleErrorResponse(error.responseCode);
          mixinMethods.notifyError(t("response.message.save_progress_item_failed"));
          mixinMethods.endLoading();
        }
      );
    };

    const clearSelectedProgressItem = () => {
      selectedProgressItem.value = {
        progressId: 0,
        workCode: "",
        index: "",
        parentIndex: "",
        workName: "",
        unit: "",
        quantity: 0,
        unitPrice: 0,
        totalPrice: 0,
        progress: 0,
        status: 0,
        planStartDate: "",
        planEndDate: "",
        actualStartDate: "",
        actualEndDate: "",
        usedQuantity: 0,
        itemRelations: {}
      }
    }

    return {
      validation,
      progressDetails,
      selectedProgressItem,
      updateItem,
      saveProgressItem,
      getProgressDetails,
      convertProgressToTasks,
      clearSelectedProgressItem
    };
  }
);