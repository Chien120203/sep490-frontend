<template>
  <div class="price-input-form">
    <el-form label-width="120px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Đơn giá">
            <el-input v-model="price.material" placeholder="Vật liệu" class="custom-input" />
            <el-input v-model="price.labor" placeholder="Nhân công" class="custom-input" />
            <el-input v-model="price.machine" placeholder="Máy thi công" class="custom-input" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="Thành tiền">
            <el-input v-model="total.material" placeholder="Vật liệu" class="custom-input" />
            <el-input v-model="total.labor" placeholder="Nhân công" class="custom-input" />
            <el-input v-model="total.machine" placeholder="Máy thi công" class="custom-input" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row label="Phụ thuộc" :gutter="20">
        <el-col :span="12">
          <el-form-item label="Công việc">
            <el-select v-model="dependency.item">
              <el-option
                  v-for="(task, index) in tasks"
                  :key="index"
                  :label="task.workName"
                  :value="task.index"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Loại phụ thuộc">
            <el-select v-model="dependency.type">
              <el-option :label="$t('common.no_dependency')" value=""></el-option>
              <el-option
                  v-for="(type, index) in TASK_RELATIONSHIPS"
                  :key="index"
                  :label="$t(type.label)"
                  :value="type.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import {defineProps, ref} from "vue";
import {TASK_RELATIONSHIPS} from "@/constants/project.js";
const props = defineProps({
  tasks: {type: Array, default: () => []},
});
const price = ref({
  material: "",
  labor: "",
  machine: "",
});

const total = ref({
  material: "",
  labor: "",
  machine: "",
});

const dependency = ref({
  item: "",
  type: ""
})

const submitData = () => {
  console.log("Data submitted", price.value, total.value);
};
</script>

<style scoped>
.custom-input {
  margin-bottom: 10px; /* Adjust margin as needed */
}
.price-input-form {
  padding: 10px;
  background: #fff;
  border-radius: 5px;
}
</style>
