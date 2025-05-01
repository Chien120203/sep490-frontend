<template>
  <el-select
      v-model="selectedItem"
      :popper-append-to-body="false"
      popper-class="custom-dropdown-select"
      @visible-change="resetDataSelect"
      title="All"
      :placeholder="placeholder || ''"
      :disabled="isDisabled"
      :clearable="showClearable"
      :multiple="multiple"
      ref="singleOptionSelect"
  >
    <div class="bs-searchbox">
      <input
          v-if="isDisplaySearch && !isRemote"
          type="text"
          class="form-control"
          autocomplete="off"
          v-model="searchName"
          role="textbox"
          aria-label="Search"
      />
      <input
          v-if="isDisplaySearch && isRemote"
          type="text"
          class="form-control"
          autocomplete="off"
          @keyup="remoteSearch"
          role="textbox"
          aria-label="Search"
      />
    </div>
    <div v-if="filteredSearchData.length">
      <el-option
          v-for="item in filteredSearchData"
          :key="item[optionKeys.id]"
          :label="item[optionKeys.value]"
          :value="item[optionKeys.id]"
          :class="item[optionKeys.id] === -1 && 'border-top'"
          :disabled="usingListItems.includes(item[optionKeys.id])"
      >
        <div class="el-custom-select-dropdown">
          <span class="dropdown-option-name">{{ item[optionKeys.value] }}</span>
        </div>
      </el-option>
    </div>
    <el-option v-else value="" disabled>{{ $t('common.no_results_found') }}</el-option>
  </el-select>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { debounce } from 'lodash';
import { mixinMethods } from '@/utils/variables';
export default {
  name: "SingleOptionSelect",
  props: {
    listData: {
      type: Array,
      default: () => [],
    },
    role: {
      type: String,
      default: '',
    },
    optionKeys: {
      type: Object,
      default: () => ({ id: 'id', value: 'value' }),
    },
    showClearable: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    usingListItems: {
      type: Array,
      default: () => [],
    },
    isDisplaySearch: {
      type: Boolean,
      default: true,
    },
    defaultList: {
      type: [String, Number, Array],
      default: () => [],
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    isRemote: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "",
    },
    haveSelectAllOption: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["handleSelectedParams", "remoteSearch"],

  setup(props, { emit }) {
    const searchName = ref("");
    const selectedItem = ref(props.defaultList);
    const isSearching = ref(false);

    const resetDataSelect = () => {
      searchName.value = "";
    };

    const remoteSearch = debounce((event) => {
      isSearching.value = true;
      emit("remoteSearch", event.target.value, props.role);
    }, 300);

    const filteredSearchData = computed(() => {
      const lowerCaseSearch = searchName.value.toLowerCase() || "";
      let searchList = props.listData.filter((item) =>
          item[props.optionKeys.value]?.toLowerCase()?.includes(lowerCaseSearch)
      );
      if (props.haveSelectAllOption && searchList.length) {
        searchList.push({
          [props.optionKeys.id]: -1,
          [props.optionKeys.value]: "All",
        });
      }
      return searchList;
    });

    watch(selectedItem, (newValue) => {
      if(selectedItem.value) emit("handleSelectedParams", newValue);
    });

    watch(() => props.defaultList, (newValue) => {
      selectedItem.value = newValue;
    });

    return {
      searchName,
      selectedItem,
      mixinMethods,
      isSearching,
      resetDataSelect,
      remoteSearch,
      filteredSearchData,
    };
  },
};
</script>

<style scoped>
.dropdown-option-name {
  display: inline-block;
  width: 100%;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
}
</style>
