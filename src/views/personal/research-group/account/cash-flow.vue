<template>
  <div v-loading="loading" class="app-container" element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading">
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="课题组账号">
        <el-select v-model="queryForm.research_group_account_id" :clearable="true" size="small" class="max-width-150"
          placeholder="课题组账号">
          <el-option v-for="item in accountList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="queryForm.type" :clearable="true" size="small" class="max-width-150" placeholder="类型">
          <el-option value="1" label="充值"></el-option>
          <el-option value="0" label="消费"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订单号">
        <el-input placeholder="请输入订单号" v-model="queryForm.order_no" class="max-width-150" size="small" clearable>
        </el-input>
      </el-form-item>
      <el-form-item label="单位">
        <el-select v-model="queryForm.factory_id" :clearable="false" size="small" class="max-width-150"
          placeholder="单位">
          <el-option :label="factory.name" :value="factory.id" :key="idx"
            v-for="(factory,idx) in getSelectableFactories()"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button round size="small" @click="resetQuery">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" :header-cell-style="{ background: '#fafafa' }" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <el-table-column prop="order_no" label="订单号" />
      <el-table-column prop="research_group_account_name" label="课题组账号" />
      <el-table-column prop="research_group_name" label="课题组名称" />
      <el-table-column label="类型">
        <template slot-scope="scope">
          {{ scope.row.type === 1 ? '充值' : '消费' }}
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="金额/元" />
      <el-table-column prop="user_name" label="操作人" />
      <el-table-column prop="order_name" label="描述" />
      <el-table-column prop="created_at" label="操作时间" />
      <el-table-column prop="factory_id" label="单位">
        <template slot-scope="scope">
          {{getFactoryName(scope.row.factory_id)}}
        </template>
      </el-table-column>
      <div slot="empty">
        <empty />
      </div>
    </el-table>
    <el-pagination class="dl-pagination" :hide-on-single-page="true" background
      layout="total, prev, pager, next, jumper" :total="total" :current-page="queryForm.page"
      :page-size="queryForm.size" @current-change="handleCurrentChange" />
  </div>
</template>
<script>
  import {
    frontResearchGroupAccountCashFlow,
    frontResearchGroupAccountList
  } from '@/api/research';
  import Empty from '@/components/Empty';

  export default {
    components: {
      Empty,
    },
    data() {
      return {
        loading: false,
        queryForm: {
          page: 1,
          size: 10,
          sort: 'created_at',
          sort_type: 'desc',
          type: '',
          order_no: '',
          research_group_account_id: '',
          factory_id: '',
        },
        accountList: [],
        list: [],
        total: 0,
      };
    },
    created() {
      this.queryForm.factory_id = this.currentFactoryId;
      this.queryList();
      this.queryAccountList();
    },
    methods: {
      queryList() {
        this.loading = true;
        frontResearchGroupAccountCashFlow(this.queryForm)
          .then((res) => {
            this.loading = false;
            if (res.status === 200) {
              this.list = res.data.data;
              this.total = res.data.total;
            }
          })
          .catch((_) => {
            this.loading = false;
          });
      },
      queryAccountList() {
        frontResearchGroupAccountList({
          page: 1,
          size: 100,
          is_deleted: 0,
        }).then((res) => {
          if (res.status === 200) {
            this.accountList = res.data.data;
          }
        });
      },
      resetQuery() {
        this.queryForm.page = 1;
        this.queryList();
      },
      handleCurrentChange(val) {
        this.queryForm.page = val;
        this.queryList();
      },
      indexMethod(index) {
        return index + (this.queryForm.page - 1) * this.queryForm.size + 1;
      },
    },
  };
</script>
