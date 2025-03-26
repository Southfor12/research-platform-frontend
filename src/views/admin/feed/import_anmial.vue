<template>
    <div>
      <!-- 基本信息 -->
      <el-form label-width="100px">
        <el-form-item label="订单编号">
          <el-input v-model="form.orderId" />
        </el-form-item>
        <el-form-item label="引入日期">
          <el-date-picker v-model="form.date" type="date" />
        </el-form-item>
        <el-form-item label="动物类型">
          <el-select v-model="form.animalType">
            <el-option label="小鼠" value="小鼠" />
          </el-select>
        </el-form-item>
        <el-form-item label="雌性数量">
          <el-input-number v-model="form.femaleCount" />
        </el-form-item>
        <el-form-item label="雄性数量">
          <el-input-number v-model="form.maleCount" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="nextStep">下一步</el-button>
        </el-form-item>
      </el-form>
  
      <!-- 动物信息表格 -->
      <el-table :data="animals" border>
        <el-table-column prop="strain" label="品系名称" />
        <el-table-column prop="gender" label="性别">
          <template v-slot="{ row }">
            <el-tag :type="row.gender === '♀' ? 'danger' : 'primary'">
              {{ row.gender }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="location" label="位置">
          <template v-slot="{ row }">
            <el-input v-model="row.location" />
          </template>
        </el-table-column>
        <el-table-column prop="birthDate" label="出生日期">
          <template v-slot="{ row }">
            <el-date-picker v-model="row.birthDate" type="date" />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button type="danger" @click="removeAnimal(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        form: {
          orderId: '',
          date: '',
          animalType: '小鼠',
          femaleCount: 5,
          maleCount: 5,
        },
        animals: Array.from({ length: 10 }).map((_, i) => ({
          strain: '',
          gender: i < 5 ? '♀' : '♂',
          location: '',
          birthDate: '',
        })),
      };
    },
    methods: {
      nextStep() {
        console.log('进入下一步');
      },
      removeAnimal(row) {
        this.animals = this.animals.filter((item) => item !== row);
      },
    },
  };
  </script>
  