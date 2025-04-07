<template>
  <svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g id="SVGRepo_tracerCarrier"
       stroke-linecap="round"
       stroke-linejoin="round"></g>
    <g id="SVGRepo_iconCarrier">
      <path d="M3 7L10 3L21 7M3 7V12L14 16L21 12V7M3 7L14 11L21 7" stroke="#A6ABC8" stroke-width="2"
            stroke-linejoin="round"></path>
      <path d="M3 12V17L14 21L21 17V12" stroke="#A6ABC8" stroke-width="2" stroke-linejoin="round"></path>
    </g>
  </svg>
</template>

<script>
import {COLOR_GRAY_1} from "../constants/color";

export default {
  props: {
    iconName: {
      type: String,
      default: "icon-material-management",
    },
    width: {
      type: [Number, String],
      default: 18,
    },
    height: {
      type: [Number, String],
      default: 18,
    },
    fill: {
      type: String,
      default: COLOR_GRAY_1,
    },
  },
};
</script>
