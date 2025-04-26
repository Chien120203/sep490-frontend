import {defineStore} from "pinia";
import {reactive} from "vue";

export const usePersistenceStore = defineStore(
  "persist",
  () => {
    const loggedIn = reactive({ value: false });
    const projectId = reactive({ value: null });
    const projectStatus = reactive({ value: "" });

    return {
      loggedIn,
      projectId,
      projectStatus,
    };
  },
{persist: true}
);
