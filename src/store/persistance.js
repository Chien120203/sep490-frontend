import {defineStore} from "pinia";
import {reactive} from "vue";

export const usePersistanceStore = defineStore(
  "persist",
  () => {
    const loggedIn = reactive({ value: false });

    return {
      loggedIn,
    };
  },
{persist: true}
);
