<template>
  <svg :fill="fill" :width="width" :height="height" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
       stroke="#A6ABC8">
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
    <g id="SVGRepo_iconCarrier">
      <path id="accept" class="cls-1"
            d="M1008,120a12,12,0,1,1,12-12A12,12,0,0,1,1008,120Zm0-22a10,10,0,1,0,10,10A10,10,0,0,0,1008,98Zm-0.08,14.333a0.819,0.819,0,0,1-.22.391,0.892,0.892,0,0,1-.72.259,0.913,0.913,0,0,1-.94-0.655l-2.82-2.818a0.9,0.9,0,0,1,1.27-1.271l2.18,2.184,4.46-7.907a1,1,0,0,1,1.38-.385,1.051,1.051,0,0,1,.36,1.417Z"
            transform="translate(-996 -96)"></path>
    </g>
  </svg>
</template>

<script>
import {COLOR_BLUE_1} from "@/constants/color.js";

export default {
  props: {
    iconName: {
      type: String,
      default: "icon-edit",
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
      default: COLOR_BLUE_1,
    }
  },
};
</script>
