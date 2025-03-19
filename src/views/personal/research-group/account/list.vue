<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="课题组">
        <el-select
          v-model="queryForm.research_group_id"
          :clearable="true"
          size="small"
          class="max-width-150"
          placeholder="课题组"
        >
          <el-option v-for="item in research" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="queryForm.name" class="max-width-150" size="small" clearable />
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
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="research_group_name" label="课题组" />
      <el-table-column prop="amount" label="余额/元" />
      <!-- <el-table-column label="状态">
            <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.is_deleted === 0">正常</el-tag>
                <el-tag type="danger" v-if="scope.row.is_deleted === 1">已删除</el-tag>
            </template>
        </el-table-column> -->
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
  frontResearchGroupAccountList,
  frontResearchGroupList,
  deleteResearchGroupAccount,
  researchGroupAccountRecharge,
} from '@/api/research';
import { checkNode } from '@/utils/validate';
import Empty from '@/components/Empty';
import { checkGtZero } from '@/utils/validate';

export default {
  components: {
    Empty,
  },
  data() {
    return {
      loading: false,
      dialogFormVisible: false,
      queryForm: {
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        name: '',
        is_deleted: '',
        research_group_id: '',
        factory_id: '',
      },
      rechargeForm: {
        research_group_account_id: '',
        amount: '',
        note: '',
      },
      rules: {
        amount: [
          {
            required: true,
            message: '请输入充值金额',
            trigger: 'blur',
          },
          { validator: checkGtZero, trigger: 'blur' },
        ],
      },
      research: [],
      currentAccount: {},
      list: [],
      total: 0,
    };
  },
  created() {
    this.queryForm.factory_id = this.currentFactoryId;
    this.queryList();
    this.queryResearchList();
  },
  methods: {
    queryList() {
      this.loading = true;
      frontResearchGroupAccountList(this.queryForm)
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
    submit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          researchGroupAccountRecharge(this.rechargeForm).then((response) => {
            if (response.status === 1) {
              this.dialogFormVisible = false;
              this.queryList();
            }
          });
        } else {
          return false;
        }
      });
    },
    handleDelete(row, status) {
      const text = status === 0 ? '恢复' : '删除';
      this.$confirm('确定要' + text + '课题组"' + row.name + '"吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteResearchGroupAccount({
          id: row.id,
          is_deleted: status,
        }).then((response) => {
          if (response.status === 1) {
            this.queryList();
          }
        });
      });
    },
    queryResearchList() {
      frontResearchGroupList({
        page: 1,
        size: 100,
        is_deleted: 0,
        is_admin: 1,
      }).then((res) => {
        if (res.status === 200) {
          this.research = res.data.data;
        }
      });
    },
    toRecharge(row) {
      this.currentAccount = row;
      this.rechargeForm.research_group_account_id = row.id;
      this.rechargeForm.amount = '';
      this.dialogFormVisible = true;
    },
    toAdd(id = '') {
      if (!id) {
        this.$router.push({
          path: '/personal/research-group-account/add',
        });
      } else {
        this.$router.push({
          path: '/personal/research-group-account/edit/' + id,
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
<style lang="scss"></style>
