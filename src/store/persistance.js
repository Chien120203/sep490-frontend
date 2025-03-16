import {defineStore} from "pinia";
import {reactive} from "vue";

export const usePersistanceStore = defineStore(
  "persist",
  () => {
    const loggedIn = reactive({ value: false });
    const projectId = reactive({ value: 0 });

    return {
      loggedIn,
      projectId
    };
  },
{persist: true}
);
