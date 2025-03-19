<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryForm">
      <!-- <el-form-item label="实验室">
                <el-select v-model="queryForm.platform_id" :clearable="true" size="small" class="max-width-150" placeholder="实验室">
                    <el-option
                        v-for="item in platforms"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                </el-select>
            </el-form-item> -->
      <el-form-item label="类型">
        <el-select
          v-model="queryForm.type"
          :clearable="true"
          size="small"
          class="max-width-150"
          placeholder="类型"
        >
          <el-option value="1" label="自主报名">自主报名</el-option>
          <el-option value="2" label="申请培训">申请培训</el-option>
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
      <el-table-column label="订单号">
        <template slot-scope="scope">
          {{ scope.row.order_no != '' ? scope.row.order_no : '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="train_name" label="培训名称" />
      <el-table-column prop="user_name" label="姓名" />
      <el-table-column prop="user_mobile" label="手机号" />
      <el-table-column label="类型">
        <template slot-scope="scope">
          <span v-if="scope.row.config">申请报名</span>
          <span v-else>自主报名</span>
        </template>
      </el-table-column>
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
      <el-table-column prop="factory_id" label="单位">
        <template slot-scope="scope">
          {{getFactoryName(scope.row.factory_id)}}
        </template>
      </el-table-column>
      <el-table-column width="180" label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status === 1 && scope.row.is_arrive === 0"
            size="mini"
            type="primary"
            @click="toSignIn(scope.row.id)"
            >签到</el-button
          >
          <el-button
            v-if="(scope.row.status === 0 || scope.row.status === 1) && scope.row.is_arrive === 0"
            size="mini"
            type="success"
            @click="toCancel(scope.row.id)"
            >取消报名</el-button
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
import { trainEnrollList, deleteTrainEnroll, cancelTrainEnroll, trainSignIn } from '@/api/train';
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
        user_id: '',
        factory_id: '',
      },
      platforms: [],
      list: [],
      total: 0,
    };
  },
  created() {
    this.queryForm.factory_id = this.currentFactoryId;
    this.queryForm.user_id = this.member.id;
    this.queryList();
    this.getPlatforms();
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
    handleDelete(row, status) {
      const text = status === 0 ? '恢复' : '删除';
      this.$confirm('确定要' + text + '报名吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteTrainEnroll({ id: row.id, is_deleted: status }).then((response) => {
          if (response.status === 1) {
            this.queryList();
          }
        });
      });
    },
    getPlatforms() {
      platformList({ page: 1, size: 100, is_deleted: 0 }).then((res) => {
        if (res.status === 200) {
          this.platforms = res.data.data;
        }
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
    toSignIn(id) {
      trainSignIn({ id }).then((response) => {
        if (response.status === 1) {
          this.queryList();
        }
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
    checkNode(node) {
      return checkNode(node);
    },
    indexMethod(index) {
      return index + (this.queryForm.page - 1) * this.queryForm.size + 1;
    },
  },
};
</script>
