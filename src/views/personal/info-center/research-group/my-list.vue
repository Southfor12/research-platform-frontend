<template>
  <div v-loading="loading" class="app-container" element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading">
    <el-form :inline="true" :model="queryForm">
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
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <el-table-column prop="research_group_id" label="课题组ID" width="180" />
      <el-table-column prop="research_group_name" label="课题组名称" />
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status === 1">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="factory_id" label="单位">
        <template slot-scope="scope">
          {{getFactoryName(scope.row.factory_id)}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="showUserList(scope.row)">课题组成员</el-button>
        </template>
      </el-table-column>
      <div slot="empty">
        <empty />
      </div>
    </el-table>
    <el-pagination class="dl-pagination" :hide-on-single-page="true" background :page-sizes="[10, 30, 50]"
      layout="total, prev, pager, next, sizes, jumper" :total="total" :current-page="queryForm.page"
      :page-size="queryForm.size" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    <el-dialog title="成员列表" :visible.sync="dialogVisible">
      <el-form :inline="true">
        <el-form-item label="课题组">
          {{ queryUserForm.research_group_name }}
        </el-form-item>
      </el-form>
      <el-table :header-cell-style="{ background: '#fafafa' }" :data="userList" style="width: 100%">
        <el-table-column width="100px" type="index" :index="indexMethod1" label="序号" />
        <el-table-column prop="user_name" label="姓名" />
        <el-table-column prop="user_mobile" label="手机号" />
        <el-table-column label="是否管理员">
          <template slot-scope="scope">
            {{ scope.row.is_admin ? '是' : '否' }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="dl-pagination" :hide-on-single-page="true" background
        layout="total, prev, pager, next, jumper" :total="userTotal" :current-page="queryUserForm.page"
        :page-size="queryUserForm.size" @current-change="handleUserChange" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {
    researchGroupUserList
  } from '@/api/research';
  import {
    mapGetters
  } from 'vuex';
  import Empty from '@/components/Empty';

  export default {
    components: {
      Empty,
    },
    computed: {
      ...mapGetters(['member']),
    },
    data() {
      return {
        loading: false,
        dialogVisible: false,
        queryForm: {
          page: 1,
          size: 10,
          sort: 'created_at',
          sort_type: 'desc',
          status: '1',
          user_id: '',
          factory_id: '',
        },
        queryUserForm: {
          page: 1,
          size: 10,
          sort: 'created_at',
          sort_type: 'desc',
          status: '1',
          research_group_id: '',
          research_group_name: '',
        },
        list: [],
        userList: [],
        verifyArr: new Array(),
        total: 0,
        userTotal: 0,
      };
    },
    created() {
      this.queryForm.factory_id = this.currentFactoryId;
      this.queryForm.user_id = this.member.id;
      this.queryList();
    },
    methods: {
      queryList() {
        this.loading = true;
        researchGroupUserList(this.queryForm)
          .then((res) => {
            this.loading = false;
            if (res.status === 200) {
              this.verifyArr = new Array(res.data.data.length);
              this.list = res.data.data;
              this.total = res.data.total;
            }
          })
          .catch((_) => {
            this.loading = false;
          });
      },
      showUserList(row) {
        this.userList = [];
        this.queryUserForm.page = 1;
        this.queryUserForm.research_group_name = row.research_group_name;
        this.queryUserForm.research_group_id = row.research_group_id;
        this.queryUserList();
        this.dialogVisible = true;
      },
      queryUserList() {
        researchGroupUserList(this.queryUserForm).then((res) => {
          if (res.status === 200) {
            this.userList = res.data.data;
            this.userTotal = res.data.total;
          }
        });
      },
      resetQuery() {
        this.queryForm.page = 1;
        this.queryList();
      },
      handleSizeChange(val) {
        this.queryForm.size = val;
        this.queryList();
      },
      handleCurrentChange(val) {
        this.queryForm.page = val;
        this.queryList();
      },
      handleUserChange(val) {
        this.queryUserForm.page = val;
        this.queryUserList();
      },
      indexMethod(index) {
        return index + (this.queryForm.page - 1) * this.queryForm.size + 1;
      },
      indexMethod1(index) {
        return index + (this.queryUserForm.page - 1) * this.queryUserForm.size + 1;
      },
    },
  };
</script>
