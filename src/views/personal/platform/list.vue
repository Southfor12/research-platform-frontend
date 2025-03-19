<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="admin_name" label="负责人姓名" />
      <el-table-column prop="admin_mobile" label="负责人手机号" />
      <el-table-column prop="factory_id" label="单位">
        <template slot-scope="scope">
          {{getFactoryName(scope.row.factory_id)}}
        </template>
      </el-table-column>
      <el-table-column width="220" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="toEdit(scope.row.id)">入室规则</el-button>
          <div style="margin-top: 10px">
            <el-button size="mini" type="success" @click="toScoreList(scope.row)"
              >评分列表</el-button
            >
          </div>
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
    <el-dialog
      :title="queryScoreForm.platform_name + '的评分'"
      :modal="false"
      :visible.sync="dialogScoreVisible"
      :fullscreen="true"
    >
      <grade
        v-if="dialogScoreVisible"
        :target_type="2"
        :target_id="queryScoreForm.platform_id"
        :source_type="1"
        :source_id="0"
        :platform_name="queryScoreForm.platform_name"
        :add_auth="0"
        :edit_auth="0"
        :delete_auth="0"
      />
    </el-dialog>
  </div>
</template>
<script>
import { frontPlatformList, deletePlatform } from '@/api/platform';
import { checkNode } from '@/utils/validate';
import Grade from '@/components/Grade';
import Empty from '@/components/Empty';

export default {
  components: {
    Grade,
    Empty,
  },
  data() {
    return {
      loading: false,
      dialogScoreVisible: false,
      queryForm: {
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        name: '',
        admin_id: '',
        parent_id: '',
        type: '',
        is_deleted: '',
      },
      queryScoreForm: {
        user_id: '',
        platform_id: '',
        platform_name: '',
        user_name: '',
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
      frontPlatformList(this.queryForm)
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
      const text = status === 0 ? '恢复' : '删除';
      this.$confirm('确定要' + text + '"' + row.name + '"吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deletePlatform({
          platform_id: row.id,
          is_deleted: status,
        }).then((response) => {
          if (response.status === 1) {
            this.queryList();
          }
        });
      });
    },
    toScoreList(row) {
      this.scoreList = [];
      this.queryScoreForm.platform_id = row.id;
      this.queryScoreForm.platform_name = row.name;
      this.dialogScoreVisible = true;
    },
    toEdit(id = '') {
      if (!id) {
        this.$router.push({ path: '/personal/platform/add' });
      } else {
        this.$router.push({ path: '/personal/platform/edit/' + id });
      }
    },
    toFinance(id) {
      this.$router.push({ path: '/personal/platform/finance/' + id });
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
  },
};
</script>
<style lang="scss"></style>
