import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "@/plugins/element-plus";
import globalVariable from "@/utils/variables";
import { i18n } from "@/utils/i18n";
import elen from "element-plus/es/locale/lang/en";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";
import {registerLicense} from '@syncfusion/ej2-base';

const pinia = createPinia();
registerLicense(import.meta.env.VITE_GANTT_CHART_LICENSE)
pinia.use(piniaPluginPersistedState);
const app = createApp(App);
app.config.globalProperties = {
  ...app.config.globalProperties,
  ...globalVariable,
};
app
  .use(router)
  .use(pinia)
  .use(ElementPlus, {
    locale: elen,
  })
  .use(i18n)
  .mount("#app");
