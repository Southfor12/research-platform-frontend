<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="类型">
        <el-select
          v-model="queryForm.type"
          :clearable="true"
          size="small"
          class="max-width-150"
          placeholder="状态"
        >
          <el-option label="奖励" value="1"></el-option>
          <el-option label="扣分" value="-1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="姓名">
        <el-select
          :filterable="true"
          v-model="queryForm.user_id"
          :clearable="true"
          size="small"
          class="max-width-150"
          placeholder="姓名"
        >
          <el-option
            v-for="(user, userIndex) in allUsers"
            :key="userIndex"
            :label="user.name"
            :value="user.id"
          />
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
    <el-table :data="list" :header-cell-style="{ background: '#fafafa' }" style="width: 100%">
      <el-table-column width="80px" type="index" :index="indexMethod" label="序号" />
      <el-table-column width="100px" prop="user_name" label="姓名" />
      <el-table-column width="100px" prop="score" label="分值" />
      <el-table-column width="100px" label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 1">奖励</el-tag>
          <el-tag v-else type="danger">扣分</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="note" min-width="200px" label="描述" />
      <el-table-column prop="created_at" label="时间" />
      <el-table-column prop="factory_id" label="单位">
          <template slot-scope="scope">
            {{getFactoryName(scope.row.factory_id)}}
          </template>
      </el-table-column>
      <el-table-column fixed="right" v-if="checkNode('reset_score')" width="180" label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.type !== 1 && scope.row.is_reset !== 1"
            size="mini"
            type="success"
            @click="resetScore(scope.row)"
            >恢复</el-button
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
      layout="total, prev, pager, next, jumper"
      :total="total"
      :current-page="queryForm.page"
      :page-size="queryForm.size"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import { checkNode } from '@/utils/validate';
import { allUsers, userScoreList, userScoreReset } from '@/api/user';
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
        user_id: '',
        factory_id: '',
      },
      allUsers:[],
      list: [],
      total: 0,
    };
  },
  created() {
    this.queryForm.factory_id = this.currentFactoryId;

    this.queryList();

    allUsers().then((res) => {
      if (res.status == 200) {
        this.allUsers = res.data.users;
      }
    });
  },
  methods: {
    queryList() {
      this.loading = true;
      userScoreList(this.queryForm)
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
    resetQuery() {
      this.queryForm.page = 1;
      this.queryList();
    },
    resetScore(item) {
      this.$confirm('确定恢复该条信用分?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        userScoreReset({ id: item.id }).then((res) => {
          if (res.status === 1) {
            this.queryList();
          }
        });
      });
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
