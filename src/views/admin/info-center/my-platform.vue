<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <!-- <el-form :inline="true" :model="queryForm">
            <el-form-item label="子平台/实验室">
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
            </el-form-item>
             <el-form-item v-if="checkNode('add_platform_user')" class="right">
                <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd(0)">添加子平台/实验室成员</el-button>
            </el-form-item>
        </el-form> -->
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <el-table-column prop="platform_id" label="实验室ID" />
      <el-table-column prop="platform_name" label="实验室名称" />
      <el-table-column prop="user_name" label="姓名" />
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
      <el-table-column width="180" label="操作">
        <template slot-scope="scope">
          <div>
            <el-button size="mini" type="success" @click="toScoreList(scope.row)"
              >我的评分</el-button
            >
          </div>
          <div style="margin-top: 10px">
            <el-button size="mini" type="primary" @click="showUserList(scope.row)"
              >课题组成员</el-button
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
    <el-dialog title="我的评分" :visible.sync="dialogScoreVisible">
      <el-form :inline="true">
        <el-form-item label="实验室">
          {{ queryScoreForm.platform_name }}
        </el-form-item>
      </el-form>
      <el-table
        :header-cell-style="{ background: '#fafafa' }"
        :data="scoreList"
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="date" label="评分日期" />
        <el-table-column prop="total_score" label="得分" />
        <el-table-column prop="max_score" label="总分" />
        <el-table-column label="得分率">
          <template slot-scope="scope"> {{ scope.row.total_score_100 }}% </template>
        </el-table-column>
        <div slot="empty">
          <empty />
        </div>
      </el-table>
      <el-pagination
        class="dl-pagination"
        :hide-on-single-page="true"
        background
        layout="total, prev, pager, next, jumper"
        :total="scoreTotal"
        :current-page="queryScoreForm.page"
        :page-size="queryScoreForm.size"
        @current-change="handleScoreChange"
      />
    </el-dialog>
    <el-dialog title="成员列表" :visible.sync="dialogVisible">
      <el-form :inline="true">
        <el-form-item label="实验室">
          {{ queryUserForm.platform_name }}
        </el-form-item>
      </el-form>
      <el-table :header-cell-style="{ background: '#fafafa' }" :data="userList" style="width: 100%">
        <el-table-column width="100px" type="index" :index="indexMethod1" label="序号" />
        <el-table-column prop="user_name" label="姓名" />
        <el-table-column prop="user_mobile" label="手机号" />
      </el-table>
      <el-pagination
        class="dl-pagination"
        :hide-on-single-page="true"
        background
        layout="total, prev, pager, next, jumper"
        :total="userTotal"
        :current-page="queryUserForm.page"
        :page-size="queryUserForm.size"
        @current-change="handleUserChange"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { platformList, platformUserList, platformScoreRecordList } from '@/api/platform';
import { checkNode } from '@/utils/validate';
import { mapGetters } from 'vuex';
import Empty from '@/components/Empty';

export default {
  components: {
    Empty,
  },
  computed: {
    ...mapGetters(['member']),
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      dialogScoreVisible: false,
      queryForm: {
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        is_deleted: 0,
        platform_id: '',
        user_id: '',
        name: '',
      },
      queryScoreForm: {
        page: 1,
        size: 10,
        user_id: '',
        platform_id: '',
        platform_name: '',
        is_deleted: 0,
      },
      queryUserForm: {
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        is_deleted: 0,
        platform_id: '',
        platform_name: '',
      },
      scoreTotal: 0,
      domain: process.env.VUE_APP_DOMAIN,
      list: [],
      userList: [],
      scoreList: [],
      platforms: [],
      total: 0,
      userTotal: 0,
    };
  },
  created() {
    this.queryForm.user_id = this.member.id;
    this.queryScoreForm.user_id = this.member.id;
    this.queryList();
  },
  methods: {
    queryList() {
      this.loading = true;
      platformUserList(this.queryForm)
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
    queryScoreList() {
      platformScoreRecordList(this.queryScoreForm).then((res) => {
        if (res.status === 200) {
          this.scoreList = res.data.data;
          this.scoreTotal = res.data.total;
        }
      });
    },
    resetQuery() {
      this.queryForm.page = 1;
      this.queryList();
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
      platformList({ page: 1, size: 100, is_deleted: 0 }).then((res) => {
        if (res.status === 200) {
          this.platforms = res.data.data;
        }
      });
    },
    showUserList(row) {
      this.userList = [];
      this.queryUserForm.page = 1;
      this.queryUserForm.platform_name = row.platform_name;
      this.queryUserForm.platform_id = row.platform_id;
      this.queryUserList();
      this.dialogVisible = true;
    },
    queryUserList() {
      platformUserList(this.queryUserForm).then((res) => {
        if (res.status === 200) {
          this.userList = res.data.data;
          this.userTotal = res.data.total;
        }
      });
    },
    toScoreList(row) {
      this.scoreList = [];
      this.queryScoreForm.page = 1;
      this.queryScoreForm.platform_id = row.platform_id;
      this.queryScoreForm.platform_name = row.platform_name;
      this.queryScoreList();
      this.dialogScoreVisible = true;
    },
    handleSizeChange(val) {
      this.queryForm.size = val;
      this.queryList();
    },
    handleCurrentChange(val) {
      this.queryForm.page = val;
      this.queryList();
    },
    handleScoreChange(val) {
      this.queryScoreForm.page = val;
      this.queryScoreList();
    },
    checkNode(node) {
      return checkNode(node);
    },
    indexMethod(index) {
      return index + (this.queryForm.page - 1) * this.queryForm.size + 1;
    },
    indexMethod1(index) {
      return index + (this.queryUserForm.page - 1) * this.queryUserForm.size + 1;
    },
  },
};
</script>
