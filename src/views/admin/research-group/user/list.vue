<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="课题组">
        <el-input
          v-model="queryForm.research_group_name"
          class="max-width-150"
          size="small"
          clearable
        />
      </el-form-item>
      <el-form-item label="是否管理员">
        <el-select
          v-model="queryForm.is_admin"
          :clearable="true"
          size="small"
          class="max-width-150"
          placeholder="是否管理员"
        >
          <el-option label="是" value="1"></el-option>
          <el-option label="否" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="queryForm.status"
          :clearable="true"
          size="small"
          class="max-width-150"
          placeholder="状态"
        >
          <el-option label="审核中" value="0"></el-option>
          <el-option label="已通过" value="1"></el-option>
          <el-option label="未通过" value="-1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="单位">
        <el-select
          v-model="queryForm.factory_id"
          :clearable="false"
          size="small"
          class="max-width-150"
          placeholder="单位"
        >
          <el-option :label="factory.name" :value="factory.id" :key="idx" v-for="(factory,idx) in getSelectableFactories()"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button round size="small" @click="resetQuery">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <el-table-column prop="research_group_name" label="课题组名称" />
      <el-table-column prop="user_name" label="用户姓名" />
      <el-table-column prop="user_mobile" label="用户手机号" />
      <el-table-column label="是否管理员">
        <template slot-scope="scope">
          {{ scope.row.is_admin ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status === 1">已通过</el-tag>
          <el-tag type="info" v-if="scope.row.status === 0">待审核</el-tag>
          <el-tag type="danger" v-if="scope.row.status === -1">未通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="factory_id" label="单位">
          <template slot-scope="scope">
            {{getFactoryName(scope.row.factory_id)}}
          </template>
      </el-table-column>
      <el-table-column
        v-if="checkNode('research_group_user_audit') || checkNode('set_research_group_user_admin')"
        width="300"
        label="操作"
      >
        <template slot-scope="scope">
          <el-form :inline="true">
            <el-form-item
              v-if="checkNode('set_research_group_user_admin')"
              style="margin-bottom: 0"
            >
              <el-button
                v-if="scope.row.is_admin === 1"
                size="mini"
                type="danger"
                @click="handleSetAdmin(scope.row, 0)"
                >解除联系人</el-button
              >
              <el-button
                v-if="scope.row.is_admin === 0"
                size="mini"
                type="primary"
                @click="handleSetAdmin(scope.row, 1)"
                >设为联系人</el-button
              >
            </el-form-item>
            <el-form-item
              v-if="checkNode('research_group_user_audit') && scope.row.status != 1"
              style="margin-bottom: 0"
            >
              <el-select
                size="small"
                class="max-width-80"
                v-model="verifyArr[scope.$index]"
                @visible-change="handleAudit($event, scope)"
                placeholder="审核"
              >
                <el-option
                  v-if="scope.row.status === 0 || scope.row.status === -1"
                  label="通过"
                  value="1"
                ></el-option>
                <el-option
                  v-if="scope.row.status === 1 || scope.row.status === 0"
                  label="拒绝"
                  value="-1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <div slot="empty">
        <empty />
      </div>
    </el-table>
    <el-pagination
      class="dl-pagination"
      :hide-on-single-page="true"
      background
      :page-sizes="[10, 30, 50]"
      layout="total, prev, pager, next, sizes, jumper"
      :total="total"
      :current-page="queryForm.page"
      :page-size="queryForm.size"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import {
  researchGroupUserList,
  researchGroupUserAudit,
  researchGroupUserSetAdmin,
} from '@/api/research';
import { checkNode } from '@/utils/validate';
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
        status: '',
        is_admin: '',
        research_group_name: '',
        factory_id: '',
      },
      list: [],
      verifyArr: new Array(),
      total: 0,
    };
  },
  created() {
    this.queryForm.factory_id = this.currentFactoryId;
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
    resetQuery() {
      this.queryForm.page = 1;
      this.queryList();
    },
    handleSetAdmin(row, status) {
      const text = status !== 0 ? '设置' : '解除';
      this.$confirm('确定要' + text + '管理员"' + row.user_name + '"吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        researchGroupUserSetAdmin({
          research_group_user_id: row.id,
          is_admin: status,
        }).then((response) => {
          if (response.status === 1) {
            this.queryList();
          }
        });
      });
    },
    getType(type) {
      switch (type) {
        case 1:
          return '科研组室';
        case 2:
          return '课题组';
        case 3:
          return '科研个人账户';
      }
    },
    handleAudit(flag, scope) {
      if (!flag && this.verifyArr[scope.$index]) {
        const status = this.verifyArr[scope.$index];
        const text = status == 1 ? '通过' : '拒绝';
        this.$confirm('确定要' + text + scope.row.user_name + '的请求吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          researchGroupUserAudit({
            research_group_user_id: scope.row.id,
            status: status,
          }).then((response) => {
            if (response.status === 1) {
              this.queryList();
            }
          });
        });
      }
    },
    handleSizeChange(val) {
      this.queryForm.size = val;
      this.queryList();
    },
    handleCurrentChange(val) {
      this.queryForm.page = val;
      this.queryList();
    },
    indexMethod(index) {
      return index + (this.queryForm.page - 1) * this.queryForm.size + 1;
    },
    checkNode(node) {
      return checkNode(node);
    },
  },
};
</script>
