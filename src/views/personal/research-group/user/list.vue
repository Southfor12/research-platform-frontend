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
      <el-form-item label="是否管理员">
        <el-select
          v-model="queryForm.is_admin"
          :clearable="true"
          size="small"
          class="max-width-150"
          placeholder="是否管理员"
        >
          <el-option label="是" value="1"></el-option>
          <el-option label="否" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="queryForm.status"
          :clearable="true"
          size="small"
          class="max-width-150"
          placeholder="状态"
        >
          <el-option label="审核中" value="0"></el-option>
          <el-option label="已通过" value="1"></el-option>
          <el-option label="未通过" value="-1"></el-option>
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
      <el-table-column prop="research_group_name" label="课题组名称" />
      <el-table-column prop="user_name" label="用户姓名" />
      <el-table-column prop="user_mobile" label="用户手机号" />
      <el-table-column label="联系人">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.is_admin == 0">不是</el-tag>
          <el-tag v-else>是</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status === 1">已通过</el-tag>
          <el-tag type="info" v-if="scope.row.status === 0">待审核</el-tag>
          <el-tag type="danger" v-if="scope.row.status === -1">未通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="factory_id" label="单位">
        <template slot-scope="scope">
          {{getFactoryName(scope.row.factory_id)}}
        </template>
      </el-table-column>
      <el-table-column width="300" label="操作">
        <template slot-scope="scope">
          <el-form :inline="true">
            <el-form-item
              v-if="
                scope.row.user_id !== member.id &&
                scope.row.plamtform_admin_id !== scope.row.user_id &&
                scope.row.research_group_leader_id !== scope.row.user_id
              "
              style="margin-bottom: 0"
            >
              <el-button
                v-if="scope.row.is_admin === 1"
                size="mini"
                type="danger"
                @click="handleSetAdmin(scope.row, 0)"
                >解除联系人</el-button
              >
              <el-button
                v-if="scope.row.is_admin === 0"
                size="mini"
                type="primary"
                @click="handleSetAdmin(scope.row, 1)"
                >设为联系人</el-button
              >
            </el-form-item>
            <el-form-item
              v-if="
                scope.row.user_id !== member.id &&
                scope.row.plamtform_admin_id !== scope.row.user_id &&
                scope.row.research_group_leader_id !== scope.row.user_id &&
                scope.row.status != 1
              "
              style="margin-bottom: 0"
            >
              <el-button size="mini" @click="audit(scope.row)">审核</el-button>
              <!-- <el-select size="small" class="max-width-80" v-model="verifyArr[scope.$index]" @visible-change="handleAudit($event, scope)"
                placeholder="审核">
                <el-option v-if="scope.row.status === 0 || scope.row.status === -1" label="通过" value="1"></el-option>
                <el-option v-if="scope.row.status === 1 || scope.row.status === 0" label="拒绝" value="-1"></el-option>
              </el-select> -->
            </el-form-item>
          </el-form>
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
      :modal="false"
      :visible.sync="dialogScoreVisible"
      :fullscreen="true"
    >
      <grade
        v-if="dialogScoreVisible"
        :target_type="1"
        :target_id="queryScoreForm.user_id"
        :source_type="3"
        :source_id="queryScoreForm.group_id"
        :user_name="queryScoreForm.user_name"
        :add_auth="1"
        :edit_auth="1"
        :delete_auth="1"
      />
    </el-dialog>

    <el-dialog
      :title="'加入[' + this.researchGroupName + ']课题组审核'"
      :visible.sync="showAudit"
      width="80%"
    >
      <el-form ref="audit_form" label-width="80px">
        <el-form-item label="姓名">
          {{ user.name }}
        </el-form-item>
        <el-form-item label="手机号">
          <span>{{ user.mobile }}</span>
        </el-form-item>
        <el-form-item label="用户来源">
          <el-tag>{{ user.is_inner == 1 ? '院内人员' : '院外人员' }}</el-tag>
        </el-form-item>
        <el-form-item label="用户类型" v-if="user.is_inner">
          <el-tag>{{ user.type == 1 ? '职工' : '学生' }}</el-tag>
        </el-form-item>
        <el-form-item :label="user.type == 1 ? '职工号' : '学生号'" v-if="user.is_inner == 1">
          <span>{{ user.no }}</span>
        </el-form-item>
        <el-form-item label="课题名称" v-if="user.type != 2">
          <span>{{ user.research_group_name }}</span>
        </el-form-item>
        <el-form-item label="所属科研组室" v-if="user.is_inner == 1">
          <span>{{ user.platform_name }}</span>
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="note" type="textarea" :rows="5"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="doAudit(-1)">拒绝</el-button>
        <el-button type="primary" @click="doAudit(1)">通过</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  frontResearchGroupUserList,
  frontResearchGroupList,
  researchGroupUserAudit,
  researchGroupUserSetAdmin,
} from '@/api/research';
import { userInfo } from '@/api/user';
import { checkNode } from '@/utils/validate';

