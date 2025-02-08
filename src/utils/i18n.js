import { createI18n } from "vue-i18n";
import vi from '@/locales/vi.json';
import en from "@/locales/en.json";
import { EN_LOCALE } from "@/constants/application";
import { computed } from "vue";
import { $globalLocale } from "../utils/variables";

export const i18n = createI18n({
  legacy: false,
  locale: computed(() => $globalLocale.value._value || EN_LOCALE),
  fallbackLocale: EN_LOCALE,
  messages: { en, vi },
  globalInjection: true,
});
