<template>
  <div v-loading="loading" class="app-container" element-loading-text="数据查询中..." element-loading-spinner="el-icon-loading">
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="课题组账号">
        <el-select v-model="queryForm.research_group_account_id" filterable remote reserve-keyword :remote-method="queryAccountList" :clearable="true" size="small" class="max-width-150"
          placeholder="课题组账号">
          <el-option v-for="item in accountList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="用户">
        <el-select v-model="queryForm.user_id" filterable :clearable="true" size="small" class="max-width-150" placeholder="用户">
          <el-option v-for="(user,userIndex) in allUsers" :key="userIndex" :label="user.name" :value="user.id" />
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
      <el-form-item>
        <el-button round size="small" @click="resetQuery">查询</el-button>
        <!-- <el-button round size="small" @click="exportData">导出</el-button> -->
      </el-form-item>
    </el-form>
    <el-table :data="list" :header-cell-style="{background:'#fafafa'}" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <el-table-column prop="research_group_account_name" label="课题组账号" />
      <el-table-column prop="research_group_name" label="课题组名称" />
      <el-table-column prop="amount" label="金额" />
      <el-table-column prop="user_name" label="用户" />
      <el-table-column label="说明">
        <template slot-scope="scope">
          {{ scope.row.order_name }}
          <div v-if="scope.row.booking">
            <div>({{ scope.row.booking.apparatus_name }})</div>
            (
              <div v-html="scope.row.booking.date"></div>
              <div v-for="(item, index) in scope.row.booking.use_times" :key="index">
                {{ item.start_at }} - {{ item.end_at }}
              </div>
            )
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="during_desc" label="使用时长" />
      <el-table-column label="类型">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.type == 1">充值</el-tag>
          <el-tag type="danger" v-else>消费</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="order_no" label="订单号" />
      <el-table-column prop="created_at" label="操作时间" />
      <div slot="empty">
        <empty />
      </div>
    </el-table>
    <el-pagination class="dl-pagination" :hide-on-single-page="true" background layout="total, prev, pager, next, jumper"
      :total="total" :current-page="queryForm.page" :page-size="queryForm.size" @current-change="handleCurrentChange" />
  </div>
</template>
<script>
  import {
    researchGroupAccountCashFlow,
    researchGroupAccountList
  } from '@/api/research'

  import {
    allUsers
  } from '@/api/user.js'
  import Empty from '@/components/Empty'

  export default {
    components: {
      Empty
    },
    data() {
      return {
        allUsers:[],
        loading: false,
        queryForm: {
          page: 1,
          size: 10,
          sort: 'created_at',
          sort_type: 'desc',
          type: '',
          order_no: '',
          research_group_account_id: ''
        },
        accountList: [],
        list: [],
        total: 0
      }
    },
    created() {
      this.queryList()
      this.queryAccountList()
      this.loadUsers()
    },
    methods: {
      loadUsers() {
        // console.log('load users')
        allUsers().then(res => {
          if (res.status == 200) {
            this.allUsers = res.data.users
          }
        })
      },
      queryList() {
        this.loading = true
        researchGroupAccountCashFlow(this.queryForm).then(res => {
          this.loading = false
          if (res.status === 200) {
            this.list = res.data.data
            this.total = res.data.total
          }
        }).catch(_ => {
          this.loading = false
        })
      },
      //导出数据为excel
      exportData() {
        let vm = this;
        let params = Object.keys(this.queryForm).map(function(key) {
          return encodeURIComponent(key) + "=" + encodeURIComponent(vm.queryForm[key]);
        }).join("&");
        let url = process.env.VUE_APP_BASE_API + '/research-group-account/export-cash-flow?from=fronted&'+params;
        window.open(url);
      },
      queryAccountList(query = '') {
        researchGroupAccountList({
          name: query,
          page: 1,
          size: 100,
          is_deleted: 0
        }).then(res => {
          if (res.status === 200) {
            this.accountList = res.data.data
          }
        })
      },
      resetQuery() {
        this.queryForm.page = 1
        this.queryList()
      },
      handleCurrentChange(val) {
        this.queryForm.page = val
        this.queryList()
      },
      indexMethod(index) {
        return index + (this.queryForm.page - 1) * this.queryForm.size + 1
      },
    },
  }
</script>

<style>
  .el-pagination.is-background .el-pager li:not(.disabled).active{
    background-color: #822a2c;
    color:#fff;
  }

  .popper__arrow::after {
    border-bottom-color: #fff !important;
  }
</style>
