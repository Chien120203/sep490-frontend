<template>
  <svg :fill="fill" :width="width" :height="height" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
    <g id="SVGRepo_iconCarrier">
      <path
          d="M16.4,10h3.2a.77.77,0,0,0,.8-.7V6.8H31.6V9.2a.77.77,0,0,0,.7.8h3.3a.77.77,0,0,0,.8-.7V6.8A4.87,4.87,0,0,0,31.6,2H20.4a4.87,4.87,0,0,0-4.8,4.8V9.2a.79.79,0,0,0,.8.8Z"></path>
      <path
          d="M45.2,14.8H6.8A4.87,4.87,0,0,0,2,19.6V45.2A4.87,4.87,0,0,0,6.8,50H45.2A4.87,4.87,0,0,0,50,45.2V19.6A4.87,4.87,0,0,0,45.2,14.8ZM23.4,32.9l-6.1,6.3a1.08,1.08,0,0,1-1.1,0L10,32.9c-.5-.4-.1-1.1.7-1.1h3.8A12,12,0,0,1,26.3,19.6h.4v4.6A8.19,8.19,0,0,0,19,31.8h3.6C23.4,31.8,23.8,32.5,23.4,32.9Zm19.4,0H39A12.16,12.16,0,0,1,26.9,45.1h-.3V40.5c4.6,0,7.8-3,7.8-7.6H30.7c-.8,0-1.1-.6-.7-1.1l6.2-6.3a1.08,1.08,0,0,1,1.1,0l6.2,6.3c.4.4,0,1.1-.7,1.1Z"></path>
    </g>
  </svg>
</template>

<script>
import {COLOR_GRAY_1} from "../constants/color";

export default {
  props: {
    iconName: {
      type: String,
      default: "icon-contract",
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
