<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-dialog
      title="订单完成"
      :visible.sync="showDialog_"
      width="15%"
      @close="handleClose_"
      custom-class="el-dialog_"
    >
      <span style="color: green; font-size: 20px">添加动物订单成功！</span>
      <br />
      <el-button type="primary" @click="continue_shopping" style="margin-top: 20px"
        >继续购物</el-button
      >

      <el-button type="primary" @click="go_shopping_cart" style="margin-top: 20px"
        >前往购物车</el-button
      >
    </el-dialog>

    <h2 style="text-align: center; background-color: aliceblue; padding: 20px">动物基本信息</h2>

    <!-- 表单部分 -->
    <el-form :model="form" label-width="120px">
      <el-row>
        <el-form-item label="动物品种编号：">
          <el-input v-model="form.brand" placeholder="请输入动物品种编号"></el-input>
        </el-form-item>
        <el-form-item label="基因名称：">
          <el-input v-model="form.gene_name" placeholder="请输入基因名称"></el-input>
        </el-form-item>
      </el-row>

      <el-form-item label="基因类型：">
        <el-select v-model="form.gene_type" placeholder="请选择基因类型">
          <el-option label="其他" value="其他"></el-option>
          <el-option label="综合" value="综合"></el-option>
          <el-option label="复杂" value="复杂"></el-option>
          <el-option label="基因插入" value="基因插入"></el-option>
          <el-option label="基因缺除" value="基因缺除"></el-option>
        </el-select>
      </el-form-item>

      <el-row>
        <el-col :span="12">
          <el-form-item label="动物接受日期：">
            <el-date-picker
              v-model="form.receive_date"
              type="date"
              placeholder="选择日期"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="进驻日龄：">
            <el-date-picker
              v-model="form.entry_date"
              type="date"
              placeholder="选择日期"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="冻精(胚胎)交付日期:">
            <el-date-picker
              v-model="form.deliver_date"
              type="date"
              placeholder="选择日期"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="技术员：">
            <el-input v-model="form.manager_name" placeholder="请输入技术员姓名"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-form-item label="冻存信息：">
            <el-input
              v-model="form.frozen_info"
              type="textarea"
              size="big"
              :rows="7"
              placeholder="请输入冻存信息"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 冻存动物详情 -->
      <el-form-item label="冻存动物详情：">
        <el-button type="primary" @click="addAnimalDetail">+ 新增</el-button>
      </el-form-item>
      <!-- 动物性别和数量 -->
      <div v-for="(animal, index) in form.animalList" :key="index" style="margin-bottom: 10px">
        <el-form-item>
          <el-select
            v-model="animal.gender"
            placeholder="动物性别"
            style="width: 30%; margin-right: 10px"
          >
            <el-option label="雄性" value="雄性"></el-option>
            <el-option label="雌性" value="雌性"></el-option>
          </el-select>
          <el-input
            v-model="animal.count"
            placeholder="数量"
            style="width: 30%; margin-right: 10px"
          ></el-input>
          <el-button type="danger" @click="removeAnimalDetail(index)">删除</el-button>
        </el-form-item>
      </div>
    </el-form>

    <!-- 表格部分 -->
    <div style="margin-top: 20px">
      <h3>流转信息</h3>
      <!-- 信息分类 -->
      <div style="display: flex; justify-content: space-around; margin-bottom: 10px">
        <div
          style="flex: 1; text-align: center; background-color: green; color: white; padding: 10px"
        >
          合格+
        </div>
        <div
          style="flex: 1; text-align: center; background-color: green; color: white; padding: 10px"
        >
          合格(符合人员和环境需求)+
        </div>
        <div
          style="flex: 1; text-align: center; background-color: red; color: white; padding: 10px"
        >
          不合格+
        </div>
      </div>

      <!-- 冻存信息表格 -->
      <el-table :data="animalDetails" border style="width: 100%">
        <el-table-column prop="animalType" label="冻存类型" width="120"></el-table-column>
        <el-table-column prop="operator" label="操作人" width="120"></el-table-column>
        <el-table-column prop="operationTime" label="操作时间" width="180"></el-table-column>
        <el-table-column prop="auditTime" label="审核时间" width="180"></el-table-column>
        <el-table-column prop="auditStatus" label="审核状态" width="120"></el-table-column>
        <el-table-column prop="comment" label="备注" width="180"></el-table-column>
      </el-table>
    </div>

    <!-- 按钮部分 -->
    <div style="margin-top: 20px; text-align: center; width: 100%">
      <el-button type="primary" @click="submit()">提交</el-button>
    </div>
  </div>
</template>
      
<script>
import store from '@/store';
import { buyTechOrderCold } from '@/api/order';
export default {
  data() {
    return {
      form: {
        animalList: [
          {
            count: '',
            gender: '',
          },
        ],
        brand: '',
        count: 10,
        deliver_date: '',
        entry_date: '',
        extra: 0.1,
        frozen_info: '',
        gene_name: '',
        gene_type: '',
        manager_name: '',
        receive_date: '',
        tech_id: 4,
        user_id: store.getters.member.id,
      },
      animalDetails: [
        {
          animalType: '冻精',
          operator: '操作人A',
          operationTime: '2023-04-21 10:56:56',
          auditTime: '2023-04-21 10:58:32',
          auditStatus: '合格',
          comment: '合格冻精',
        },
        {
          animalType: '冻胚',
          operator: '操作人B',
          operationTime: '2023-04-21 10:56:32',
          auditTime: '2023-04-21 10:58:12',
          auditStatus: '合格',
          comment: '合格冻胚',
        },
        {
          animalType: '冻精',
          operator: '操作人C',
          operationTime: '2023-04-22 11:05:12',
          auditTime: '2023-04-22 11:07:32',
          auditStatus: '不合格',
          comment: '冻精异常',
        },
      ],
      showDialog_: false,
    };
  },
  methods: {
    addAnimalDetail() {
      this.form.animalList.push({
        count: '',
        gender: '',
      });
    },
    removeAnimalDetail(index) {
      this.form.animalList.splice(index, 1);
    },
    submit() {
      this.form.tech_id = this.$route.params.id;
      buyTechOrderCold(this.form).then((res) => {
        this.showDialog_ = true;
      });
    },
    go_shopping_cart() {
      this.$router.push({ path: '/personal/shopping/cart' });
    },
    handleClose_() {
      this.showDialog_ = false;
    },
    continue_shopping() {
      this.showDialog_ = false;
      this.$router.push({ path: '/buy-tech' });
    },
  },
};
</script>
      
<style>
h2 {
  text-align: center;
  margin-bottom: 20px;
}

h3 {
  margin-top: 20px;
  margin-bottom: 10px;
}
.el-dialog_ {
  border-radius: 10px; /* 设置圆角 */
  overflow: hidden; /* 避免内容溢出 */
}
</style>
      