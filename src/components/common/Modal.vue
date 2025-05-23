<template>
  <Transition name="modal">
    <div
        v-if="show"
        class="modal-mask"
        :id="target"
        :style="modalContainerStyle"
    >
      <div class="modal-container" :style="containerStyle" v-click-outside="handleClickOutside">
        <div class="modal-header" v-if="isShowHeader">
          <slot name="header">
            <div>
              <span>
                {{ modalTitle }}
              </span>
            </div>
          </slot>
          <div>
            <IconCircleClose @click="$emit('close', false)"/>
          </div>
        </div>
        <div class="modal-body">
          <slot name="body"></slot>
        </div>

        <div class="modal-footer" v-if="isShowFooter">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import {computed} from "vue";
import IconCircleClose from "@/svg/IconCircleClose.vue";
import vClickOutside from "click-outside-vue3";

export default {
  components: {IconCircleClose},
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    modalTitle: {
      type: String,
      default: "",
    },
    width: {
      type: [Number, String],
      default: "fit-content",
    },
    height: {
      type: [Number, String],
      default: "fit-content",
    },
    containerHeight:{
      type: [Number, String],
      default: "fit-content",
    },
    target: {
      type: String,
      default: "body",
    },
    form: {
      type: Object,
      default: () => {
      },
    },
    canClickOutside: {
      type: Boolean,
      default: true,
    },
    isShowHeader: {
      type: Boolean,
      default: true,
    },
    isShowFooter: {
      type: Boolean,
      default: true,
    },
  },

  directives: {
    clickOutside: vClickOutside.directive,
  },

  setup(props, {emit}) {
    const modalContainerStyle = computed(() => {
      return {
        "--width": props.width,
        "--height": props.height,
      };
    });

    const containerStyle = computed(() => {
      return {
        "--heightContainer": props.containerHeight,
      };
    });

    const handleClickOutside = async (event) => {
      if (
          event.target.getAttribute("id") === props.target &&
          props.canClickOutside
      ) {
        emit("close", false);
      }
    };

    return {
      modalContainerStyle,
      handleClickOutside,
      containerStyle,
    };
  },
};
</script>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  transition: opacity 0.3s ease;
}

.modal-container {
  width: var(--width);
  margin: auto;
  height: var(--heightContainer);
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: grid;
  grid-template-rows: 1fr 20fr auto;
}

.modal-header {
  border-bottom: 1px solid #ccc;
  padding: 16px;
  width: 100%;
  top: 0;
  left: 0;
  display: flex;

  svg {
    cursor: pointer;
    position: absolute;
    right: 1%;
    z-index: 10;
  }
}

.modal-header h5 {
  margin: 0;
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  margin-bottom: 0;
}

.modal-body {
  overflow-y: scroll;
  padding: 16px;
  flex: 1;
}

.modal-footer {
  display: flex;
  padding: 16px;
  justify-content: flex-end;
}

.modal-default-button {
  float: right;
}

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
