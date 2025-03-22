<template>
  <div class="progress-users-container">
    <el-table
        :data="listUsers"
        style="width: 100%; height: 95%"
        class="el-tbl-custom room-tbl"
    >
      <el-table-column
          type="index"
          min-width="53"
          :label="$t('common.no')"
          align="right"
      ></el-table-column>
      <el-table-column min-width="130">
        <template #header>
          <p v-html="$t('user.table.header.username')"></p>
        </template>
        <template #default="scope">
          <span class="data-table">{{ scope.row.username ? scope.row.username : "-"}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="130">
        <template #header>
          <p v-html="$t('user.table.header.fullName')"></p>
        </template>
        <template #default="scope">
          <span class="data-table">{{ scope.row.fullName ? scope.row.fullName : "-"}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="130">
        <template #header>
          <p v-html="$t('user.table.header.email')"></p>
        </template>
        <template #default="scope">
          <span class="data-table">{{ scope.row.email ? scope.row.email : "-"}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="100">
        <template #header>
          <p v-html="$t('user.table.header.role')"></p>
        </template>
        <template #default="scope">
          <span class="data-table">{{ scope.row.role  ? scope.row.role : "-"}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="100">
        <template #header>
          <p v-html="$t('user.table.header.phone')"></p>
        </template>
        <template #default="scope">
          <span class="data-table">{{ scope.row.phone ? scope.row.phone : "-"}}</span>
        </template>
      </el-table-column>
    </el-table>
    <LoadMore
        :listData="listUsers.value"
        :totalItems="totalItems.value"
        @loadMore="handleLoadMore"
    />
  </div>
</template>

<script setup>
import LoadMore from "@/components/common/LoadMore.vue";
import {ref} from "vue";

const props = defineProps({
  listUsers: Array,
});

const totalItems = ref(0);

const handleLoadMore = () => {
}

const emit = defineEmits([]);
</script>

<style scoped>
.progress-users-container {
  padding: 16px;
}
</style>
