<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="姓名">
        <el-input v-model="queryForm.name" class="max-width-150" size="small" clearable />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="queryForm.mobile" class="max-width-150" size="small" clearable />
      </el-form-item>
      <el-form-item label="类型">
        <el-select
          v-model="queryForm.is_inner"
          :clearable="true"
          size="small"
          class="max-width-150"
          placeholder="用户类型"
        >
          <el-option label="院内" value="1"></el-option>
          <el-option label="院外" value="0"></el-option>
        </el-select>
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
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column width="180px" label="身份证号">
        <template slot-scope="scope">{{ scope.row.id_card ? scope.row.id_card : '-' }}</template>
      </el-table-column>
      <el-table-column label="类型">
        <template slot-scope="scope">{{ getType(scope.row.is_inner) }}</template>
      </el-table-column>
      <!-- <el-table-column
            prop="mentor_name"
            label="导师姓名"
        /> -->
      <!-- <el-table-column label="信用分">
            <template slot-scope="scope">
                <el-button @click="toScoreList(scope.row)" type="text">{{ scope.row.credit_score }}</el-button>
            </template>
        </el-table-column> -->
      <!-- <el-table-column label="状态">
            <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.status === 1">已通过</el-tag>
                <el-tag type="info" v-if="scope.row.status === 0">待审核</el-tag>
                <el-tag type="danger" v-if="scope.row.status === -1">未通过</el-tag>
            </template>
        </el-table-column> -->
      <el-table-column prop="factory_id" label="单位">
        <template slot-scope="scope">
          {{getFactoryName(scope.row.factory_id)}}
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkNode('admin_verify_do') || checkNode('edit_verify_user')"
        width="200"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="toScoreList(scope.row)">评分列表</el-button>
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
    <!-- <el-dialog :title="queryScoreForm.user_name + '的信用分记录'" :fullscreen="true" :visible.sync="dialogScoreVisible">
            <el-table
            :header-cell-style="{background:'#fafafa'}"
            :data="scoreList"
            style="width: 100%"
            >
                <el-table-column width="100px" type="index" :index="scoreIndexMethod" label="序号" />
                <el-table-column width="100px" prop="user_name" label="姓名" />
                <el-table-column width="100px" prop="score" label="分值" />
                <el-table-column width="100px" label="类型">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.type === 1">奖励</el-tag>
                        <el-tag v-else type="danger">扣分</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="note" min-width="200px" label="描述" />
                <el-table-column prop="created_at" label="时间" />
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
        </el-dialog> -->
    <el-dialog
      :title="queryScoreForm.user_name + '的评分'"
      :modal="false"
      :visible.sync="dialogScoreVisible"
      :fullscreen="true"
    >
      <grade
        v-if="dialogScoreVisible"
        :target_type="1"
        :target_id="queryScoreForm.user_id"
        :source_type="1"
        :source_id="0"
        :user_name="queryScoreForm.user_name"
        :add_auth="1"
        :edit_auth="1"
        :delete_auth="1"
      />
    </el-dialog>
  </div>
</template>
<script>
import { platformScoreRecordList } from '@/api/platform';
import { userList, userScoreList, audit } from '@/api/user';
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
        sort: 'created_at',
        sort_type: 'desc',
        mobile: '',
        name: '',
        is_inner: '',
        mentor_name: '',
        status: 1,
        factory_id: '',
      },
      queryScoreForm: {
        user_id: '',
        user_name: '',
      },
      list: [],
      scoreList: [],
      verifyArr: new Array(),
      total: 0,
      scoreTotal: 0,
    };
  },
  created() {
    this.queryForm.factory_id = this.currentFactoryId;
    this.queryList();
  },
  methods: {
    queryList() {
      this.loading = true;
      userList(this.queryForm)
        .then((res) => {
          this.loading = false;
          if (res.status === 200) {
            this.verifyArr = new Array(res.data.data.length);
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
    handleAudit(flag, scope) {
      if (!flag && this.verifyArr[scope.$index]) {
        const status = this.verifyArr[scope.$index];
        const text = status === '1' ? '通过' : '拒绝';
        this.$confirm('确定要' + text + scope.row.name + '的请求吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          audit({ user_id: scope.row.id, status: status }).then((response) => {
            if (response.status === 1) {
              this.queryList();
            }
          });
        });
      }
    },
    toEdit(id) {
      this.$router.push({ path: '/system/verify/edit/' + id });
    },
    toScoreList(row) {
      this.scoreList = [];
      this.queryScoreForm.user_name = row.name;
      this.queryScoreForm.user_id = row.id;
      this.dialogScoreVisible = true;
    },
    queryScoreList() {
      userScoreList(this.queryScoreForm).then((res) => {
        if (res.status === 200) {
          this.scoreList = res.data.data;
          this.scoreTotal = res.data.total;
        }
      });
    },
    getType(type) {
      switch (type) {
        case 1:
          return '院内';
        case 0:
          return '院外';
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
    handleScoreChange(val) {
      this.queryScoreForm.page = val;
      this.queryScoreList();
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
