<template>
  <svg :width="width" :height="height" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
    <g id="SVGRepo_iconCarrier">
      <path d="M21 7v11.6c0 1.33-1.07 2.4-2.4 2.4H5.4C4.07 21 3 19.93 3 18.6V7" :fill="fill"
            fill-opacity=".16"></path>
      <path d="M21 7v11.6c0 1.33-1.07 2.4-2.4 2.4H5.4C4.07 21 3 19.93 3 18.6V7" stroke="#A6ABC8" stroke-width="1.5"
            stroke-miterlimit="10" stroke-linecap="round"></path>
      <path
          d="M21.4 3H2.6A1.6 1.6 0 0 0 1 4.6v.8A1.6 1.6 0 0 0 2.6 7h18.8A1.6 1.6 0 0 0 23 5.4v-.8A1.6 1.6 0 0 0 21.4 3Z"
          fill="#ffffff" stroke="#A6ABC8" stroke-width="1.5" stroke-miterlimit="10"></path>
      <path d="M8 11h8" stroke="#A6ABC8" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"></path>
    </g>
  </svg>
</template>

<script>
import {COLOR_GRAY_1} from "../constants/color";

export default {
  props: {
    iconName: {
      type: String,
      default: "icon-arrow-left",
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
