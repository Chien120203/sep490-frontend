<template>
  <svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
       viewBox="0 0 32.00 32.00" xml:space="preserve" :width="width" :height="height" :fill="fill"><g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
    <g id="SVGRepo_iconCarrier">
      <circle class="st0" cx="9" cy="23" r="7"></circle>
      <circle class="st0" cx="27" cy="26" r="4"></circle>
      <line class="st0" x1="19" y1="5" x2="7" y2="5"></line>
      <path class="st0" d="M1.9,16c1.8-1.9,4.3-3,7.1-3c5.5,0,10,4.5,10,10c0,0.3,0,0.7,0,1"></path>
      <polyline class="st0" points="30.5,24 31,24 31,13 19.2,13 16,5 7,5 5.2,13.8 "></polyline>
      <polyline class="st0" points="19,24 22,24 23.5,24 "></polyline>
      <circle class="st0" cx="9" cy="23" r="2"></circle>
      <path class="st0" d="M23,8L23,8c1.1,0,2,0.9,2,2v6"></path> </g></svg>
</template>


<script>
import {COLOR_GRAY_1} from "../constants/color";

export default {
  props: {
    iconName: {
      type: String,
      default: "icon-machine-management",
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
