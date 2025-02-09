<template>
  <div>
    {{ "Home page" }}
  </div>
</template>

<script>
import { ref, watch } from "vue";

export default {
  name: "Home",
  setup() {
    const message = ref("Home page");

    // Return it inside an object
    return { message };
  },
};
</script>

<style lang="scss"></style>
