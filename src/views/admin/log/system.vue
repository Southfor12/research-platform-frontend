<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="日志等级">
        <el-select
          v-model="queryForm.level"
          :clearable="true"
          size="small"
          class="max-width-150"
          placeholder="类型"
        >
          <el-option value="0" label="记录"></el-option>
          <el-option value="1" label="错误"></el-option>
          <el-option value="2" label="警告"></el-option>
          <el-option value="3" label="调试"></el-option>
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
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <el-table-column prop="operator_name" label="操作人" />
      <el-table-column prop="operator_mobile" label="操作人手机号" />
      <el-table-column label="日志等级">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level === 0" type="info">记录</el-tag>
          <el-tag v-if="scope.row.level === 1" type="danger">错误</el-tag>
          <el-tag v-if="scope.row.level === 2" type="warning">警告</el-tag>
          <el-tag v-if="scope.row.level === 3">调试</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="具体信息">
        <template slot-scope="scope">
          {{ JSON.stringify(scope.row.data) }}
        </template>
      </el-table-column>
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
import { systemLogList } from '@/api/log';
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
        sort: 'id',
        sort_type: 'desc',
        level: '',
        factory_id: '',
      },
      list: [],
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
      systemLogList(this.queryForm)
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
