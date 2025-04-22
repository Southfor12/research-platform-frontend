<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="技术服务">
        <el-select v-model="queryForm.name">
          <el-option label="全部" value=""></el-option>
          <el-option label="冻存服务" value="冻存服务"></el-option>
          <el-option label="复苏服务" value="复苏服务"></el-option>
          <el-option label="净化服务" value="净化服务"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button round size="small" @click="resetQuery">查询</el-button>
      </el-form-item>
      <el-form-item class="right">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd(0)"
          >添加服务</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <el-table-column prop="number" label="编号" />
      <el-table-column prop="name" label="技术服务" />
      <el-table-column prop="manager" label="负责人" />
      <el-table-column prop="manager_mobile" label="负责人电话" />
      <el-table-column prop="price" label="单价" />
      <el-table-column prop="description" label="描述" />

      <el-table-column width="180" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="toAdd(scope.row.id)">修改</el-button>
          <el-button
            v-if="scope.row.is_deleted === false"
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
          <el-button
            v-if="scope.row.is_deleted === true"
            size="mini"
            type="info"
            @click="handleDelete(scope.row)"
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
      :page-sizes="[10, 30, 50]"
      layout="total, prev, pager, next, sizes, jumper"
      :total="total"
      :current-page="queryForm.page"
      :page-size="queryForm.page_size"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import { getTechnical, delTechnical } from '@/api/product';
import Empty from '@/components/Empty';

import { getInfo } from '@/api/user';

export default {
  components: {
    Empty,
  },
  data() {
    return {
      index: 1,
      loading: false,
      queryForm: {
        page: 1,
        page_size: 10,
        // sort: 'created_at',
        // sort_type: 'desc',
        // platform_id: '',

        // 编号、技术服务、负责人、负责人电话、单价、描述
        id: '',
        name: '',
        is_deleted: false,
        no_deleted: false,
      },
      list: [],
      total: 0,
    };
  },
  created() {
    this.queryList();
  },
  methods: {
    queryList() {
      this.loading = true;
      getTechnical(this.queryForm)
        .then((res) => {
          this.loading = false;
          this.list = res.data.content;

          this.total = res.data.totalElements;
        })
        .catch((_) => {
          this.loading = false;
        });
    },
    resetQuery() {
      this.queryForm.page = 1;
      this.queryList();
    },
    handleDelete(row) {
      const text = row.is_deleted === true ? '恢复' : '删除';
      this.$confirm('确定要' + text + '"' + row.name + '"吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        delTechnical({ id: row.id, is_deleted: !row.is_deleted }).then((response) => {
          row.is_deleted = row.is_deleted === false ? true : false;
          console.log(response);
        });
      });
    },
    toAdd(id = '') {
      if (!id) {
        this.$router.push({ path: '/admin/product/technical-add/' });
      } else {
        this.$router.push({ path: '/admin/product/technical-add/' + id });
      }
    },
    indexMethod(index) {
      return index + (this.queryForm.page - 1) * this.queryForm.page_size + 1;
    },
    handleSizeChange(val) {
      this.queryForm.page_size = val;
      this.queryList();
    },
    handleCurrentChange(val) {
      this.queryForm.page = val;
      this.queryList();
    },
  },
};
</script>
<style>
.app-container {
  padding: 20px;
  padding-top: 40px;
}
</style>
                  
                  