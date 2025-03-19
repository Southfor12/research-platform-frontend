<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryForm">
      <!-- <el-form-item label="子平台/实验室">
                <el-select v-model="queryForm.platform_id" :clearable="true" size="small" class="max-width-150" placeholder="子平台/实验室">
                    <el-option
                        v-for="item in platforms"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button round size="small" @click="resetQuery">查询</el-button>
            </el-form-item> -->
      <el-form-item label="姓名">
        {{ queryForm.user_name }}
      </el-form-item>
      <el-form-item label="实验室">
        {{ queryForm.platform_name }}
      </el-form-item>
      <el-form-item v-if="checkNode('add_platform_score_record')" class="right">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd(0)"
          >添加评分</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="date" label="评分日期" />
      <el-table-column prop="total_score" label="得分" />
      <el-table-column prop="max_score" label="总分" />
      <el-table-column label="得分率">
        <template slot-scope="scope"> {{ scope.row.total_score_100 }}% </template>
      </el-table-column>
      <el-table-column
        v-if="checkNode('edit_platform_score_record') || checkNode('delete_platform_score_record')"
        width="180"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            v-if="checkNode('edit_platform_score_record')"
            size="mini"
            type="primary"
            @click="toAdd(scope.row.id)"
            >修改</el-button
          >
          <el-button
            v-if="checkNode('delete_platform_score_record') && scope.row.is_deleted === 0"
            size="mini"
            type="danger"
            @click="handleDelete(scope.row, 1)"
            >删除</el-button
          >
          <el-button
            v-if="checkNode('delete_platform_score_record') && scope.row.is_deleted === 1"
            size="mini"
            type="info"
            @click="handleDelete(scope.row, 0)"
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
      :page-size="queryForm.size"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import {
  platformScoreRecordList,
  platformUserInfo,
  deletePlatformScoreRecord,
} from '@/api/platform';
import { checkNode } from '@/utils/validate';
import Empty from '@/components/Empty';

export default {
  components: {
    Empty,
  },
  data() {
    return {
      queryInfoForm: {
        id: '',
        is_deleted: 0,
      },
      queryForm: {
        page: 1,
        size: 10,
        user_id: '',
        platform_id: '',
        user_name: '',
        platform_name: '',
        is_deleted: 0,
      },
      loading: false,
      list: [],
      total: 0,
    };
  },
  created() {
    if (this.$route.params.platform_user_id) {
      this.getInfo();
    } else {
      this.$router.push({ path: '/platform-user/list' });
    }
  },
  methods: {
    getInfo() {
      this.queryInfoForm.id = this.$route.params.platform_user_id;
      platformUserInfo(this.queryInfoForm)
        .then((res) => {
          if (res.status === 200) {
            this.queryForm.user_id = res.data.user_id;
            this.queryForm.platform_id = res.data.platform_id;
            this.queryForm.user_name = res.data.user_name;
            this.queryForm.platform_name = res.data.platform_name;
            localStorage.setItem('score-list-id', this.queryInfoForm.id);
            this.queryList();
          } else {
            this.$router.push({ path: '/platform-user/list' });
          }
        })
        .catch((_) => {
          this.$router.push({ path: '/platform-user/list' });
        });
    },
    queryList() {
      this.loading = true;
      platformScoreRecordList(this.queryForm)
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
    handleDelete(row, status) {
      this.$confirm('确定要删除该评分吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deletePlatformScoreRecord({
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
          path: '/platform-score-record/add/' + this.queryInfoForm.id,
        });
      } else {
        this.$router.push({ path: '/platform-score-record/edit/' + id });
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
    checkNode(node) {
      return checkNode(node);
    },
  },
};
</script>
