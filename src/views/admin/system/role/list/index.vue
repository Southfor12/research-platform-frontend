<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" @submit.native.prevent>
      <el-form-item label="角色名">
        <el-input v-model="queryParams.roleName" class="max-width-200" size="small" clearable />
      </el-form-item>
     <!-- <el-form-item label="单位">
        <el-select
          v-model="queryParams.factory_id"
          :clearable="false"
          size="small"
          class="max-width-150"
          placeholder="单位"
        >
          <el-option :label="factory.name" :value="factory.id" :key="idx" v-for="(factory,idx) in getSelectableFactories()"></el-option>
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="角色类型">
        <el-select v-model="queryParams.roleType" clearable size="small" class="max-width-150" filterable placeholder="请选择角色类型">
          <el-option
            v-for="item in roleOptions"
            :key="item.id"
            :label="item.type"
            :value="item.id"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button class="search-btn" round size="small" @click="handleRoleList">查 询</el-button>
      </el-form-item>
      <el-button
        v-if="checkNode('add_role')"
        class="right"
        size="small"
        type="primary"
        icon="el-icon-plus"
        @click="createRole"
        >新建角色</el-button
      >
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="roles" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <el-table-column prop="role_name" label="角色名" />
      <!-- <el-table-column
        prop="type_name"
        label="角色类型"
      /> -->
      <!-- <el-table-column prop="factory_id" label="单位">
        <template slot-scope="scope">
          {{getFactoryName(scope.row.factory_id)}}
        </template>
      </el-table-column> -->
      <el-table-column prop="id" label="ID">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkNode('edit_role') || checkNode('delete_role')"
        width="180"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            v-if="checkNode('edit_role')"
            size="mini"
            type="text"
            @click="handleEdit(scope.$index, scope.row)"
            >修改</el-button
          >
          <el-button
            v-if="checkNode('delete_role') && !scope.row.code"
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
        :current-page="queryParams.page"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { loginRoles, roleList, deleteRole } from '@/api/system';
import { checkNode } from '@/utils/validate';
import Empty from '@/components/Empty';

export default {
  name: 'AdminList',
  components: {
    Empty,
  },
  data() {
    return {
      total: 0,
      roles: [],
      loading: false,
      hidePagination: true,
      // roleOptions: [],
      queryParams: {
        page: 1,
        size: 10,
        roleName: '',
        roleType: '',
        factory_id: '',
      },
    };
  },
  created() {
    this.queryParams.factory_id = this.currentFactoryId;
    this.handleRoleList();
    // loginRoles().then(response => {
    //   this.roleOptions = response.data
    // })
  },
  methods: {
    handleRoleList() {
      this.loading = true;
      roleList(this.queryParams)
        .then((response) => {
          this.loading = false;
          this.roles = response.data.data;
          this.total = response.data.count;
          this.hidePagination = this.total != 0;
        })
        .catch((_) => {
          this.loading = false;
        });
    },
    handleEdit(index, row) {
      this.$router.push({ name: 'roleEdit', params: { id: row.id } });
    },
    handleDelete(index, row) {
      this.$confirm('当前操作将删除角色（' + row.role_name + '）, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteRole({ id: row.id }).then((response) => {
          if (response.status === 1) {
            this.handleRoleList();
          }
        });
      });
    },
    handleSizeChange(val) {
      this.queryParams.size = val;
      if (this.total / this.queryParams.size > this.queryParams.page) this.handleRoleList();
    },
    handleCurrentChange(val) {
      this.queryParams.page = val;
      this.handleRoleList();
    },
    createRole() {
      this.$router.push({ path: '/system/role/add' });
    },
    indexMethod(index) {
      return index + (this.queryParams.page - 1) * this.queryParams.size + 1;
    },
    checkNode(node) {
      return checkNode(node);
    },
  },
};
</script>
