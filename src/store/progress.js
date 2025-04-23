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