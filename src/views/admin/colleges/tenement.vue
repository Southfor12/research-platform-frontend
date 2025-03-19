<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="校区">
        <el-input v-model="queryForm.campusName" class="max-width-150" size="small" clearable />
      </el-form-item>
      <el-form-item label="编码">
        <el-input v-model="queryForm.code" class="max-width-150" size="small" clearable />
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="queryForm.name" class="max-width-150" size="small" clearable />
      </el-form-item>

      <el-form-item label="序号">
        <el-input v-model="queryForm.number" class="max-width-150" size="small" clearable />
      </el-form-item>

      <el-form-item>
        <el-button round size="small" @click="resetQuery">查询</el-button>
      </el-form-item>
      <el-form-item class="right">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd(0)"
          >添加楼宇</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="编号" />
      <el-table-column prop="campus_name" label="校区" />
      <el-table-column prop="code" label="编码" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="floor_count" label="楼层数" />
      <el-table-column prop="number" label="序号" />
      <!-- <el-table-column prop="id" label="编号">
        <template slot-scope="scope">
          {{getFactoryName(scope.row.factory_id)}}
        </template>
      </el-table-column> -->
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
      :page-size="queryForm.pageSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import { getTenement, delTenement, getCourtyard } from '@/api/colleges';
import { frontTrainDocList, deleteTrainDoc } from '@/api/security';
import { platformList } from '@/api/platform';
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
        pageSize: 10,
        sort: 'created_at',
        sort_type: 'desc',
        platform_id: '',
        name: '',
        id: '',
        code: '',
        number: '',
        campusName: '',
      },
      list: [],
      total: 0,
    };
  },
  created() {
    this.queryList();
    // this.getPlatforms();
  },
  methods: {
    queryList() {
      this.loading = true;
      getTenement(this.queryForm)
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
        console.log(row.id);
        delTenement({ id: row.id, is_deleted: !row.is_deleted }).then((response) => {
          row.is_deleted = row.is_deleted === false ? true : false;
        });
      });
    },
    toAdd(id = '') {
      if (!id) {
        this.$router.push({ path: '/admin/colleges/tenement-add/' });
      } else {
        this.$router.push({ path: '/admin/colleges/tenement-add/' + id });
      }
    },
    indexMethod(index) {
      return index + (this.queryForm.page - 1) * this.queryForm.pageSize + 1;
    },
    handleSizeChange(val) {
      this.queryForm.size = val;
      this.queryList();
    },
    handleCurrentChange(val) {
      this.queryForm.page = val;
      this.queryList();
    },
  },
};
</script>
