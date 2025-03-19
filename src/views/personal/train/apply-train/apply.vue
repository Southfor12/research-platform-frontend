<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="培训">
        <el-select
          v-model="queryForm.train_id"
          :clearable="true"
          size="small"
          class="max-width-150"
          filterable
          remote
          reserve-keyword
          :remote-method="queryTrains"
          placeholder="培训"
        >
          <el-option v-for="item in trains" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否签到">
        <el-select
          v-model="queryForm.is_arrive"
          :clearable="true"
          size="small"
          class="max-width-150"
          placeholder="签到"
        >
          <el-option value="1" label="是"></el-option>
          <el-option value="0" label="否"></el-option>
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
          <el-option value="-1" label="已驳回"></el-option>
          <el-option value="0" label="待审核"></el-option>
          <el-option value="1" label="已审核"></el-option>
          <el-option value="2" label="已取消"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button round size="small" @click="resetQuery">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <el-table-column label="订单号">
        <template slot-scope="scope">
          {{ scope.row.order_no != '' ? scope.row.order_no : '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="train_name" label="培训名称" />
      <el-table-column prop="user_name" label="姓名" />
      <el-table-column prop="user_mobile" label="手机号" />
      <el-table-column prop="platform" label="科研组室" />
      <el-table-column prop="mentor_name" label="导师" />
      <el-table-column label="是否签到">
        <template slot-scope="scope">
          {{ scope.row.is_arrive ? '已签到' : '未签到' }}
        </template>
      </el-table-column>
      <el-table-column label="是否通过考核">
        <template slot-scope="scope">
          {{ scope.row.is_passed === 1 ? '是' : scope.row.is_passed === 0 ? '待考核' : '否' }}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === -1" type="danger">已驳回</el-tag>
          <el-tag v-if="scope.row.status === 0">待审核</el-tag>
          <el-tag v-if="scope.row.status === 1" type="success">已审核</el-tag>
          <el-tag v-if="scope.row.status === 2" type="info">已取消</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="220" label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status === 1 && scope.row.is_passed === 0"
            size="mini"
            type="danger"
            @click="handleDelete(scope.row, -1)"
            >考核不通过</el-button
          >
          <el-button
            v-if="scope.row.status === 1 && scope.row.is_passed === 0"
            size="mini"
            type="success"
            @click="handleDelete(scope.row, 1)"
            >考核通过</el-button
          >
          <el-button
            v-if="scope.row.status === 0"
            size="mini"
            type="danger"
            @click="handleVerify(scope.row, -1)"
            >拒绝报名</el-button
          >
          <el-button
            v-if="scope.row.status === 0"
            size="mini"
            type="success"
            @click="handleVerify(scope.row, 1)"
            >报名通过</el-button
          >
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
import { platformList } from '@/api/platform';
import {
  trainList,
  trainEnrollList,
  passTrainEnroll,
  cancelTrainEnroll,
  verifyEnroll,
} from '@/api/train';
import { checkNode } from '@/utils/validate';
import { mapGetters } from 'vuex';
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
        is_arrive: '',
        type: 2,
        train_id: '',
      },
      searchTrainForm: {
        page: 1,
        size: 30,
        sort: 'created_at',
        sort_type: 'desc',
        is_deleted: 0,
        name: '',
      },
      trains: [],
      list: [],
      total: 0,
    };
  },
  created() {
    this.queryList();
  },
  computed: {
    ...mapGetters(['member']),
  },
  methods: {
    queryList() {
      this.loading = true;
      trainEnrollList(this.queryForm)
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
    getTypes(type) {
      switch (type) {
        case 1:
          return '仪器培训';
        case 2:
          return '服务培训';
        case 3:
          return '技术培训';
      }
    },
    resetQuery() {
      this.queryForm.page = 1;
      this.queryList();
    },
    queryTrains(query = '') {
      this.searchTrainForm.name = query;
      this.trains = [];
      trainList(this.searchTrainForm).then((res) => {
        if (res.status === 200) {
          this.trains = res.data.data;
        }
      });
    },
    handleDelete(row, status) {
      const text = status === 1 ? '通过' : '不通过';
      this.$confirm('确定' + text + row.user_name + '的培训吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        passTrainEnroll({ id: row.id, is_passed: status }).then((response) => {
          if (response.status === 1) {
            this.queryList();
          }
        });
      });
    },
    handleVerify(row, status) {
      const text = status === 1 ? '同意' : '拒绝';
      this.$confirm('确定' + text + row.user_name + '参加培训吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        verifyEnroll({
          id: row.id,
          status: status,
        }).then((response) => {
          if (response.status === 1) {
            this.queryList();
          }
        });
      });
    },
    toCancel(id) {
      this.$confirm('确定要取消报名吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        cancelTrainEnroll({ id }).then((response) => {
          if (response.status === 1) {
            this.queryList();
          }
        });
      });
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
