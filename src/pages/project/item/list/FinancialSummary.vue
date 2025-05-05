<template>
  <div class="grid-container">
    <div v-for="(section, index) in sections" :key="index" class="card" :style="{ backgroundColor: section.bgColor }">
      <h3>{{ section.title }}</h3>
      <div v-for="(item, i) in section.data" :key="i" class="data-row">
        <span>{{ item.label }}</span>
        <span :class="{ 'negative': item.value < 0 }">{{ formatNumber(item.value) }} </span>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from 'vue';
import {CURRENCY} from "@/constants/application.js";

export default defineComponent({
  props: {
    sections: Array, // Array of sections with title, bgColor, and data
  },
  setup(props) {
    const state = reactive({
      sections: props.sections,
    });

    const formatNumber = (value) => {
      return new Intl.NumberFormat('en-US').format(value) + " " + CURRENCY;
    };

    return { ...toRefs(state), formatNumber, CURRENCY };
  },
});
</script>

<style scoped>
.grid-container {
  display: flex;
  gap: 20px;
  justify-content: center;
}
.card {
  padding: 15px;
  border-radius: 8px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  width: 300px;
}
h3 {
  text-align: center;
  margin-bottom: 10px;
}
.data-row {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.negative {
  color: red;
}
</style>
