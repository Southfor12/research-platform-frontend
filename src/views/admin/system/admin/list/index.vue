<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryAdminForm">
      <el-form-item label="姓名">
        <el-input v-model="queryAdminForm.name" class="max-width-150" size="small" clearable />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="queryAdminForm.mobile" class="max-width-150" size="small" clearable />
      </el-form-item>
      <el-form-item label="单位">
        <el-select
          v-model="queryAdminForm.factory_id"
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
      <el-form-item v-if="checkNode('add_admin')" class="right">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="toAddAdmin"
          >新建管理员</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="admins" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column prop="role_name" label="角色名" />
      <el-table-column prop="factory_id" label="单位">
        <template slot-scope="scope">
          {{getFactoryName(scope.row.factory_id)}}
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkNode('edit_admin') || checkNode('delete_admin')"
        width="180"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            v-if="checkNode('edit_admin')"
            size="mini"
            type="text"
            @click="handleEdit(scope.$index, scope.row)"
            >修改</el-button
          >
          <el-button
            v-if="checkNode('delete_admin')"
            size="mini"
            type="text"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
      <div slot="empty">
        <empty />
      </div>
    </el-table>
    <div v-if="hidePagination">
      <el-pagination
        class="dl-pagination"
        background
        :page-sizes="[10, 30, 50]"
        layout="total, prev, pager, next, sizes, jumper"
        :total="total"
        :current-page="queryAdminForm.page"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { adminList, deleteAdmin } from '@/api/system';
import { checkNode } from '@/utils/validate';
import Empty from '@/components/Empty';

export default {
  name: 'AdminList',
  components: {
    Empty,
  },
  data() {
    return {
      queryAdminForm: {
        name: '',
        mobile: '',
        page: 1,
        size: 10,
        factory_id: '',
      },
      loading: false,
      hidePagination: true,
      admins: [],
      total: 0,
    };
  },
  created() {
    this.queryAdminForm.factory_id = this.currentFactoryId;

    this.queryAdmin();
  },
  methods: {
    queryAdmin() {
      this.loading = true;
      adminList(this.queryAdminForm)
        .then((response) => {
          this.loading = false;
          if (response.status === 200) {
            this.admins = response.data.data;
            this.total = response.data.total;
            this.hidePagination = this.total != 0;
          }
        })
        .catch((_) => {
          this.loading = false;
        });
    },
    resetQuery() {
      this.queryAdminForm.page = 1;
      this.queryAdmin();
    },
    toAddAdmin() {
      this.$router.push({ path: '/system/admin/add' });
    },
    handleEdit(index, row) {
      this.$router.push({ name: 'adminEdit', params: { id: row.id } });
    },
    handleDelete(index, row) {
      this.$confirm('当前操作将删除管理员（' + row.name + '）, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteAdmin({ userId: row.id }).then((response) => {
          if (response.status === 1) {
            this.queryAdmin();
          }
        });
      });
    },
    handleSizeChange(val) {
      this.queryAdminForm.size = val;
      this.queryAdmin();
    },
    handleCurrentChange(val) {
      this.queryAdminForm.page = val;
      this.queryAdmin();
    },
    indexMethod(index) {
      return index + (this.queryAdminForm.page - 1) * this.queryAdminForm.size + 1;
    },
    checkNode(node) {
      return checkNode(node);
    },
  },
};
</script>