import { mapGetters } from 'vuex';
import Grade from '@/components/Grade';
import Empty from '@/components/Empty';

export default {
  components: {
    Empty,
    Grade,
  },
  computed: {
    ...mapGetters(['member']),
  },
  data() {
    return {
      researchGroupName: '',
      showAudit: false,
      loading: false,
      dialogScoreVisible: false,
      queryForm: {
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        status: '',
        is_admin: '',
        research_group_id: '',
        factory_id: '',
      },
      queryScoreForm: {
        user_id: '',
        user_name: '',
        group_id: '',
        group_name: '',
        is_deleted: 0,
      },
      list: [],
      research: [],
      verifyArr: new Array(),
      total: 0,
      user: {},
      note: '',
      researchGroupUser: {},
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
      frontResearchGroupUserList(this.queryForm)
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
    handleSetAdmin(row, status) {
      const text = status === 0 ? '解除' : '设置';
      this.$confirm('确定要' + text + '联系人"' + row.user_name + '"吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        researchGroupUserSetAdmin({
          research_group_user_id: row.id,
          is_admin: status,
        }).then((response) => {
          if (response.status === 1) {
            this.queryList();
          }
        });
      });
    },
    getType(type) {
      switch (type) {
        case 1:
          return '科研组室';
        case 2:
          return '课题组';
        case 3:
          return '科研个人账户';
      }
    },
    toScoreList(row) {
      this.scoreList = [];
      this.queryScoreForm.user_id = row.user_id;
      this.queryScoreForm.user_name = row.user_name;
      this.queryScoreForm.group_id = row.research_group_id;
      this.queryScoreForm.group_name = row.name;
      this.dialogScoreVisible = true;
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
    //点击审核按钮触发的函数
    audit(data) {
      this.showAudit = true;
      this.note = '';
      this.researchGroupName = data.research_group_name;
      this.researchGroupUser = data;
      userInfo({
        id: data.user_id,
      }).then((res) => {
        this.user = res.data;
      });
    },
    //审核通过或拒绝触发函数
    doAudit(status) {
      const text = status == 1 ? '通过' : '拒绝';
      this.$confirm('确定要' + text + this.researchGroupUser.user_name + '的申请吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          researchGroupUserAudit({
            research_group_user_id: this.researchGroupUser.id,
            status: status,
            note: this.note,
          }).then((response) => {
            if (response.status === 1) {
              this.showAudit = false;
              this.researchGroupUser = {};
              this.researchGroupName = '';
              this.note = '';
              this.queryList();
            }
          });
        })
        .catch((e) => {
          //取消
        });
    },
    handleAudit(flag, scope) {
      if (!flag && this.verifyArr[scope.$index]) {
        const status = this.verifyArr[scope.$index];
        const text = status == 1 ? '通过' : '拒绝';
        this.$confirm('确定要' + text + scope.row.user_name + '的申请吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          researchGroupUserAudit({
            research_group_user_id: scope.row.id,
            status: status,
          }).then((response) => {
            if (response.status === 1) {
              this.queryList();
            }
          });
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
