<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="审核状态">
        <el-select
          v-model="queryForm.status"
          :clearable="true"
          size="small"
          class="max-width-150"
          placeholder="审核状态"
        >
          <el-option label="待审核" value="0"></el-option>
          <el-option label="已通过" value="1"></el-option>
          <el-option label="已拒绝" value="-1"></el-option>
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
      <el-table-column prop="user.name" label="申请人">
        <template slot-scope="scope">
          {{ scope.row.user.name }}<br />
          <el-tag size="small" type="warning" v-if="scope.row.user.is_inner == 0">院外人员</el-tag>
          <el-tag v-else-if="scope.row.user.type == 1">职工</el-tag>
          <el-tag v-else-if="scope.row.user.type == 2">学生</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="申请人导师">
        <template slot-scope="scope">
          {{ scope.row.user.mentor_name || '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="项目名称" />
      <el-table-column prop="charge" label="支出经费" />
      <el-table-column prop="start_date" label="开始时间"> </el-table-column>
      <el-table-column prop="end_date" label="结束时间"> </el-table-column>
      <el-table-column label="状态" width="150">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 0">待审核</el-tag>
          <el-tag type="success" v-if="scope.row.status == 1">已通过</el-tag>
          <el-tag type="danger" v-if="scope.row.status == -1">已拒绝</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="factory_id" label="单位">
        <template slot-scope="scope">
          {{getFactoryName(scope.row.factory_id)}}
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="180" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="doShowAudit(scope.row)">审核</el-button>
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
    <el-dialog title="项目详情" width="80%" :visible.sync="showAudit" :close-on-click-modal="false">
      <el-row>
        <el-col :span="6">
          <div class="pro">项目名称</div>
        </el-col>
        <el-col :span="6">
          <div class="value">
            {{ project.name || '-' }}
          </div>
        </el-col>
        <el-col :span="6">
          <div class="pro">启止时间</div>
        </el-col>
        <el-col :span="6">
          <div class="value">
            {{ project.start_date + '到' + project.end_date }}
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <div class="pro">项目编号</div>
        </el-col>
        <el-col :span="6">
          <div class="value">
            {{ project.no || '' }}
          </div>
        </el-col>
        <el-col :span="6">
          <div class="pro">内部编号</div>
        </el-col>
        <el-col :span="6">
          <div class="value">
            {{ project.inter_no || '-' }}
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <div class="pro">支出经费</div>
        </el-col>
        <el-col :span="6">
          <div class="value">
            {{ project.charge }}
          </div>
        </el-col>
        <el-col :span="6">
          <div class="pro">项目来源</div>
        </el-col>
        <el-col :span="6">
          <div class="value">
            {{ project.source }}
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <div class="pro">申请人</div>
        </el-col>
        <el-col :span="6">
          <div class="value" v-if="project.user">
            {{ project.user.name || '-' }}
          </div>
        </el-col>
        <el-col :span="6">
          <div class="pro">导师</div>
        </el-col>
        <el-col :span="6">
          <div class="value" v-if="project.user">
            {{ project.user.mentor_name || '-' }}
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div style="padding: 20px">
            <span style="vertical-align: top; margin: 10px">备注</span>
            <el-input
              :disabled="project.status == 1"
              type="textarea"
              v-model="reason"
              :rows="3"
              style="width: 90%"
              placeholder="可以填写拒绝的理由"
            ></el-input>
          </div>
        </el-col>
      </el-row>
      <div style="text-align: right; padding: 10px">
        <template v-if="project.status != 1">
          <el-button type="success" size="small" @click="doAudit(1)">通过</el-button>
          <el-button type="danger" size="small" @click="doAudit(-1)">拒绝</el-button>
        </template>
        <template>
          <el-button type="info" size="small" @click="showAudit = false">已通过审核</el-button>
        </template>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { checkNode } from '@/utils/validate';
import { mapGetters } from 'vuex';
import { myProjectAuditList, auditApplyProject } from '@/api/platform';
import { timeFormat } from '@/utils/index';
import Empty from '@/components/Empty';
import ApparatusInfo from '@/components/ApparatusInfo';

export default {
  components: {
    ApparatusInfo,
    Empty,
  },
  data() {
    return {
      loading: false,
      showAudit: false,
      reason: '',
      project: {},
      queryForm: {
        page: 1,
        size: 10,
        sort: 'id',
        sort_type: 'desc',
        user_id: '',
        status: '',
        factory_id: '',
      },
      domain: process.env.VUE_APP_DOMAIN,
      list: [],
      total: 0,
    };
  },
  created() {
    this.queryForm.factory_id = this.currentFactoryId;
    this.queryForm.user_id = this.member.id;
    this.queryList();
  },
  computed: {
    ...mapGetters(['member']),
  },
  methods: {
    doShowAudit(row) {
      this.project = row;
      this.reason = this.project.reason;
      this.showAudit = true;
    },
    doAudit(status) {
      auditApplyProject({
        id: this.project.id,
        status: status,
        reason: this.reason,
      }).then((res) => {
        if (res.status == 200) {
          this.showAudit = false;
          this.queryList();
        }

        this.$message.success(res.msg);
      });
    },
    queryList() {
      this.loading = true;
      myProjectAuditList(this.queryForm)
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
    indexMethod(index) {
      return index + (this.queryForm.page - 1) * this.queryForm.size + 1;
    },
  },
};
</script>
<style lang="scss" scoped>
.hcs-status {
  margin-bottom: 10px;
}

.hcs-status:last-child {
  margin-bottom: 0;
}

.pro {
  padding: 10px;
}

.value {
  padding: 10px;
}
</style>
