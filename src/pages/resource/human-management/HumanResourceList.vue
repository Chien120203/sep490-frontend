<template>
  <div class="mobilization mobilization-list">
    <div class="mobilization-header">
      <h3 class="page__ttl">{{ $t("construct_team.title") }}</h3>
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
                v-model="searchForms.teamName"
                prop="search"
            >
              <template #append>
                <span @click="handleSearchForm" class="btn-setting">
                  <IconSetting/>
                </span>
              </template>
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
      <div class="form-search" :class="{ active: isShowBoxSearch }">
        <div class="close-form">
          <IconCircleClose @click="isShowBoxSearch = false"/>
        </div>
        <div class="form-search-box">
          <div class="item">
            <el-form-item :label="$t('construct_team.manager')">
              <SingleOptionSelect
                  v-model="searchForms.teamManager"
                  :optionKeys="{ id: 'id', value: 'username' }"
                  :listData="listUsers.value"
                  :isRemote="true"
                  @remoteSearch="handleSearchManagers"
              />
            </el-form-item>
          </div>
        </div>
      </div>
    </div>

    <!-- TABLES BY TYPE -->
    <div class="mobilization-body-table">
      <ConstructTeamTable
          :data="listHumanResources.value"
      />
      <LoadMore
          :listData="listHumanResources.value"
          :totalItems="totalItems.value"
          @loadMore="handleLoadMore"
      />
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted, computed} from "vue";
import {usePersistenceStore} from "@/store/persistence.js";
import LoadMore from "@/components/common/LoadMore.vue";
import ConstructTeamTable from "@/pages/resource/human-management/item/ConstructTeamTable.vue";
import {useRouter} from "vue-router";
import {useHumanResourcesStore} from "@/store/human-resources.js";
import IconSetting from "@/svg/IconSettingMain.vue";
import IconCircleClose from "@/svg/IconCircleClose.vue";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import {useUserStore} from "@/store/user.js";
import {CONSTRUCTION_MANAGER} from "@/constants/roles.js";

// State
const router = useRouter();
const persist = usePersistenceStore();
const humanResourceStore = useHumanResourcesStore();
const userStore = useUserStore();
const {
  listHumanResources,
  totalItems,
  currentPage,
  isShowModalConfirm,
  saveHumanResources,
  getHumanResourcesDetails,
  getListHumanResources,
  handleDeleteHumanResources
} = humanResourceStore;
const {
  projectId
} = persist;
const {
  listUsers,
  getListUsers
} = userStore;

const searchForms = ref({
  teamManager: "",
  teamName: "",
  pageIndex: 1
});
const isShowBoxSearch = ref(false);

const handleSearchForm = () => {
  isShowBoxSearch.value = !isShowBoxSearch.value;
};
const handleClear = () => {
  searchForms.value.teamName = "";
  searchForms.value.teamManager = "";
};

const submitForm = () => {
  isShowBoxSearch.value = false;
  getListHumanResources(searchForms.value);
};

const handleLoadMore = () => {
  currentPage.value++;
  searchForms.value.pageIndex++;
  getListHumanResources(searchForms.value);
};
const handleSearchManagers = (value) => {
  getListUsers({
    keyWord: value,
    role: CONSTRUCTION_MANAGER,
    pageIndex: 1,
  }, false)
}

// Lifecycle
onMounted(() => {
  getListHumanResources(searchForms.value);
  getListUsers({
    keyWord: "",
    role: CONSTRUCTION_MANAGER,
    pageIndex: 1,
  }, false)
});

onUnmounted(() => {
  totalItems.value = 0;
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
