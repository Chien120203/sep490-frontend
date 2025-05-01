import { EN_LOCALE } from "@/constants/application";
import { ref } from "vue";
import { mixins } from "@/helpers/mixins";
import dayjs from "dayjs";
import 'dayjs/locale/vi';
import 'dayjs/locale/en';
const defaultLocale = localStorage.getItem("CurrentLanguage") || EN_LOCALE;
const refDefaultLocale = ref(defaultLocale);
const globalLocale = {
  value: refDefaultLocale,
  update(locale) {
    refDefaultLocale.value = locale;
    dayjs.locale(locale);
  },
};

export const mixinMethods = mixins;
export const $globalLocale = globalLocale;

export default {
  $globalLocale: globalLocale
};
