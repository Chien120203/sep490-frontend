import { EN_LOCALE } from "@/constants/application";
import { ref } from "vue";
import { mixins } from "@/helpers/mixins";

const defaultLocale = localStorage.getItem("CurrentLanguage") || EN_LOCALE;
const refDefaultLocale = ref(defaultLocale);
const globalLocale = {
  value: refDefaultLocale,
  update(locale) {
    refDefaultLocale.value = locale;
  },
};

export const mixinMethods = mixins;
export const $globalLocale = globalLocale;

export default {
  $globalLocale: globalLocale
};
