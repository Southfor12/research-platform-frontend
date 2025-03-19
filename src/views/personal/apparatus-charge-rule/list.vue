<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="仪器">
        <el-select
          v-model="queryForm.id"
          size="small"
          clearable
          class="max-width-150"
          placeholder="输入名称搜索选择"
        >
          <el-option v-for="item in apparatus" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button round size="small" @click="resetQuery">查询</el-button>
      </el-form-item>
      <!-- <el-form-item v-if="checkNode('add_apparatus_charge_rule')" class="right">
                <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd(0)">添加计费规则</el-button>
            </el-form-item> -->
    </el-form>
    <el-table
      :header-cell-style="{ background: '#fafafa' }"
      :row-class-name="tableRowClassName"
      :data="list"
      style="width: 100%"
    >
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <el-table-column prop="name" label="仪器名称" />
      <el-table-column width="220" label="操作">
        <template slot-scope="scope">
          <!-- <el-button
                    v-if="checkNode('apparatus_charge_rule_audit') && (scope.row.status === 1 || scope.row.status === 0)"
                    size="mini"
                    type="error"
                    @click="handleAudit(scope.row, -1)"
                >拒绝</el-button>
                <el-button
                    v-if="checkNode('apparatus_charge_rule_audit') && (scope.row.status === -1 || scope.row.status === 0)"
                    size="mini"
                    type="success"
                    @click="handleAudit(scope.row, 1)"
                >通过</el-button> -->
          <el-button size="mini" type="primary" @click="toAdd(scope.row.id)"
            >修改计费规则</el-button
          >
          <!-- <el-button
                    v-if="checkNode('delete_apparatus_charge_rule') && scope.row.is_deleted === 0"
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.row, 1)"
                >删除</el-button>
                <el-button
                    v-if="checkNode('delete_apparatus_charge_rule') && scope.row.is_deleted === 1"
                    size="mini"
                    type="info"
                    @click="handleDelete(scope.row, 0)"
                >恢复</el-button> -->
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
  frontApparatusList,
  apparatusChargeRuleList,
  deleteApparatusChargeRule,
  auditApparatusChargeRule,
} from '@/api/apparatus';
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
        is_admin: 1,
        id: '',
      },
      searchApparatusForm: {
        page: 1,
        size: 30,
        is_deleted: 0,
        is_admin: 1,
        name: '',
      },
      domain: process.env.VUE_APP_DOMAIN,
      list: [],
      apparatus: [],
      total: 0,
    };
  },
  created() {
    this.queryList();
    this.getApparatus();
  },
  methods: {
    queryList() {
      this.loading = true;
      frontApparatusList(this.queryForm)
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
    handleAudit(row, status) {
      const text = status === 1 ? '通过' : '拒绝';
      this.$confirm('确定要' + text + '"' + row.creator_name + '"的计费规则吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        auditApparatusChargeRule({ id: row.id, status: status }).then((response) => {
          if (response.status === 1) {
            this.queryList();
          }
        });
      });
    },
    getApparatus() {
      frontApparatusList(this.searchApparatusForm).then((res) => {
        if (res.status === 200) {
          this.apparatus = res.data.data;
        }
      });
    },
    handleDelete(row, status) {
      const text = status === 0 ? '恢复' : '删除';
      this.$confirm('确定要' + text + '"' + row.apparatus_name + '"的计费规则吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteApparatusChargeRule({
          id: row.id,
          is_deleted: status,
        }).then((response) => {
          if (response.status === 1) {
            this.queryList();
          }
        });
      });
    },
    getTypes(type) {
      switch (type) {
        case 1:
          return '按时间收费';
        case 2:
          return '按次计费';
        case 3:
          return '按样本数计费';
      }
    },
    toAdd(id = '') {
      if (!id) {
        this.$router.push({
          path: '/personal/apparatus-charge-rule/add',
        });
      } else {
        this.$router.push({
          path: '/personal/apparatus-charge-rule/edit/' + id,
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
    tableRowClassName({ row, rowIndex }) {
      // if (rowIndex % 2 !== 0) {
      //     return 'success-row'
      // }
      return '';
    },
    checkNode(node) {
      return checkNode(node);
    },
  },
};
</script>
<style lang="scss">
.el-table .success-row {
  background: #f0f9eb;
}
</style>
