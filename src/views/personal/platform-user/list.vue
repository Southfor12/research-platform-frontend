<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="子平台/实验室">
        <el-select
          v-model="queryForm.platform_id"
          :clearable="true"
          size="small"
          class="max-width-150"
          placeholder="子平台/实验室"
        >
          <el-option v-for="item in platforms" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button round size="small" @click="resetQuery">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <el-table-column prop="platform_name" label="实验室名称" />
      <el-table-column label="姓名">
        <template slot-scope="scope">
          {{ scope.row.user_name }}
          <el-tag v-if="scope.row.user_id === scope.row.platform_admin_id">负责人</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="可携带危化品">
        <template slot-scope="scope">
          {{ scope.row.hcses ? scope.row.hcses : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="过期时间">
        <template slot-scope="scope">
          {{ dateFormat(scope.row.expired_at) }}
        </template>
      </el-table-column>
      <el-table-column prop="score" label="总评分" />
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
      <el-table-column prop="factory_id" label="单位">
        <template slot-scope="scope">
          {{getFactoryName(scope.row.factory_id)}}
        </template>
      </el-table-column>
      <el-table-column width="180" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="toAdd(scope.row.id)">修改</el-button>
          <el-button
            v-if="scope.row.is_deleted === 0 && scope.row.user_id !== scope.row.platform_admin_id"
            size="mini"
            type="danger"
            @click="handleDelete(scope.row, 1)"
            >删除</el-button
          >
          <el-button
            v-if="scope.row.is_deleted === 1"
            size="mini"
            type="info"
            @click="handleDelete(scope.row, 0)"
            >恢复</el-button
          >
          <!-- <div style="margin-top: 10px;">
                    <el-button
                        size="mini"
                        type="success"
                        @click="toScoreList(scope.row)"
                    >评分列表</el-button>
                </div> -->
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
      :title="queryScoreForm.user_name + '的评分'"
      :fullscreen="true"
      :visible.sync="dialogScoreVisible"
    >
      <grade
        v-if="dialogScoreVisible"
        :target_type="1"
        :target_id="queryScoreForm.user_id"
        :source_type="2"
        :source_id="queryScoreForm.platform_id"
        :user_name="queryScoreForm.user_name"
        :add_auth="1"
        :edit_auth="1"
        :delete_auth="1"
      />
    </el-dialog>
  </div>
</template>
<script>
import {
  frontPlatformList,
  frontPlatformUserList,
  deletePlatformUser,
  platformScoreRecordList,
  deletePlatformScoreRecord,
} from '@/api/platform';
import { checkNode } from '@/utils/validate';
import Grade from '@/components/Grade';
import Empty from '@/components/Empty';

export default {
  components: {
    Empty,
    Grade,
  },
  data() {
    return {
      loading: false,
      dialogScoreVisible: false,
      queryForm: {
        page: 1,
        size: 10,
        platform_id: '',
        name: '',
      },
      queryScoreForm: {
        page: 1,
        size: 10,
        user_id: '',
        platform_id: '',
        platform_name: '',
        user_name: '',
        platform_user_id: '',
        is_deleted: 0,
      },
      scoreList: [],
      scoreTotal: 0,
      domain: process.env.VUE_APP_DOMAIN,
      list: [],
      platforms: [],
      total: 0,
    };
  },
  created() {
    this.queryList();
    this.getPlatforms();
  },
  methods: {
    queryList() {
      this.loading = true;
      frontPlatformUserList(this.queryForm)
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
    handleDeleteScore(row, status) {
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
            this.queryScoreList();
          }
        });
      });
    },
    handleDelete(row, status) {
      this.$confirm('确定要删除该成员吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deletePlatformUser({ id: row.id, is_deleted: status }).then((response) => {
          if (response.status === 1) {
            this.queryList();
          }
        });
      });
    },
    dateFormat(time) {
      return time.substring(0, 10);
    },
    getPlatforms() {
      frontPlatformList({ page: 1, size: 100, is_deleted: 0 }).then((res) => {
        if (res.status === 200) {
          this.platforms = res.data.data;
        }
      });
    },
    toAdd(id = '') {
      if (!id) {
        this.$router.push({ path: '/personal/platform-user/add' });
      } else {
        this.$router.push({
          path: '/personal/platform-user/edit/' + id,
        });
      }
    },
    toAddScore(id = '') {
      var path = '';
      if (!id) {
        path = '/personal/platform-score-record/add/' + this.queryScoreForm.platform_user_id;
        window.open(path);
      } else {
        path = '/personal/platform-score-record/edit/' + id;
        window.open(path);
      }
    },
    toScoreList(row) {
      this.scoreList = [];
      this.queryScoreForm.user_name = row.user_name;
      this.queryScoreForm.platform_user_id = row.id;
      this.queryScoreForm.user_id = row.user_id;
      this.queryScoreForm.page = 1;
      this.queryScoreForm.platform_id = row.platform_id;
      this.queryScoreForm.platform_name = row.platform_name;
      this.dialogScoreVisible = true;
    },
    queryScoreList() {
      platformScoreRecordList(this.queryScoreForm).then((res) => {
        if (res.status === 200) {
          this.scoreList = res.data.data;
          this.scoreTotal = res.data.total;
        }
      });
    },
    handleScoreChange(val) {
      this.queryScoreForm.page = val;
      this.queryScoreList();
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
    scoreIndexMethod(index) {
      return index + (this.queryScoreForm.page - 1) * this.queryScoreForm.size + 1;
    },
    checkNode(node) {
      return checkNode(node);
    },
  },
};
</script>
