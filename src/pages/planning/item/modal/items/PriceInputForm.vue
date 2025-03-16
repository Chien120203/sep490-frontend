<template>
  <div class="price-input-form">
    <el-form label-width="120px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Đơn giá">
            <el-input v-model="price.material" placeholder="Vật liệu" />
            <el-input v-model="price.labor" placeholder="Nhân công" />
            <el-input v-model="price.machine" placeholder="Máy thi công" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="Thành tiền">
            <el-input v-model="total.material" placeholder="Vật liệu" />
            <el-input v-model="total.labor" placeholder="Nhân công" />
            <el-input v-model="total.machine" placeholder="Máy thi công" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from "vue";

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

const submitData = () => {
  console.log("Data submitted", price.value, total.value);
};
</script>

<style scoped>
.price-input-form {
  padding: 10px;
  background: #fff;
  border-radius: 5px;
}
</style>
