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

      <el-form-item v-if="checkNode('add_research_group_account_auth')" class="right">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd(0)">添加账户授权</el-button>
      </el-form-item>
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <el-table-column prop="research_group_account_name" label="课题组账号" />
      <el-table-column prop="user_name" label="已授权用户" />
      <el-table-column prop="factory_id" label="单位">
        <template slot-scope="scope">
          {{getFactoryName(scope.row.factory_id)}}
        </template>
      </el-table-column>
      <el-table-column v-if="checkNode('delete_research_group')" width="180" label="操作">
        <template slot-scope="scope">
          <el-button v-if="checkNode('delete_research_group') && scope.row.is_deleted === 0" size="mini" type="danger"
            @click="handleDelete(scope.row, 1)">解除权限</el-button>
          <el-button v-if="checkNode('delete_research_group') && scope.row.is_deleted === 1" size="mini" type="info"
            @click="handleDelete(scope.row, 0)">恢复</el-button>
        </template>
      </el-table-column>
      <div slot="empty">
        <empty />
      </div>
    </el-table>
    <el-pagination class="dl-pagination" :hide-on-single-page="true" background :page-sizes="[10, 30, 50]"
      layout="total, prev, pager, next, sizes, jumper" :total="total" :current-page="queryForm.page"
      :page-size="queryForm.size" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>
</template>
<script>
  import {
    researchGroupAccountAuthList,
    deleteResearchGroupAccountAuth
  } from '@/api/research';
  import {
    checkNode
  } from '@/utils/validate';
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
          name: '',
          is_deleted: '',
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
        researchGroupAccountAuthList(this.queryForm)
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
      handleDelete(row, status) {
        const text = status === 0 ? '恢复' : '解除';
        this.$confirm('确定要' + text + '[' + row.user_name + ']的授权吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          deleteResearchGroupAccountAuth({
            id: row.id,
            is_deleted: status,
          }).then((response) => {
            if (response.status === 1) {
              this.queryList();
            }
          });
        });
      },
      toAdd(id = '') {
        if (!id) {
          this.$router.push({
            path: '/research-group-account-auth/add',
          });
        } else {
          this.$router.push({
            path: '/research-group-account-auth/edit/' + id,
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
