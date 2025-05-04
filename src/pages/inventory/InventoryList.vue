<template>
  <div class="mobilization mobilization-list">
    <div class="mobilization-header">
      <h3 class="page__ttl"><span class="btn-back" @click="handleBack"><IconBackMain/></span>{{ $t("inventory.title") }}
      </h3>
    </div>

    <div class="mobilization-body">
      <!-- SEARCH -->
      <div class="mobilization-search">
        <div class="mobilization-search-box col-md-9 col-lg-9">
          <p class="mobilization-search__ttl">
            {{ $t("mobilization.keyword") }}
          </p>
          <div class="mb-0 ruleform">
            <el-input
                :placeholder="$t('common.input_keyword')"
                @keyup.enter="submitForm"
                v-model="searchForms.search"
                prop="search"
            >
            </el-input>
          </div>
        </div>
        <div class="btn-search-select col-md-3 col-lg-3 mobilization-box-btn-all">
          <el-button class="btn btn-search" @click="submitForm()">
            {{ $t("common.search") }}
          </el-button>
          <el-button class="btn btn-clear" @click="handleClear()">
            {{ $t("common.clear") }}
          </el-button>
        </div>
      </div>
    </div>

    <!-- TABLES BY TYPE -->
    <div class="mobilization-body-table">
      <el-tabs v-model="activeTab">
        <el-tab-pane :label="`${$t('inventory.type.team')}`" :name="HUMAN_TYPE">
          <InventoryTable
              :data="listTeams"
          />
        </el-tab-pane>
        <el-tab-pane :label="`${$t('inventory.type.machine')}`" :name="MACHINE_TYPE">
          <InventoryTable
              :data="listMachines"
          />
        </el-tab-pane>
        <el-tab-pane :label="`${$t('inventory.type.material')}`" :name="MATERIAL_TYPE">
          <InventoryTable
              :data="listMaterials"
          />
        </el-tab-pane>
      </el-tabs>

      <LoadMore
          :listData="inventoryData.value"
          :totalItems="totalItems.value"
          @loadMore="handleLoadMore"
      />
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted, watch} from "vue";
import {useI18n} from "vue-i18n";
import {usePersistenceStore} from "@/store/persistence.js";
import LoadMore from "@/components/common/LoadMore.vue";
import InventoryTable from "@/pages/inventory/items/InventoryTable.vue";
import {HUMAN_TYPE, MACHINE_TYPE, MATERIAL_TYPE} from "@/constants/resource.js"
import {useInventoryStore} from "@/store/inventory.js";
import IconBackMain from "@/svg/IconBackMain.vue";
import PAGE_NAME from "@/constants/route-name.js";
import {useRouter} from "vue-router";

// State
const activeTab = ref(HUMAN_TYPE);
const router = useRouter();
const persist = usePersistenceStore();
const inventoryStore = useInventoryStore();
const {
  inventoryData,
  totalItems,
  currentPage,
  getListInventory
} = inventoryStore;
const {
  projectId,
  loggedIn
} = persist;

const listMaterials = computed(() => inventoryData.value.filter(item => item.resourceType === MATERIAL_TYPE));
const listMachines = computed(() => inventoryData.value.filter(item => item.resourceType === MACHINE_TYPE));
const listTeams = computed(() => inventoryData.value.filter(item => item.resourceType === HUMAN_TYPE));

const searchForms = ref({
  projectId: projectId.value,
  type: HUMAN_TYPE,
  pageIndex: 1,
  pageSize: 15,
});

// Methods
const handleClear = () => {
  // searchForms.value.search = "";
};

const submitForm = () => {

};

const handleLoadMore = () => {
  currentPage.value++;
  searchForms.value.pageIndex++;
  getListInventory(searchForms.value);
};
const handleBack = () => {
  router.push({ name: PAGE_NAME.PROJECT.DETAILS, params: { id: projectId.value } });
};
// Lifecycle
onMounted(() => {
  if (loggedIn.value) {
    getListInventory(searchForms.value);
  }
});

onUnmounted(() => {
  totalItems.value = 0;
});

watch(() => activeTab.value, (newValue) => {
  searchForms.value.type = newValue;
  searchForms.value.pageIndex = 1;
  currentPage.value = 1;
  getListInventory(searchForms.value);
});
</script>

<style lang="scss" scoped>
.close-form {
  position: absolute;
  display: flex;
  justify-content: end;
  right: 16px;
  top: 10px;
  cursor: pointer;

  svg {
    height: 30px;
  }
}
</style>
