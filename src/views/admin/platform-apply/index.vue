<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="科研组室">
        <el-select
          v-model="queryForm.platform_id"
          size="small"
          class="max-width-150"
          placeholder="科研组室"
        >
          <el-option v-for="item in platforms" :key="item.id" :label="item.name" :value="item.id" />
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
          <el-option value="0" label="待审核">待审核</el-option>
          <el-option value="1" label="已通过">已通过</el-option>
          <el-option value="-1" label="已拒绝">已拒绝</el-option>
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
      <el-table-column prop="user_name" label="申请人" />
      <el-table-column label="起止时间">
        <template slot-scope="scope">
          {{ scope.row.effective_at.slice(0, 10) }} 至 <br />{{ scope.row.expired_at.slice(0, 10) }}
        </template>
      </el-table-column>
      <el-table-column prop="stage_number" label="实验桌(米)" />
      <el-table-column prop="pi_stage_number" label="PI办公桌(个)" />
      <el-table-column prop="total_charge" label="预计费用(元)" />
      <!-- <el-table-column label="缴费状态">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.in_debt == 0">已缴费</el-tag>
          <el-tag type="danger" size="small" v-else>未缴费</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column label="状态">
        <template slot-scope="scope">
          <div v-if="scope.row.status == 1">
            <el-tag type="success" size="small">已通过</el-tag>
          </div>
          <div v-else-if="scope.row.status == -1">
            <el-tag type="danger" size="small">已拒绝</el-tag>
          </div>
          <div v-else>
            <div v-if="scope.row.projects.every((project) => project.status == 1)">
              <el-tag type="primary" size="small">待平台审核</el-tag>
            </div>
            <div v-else-if="scope.row.projects.some((project) => project.status == -1)">
              <el-tag type="danger" size="small">项目负责人已拒绝</el-tag>
            </div>
            <div v-else>
              <el-tag type="primary" size="small">待项目负责人审核</el-tag>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="factory_id" label="单位">
        <template slot-scope="scope">
          {{getFactoryName(scope.row.factory_id)}}
        </template>
      </el-table-column>
      <el-table-column width="180" label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="checkNode('platform_apply_audit')"
            size="mini"
            type="primary"
            @click="showAudit(scope.row)"
            >审核</el-button
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
    <el-dialog :title="auditText" :visible.sync="auditDialogVisible" :close-on-click-modal="false">
      <el-form v-if="auditForm.status == '-1'" ref="form" :rules="rules" :model="auditForm">
        <el-form-item label="理由">
          <el-input
            type="textarea"
            v-model="auditForm.reason"
            size="small"
            :rows="3"
            class="width-50-percent"
            clearable
          />
        </el-form-item>
      </el-form>
      <div v-else>确定要通过入室申请吗?</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="auditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="comfirmAudit('form')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="补充申请" :visible.sync="appendDialogVisible" :close-on-click-modal="false">
      <el-form ref="appendForm" :rules="rules" label-width="150px" :model="appendForm">
        <el-form-item label="申请人">{{ appendForm.user_name }}</el-form-item>
        <el-form-item label="实验室">{{ appendForm.platform_name }}</el-form-item>
        <el-form-item label="申请类型" prop="checkList">
          <el-checkbox-group v-model="appendForm.checkList">
            <el-checkbox label="危化品"></el-checkbox>
            <el-checkbox label="修改有效截止日期"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          v-if="
            (appendForm.checkList.length > 0 && appendForm.checkList[0] === '危化品') ||
            (appendForm.checkList.length === 2 && appendForm.checkList[1] === '危化品')
          "
          label="危化品"
          prop="hcs_names_arr"
        >
          <el-select
            v-model="appendForm.hcs_names_arr"
            size="small"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请输入文字然后回车添加危化品"
          >
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="
            (appendForm.checkList.length > 0 && appendForm.checkList[0] === '修改有效截止日期') ||
            (appendForm.checkList.length === 2 && appendForm.checkList[1] === '修改有效截止日期')
          "
          label="有效截止日期(含)"
          prop="expired_at"
        >
          <el-date-picker
            size="small"
            v-model="appendForm.expired_at"
            type="date"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            placeholder="选择有效截止日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            v-model="auditForm.note"
            size="small"
            :rows="3"
            class="width-50-percent"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="appendDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="comfirmAppend('appendForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="入室详细信息"
      width="80%"
      :visible.sync="infoDialogVisible"
      :close-on-click-modal="false"
    >
      <apply-info v-if="infoDialogVisible" :form="current" />
      <el-form label-width="130px">
        <el-form-item label="备注">
          <el-input type="textarea" v-model="reason" size="small" :rows="5" class="width-500" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div v-if="current.status == 1">
          <el-button type="info" size="small" plain @click="infoDialogVisible = false"
            >已通过审核</el-button
          >
        </div>
        <div v-else>
          <el-button type="danger" size="small" @click="doAudit(-1)">拒绝</el-button>
          <el-button type="success" size="small" @click="doAudit(1)">通过</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  allPlatforms,
  platformList,
  applyPlatformList,
  deleteApplyPlatform,
  auditApplyPlatform,
  applyPlatformAppend,
} from '@/api/platform';
import { checkGtZero, checkInt } from '@/utils/validate';
import { checkNode } from '@/utils/validate';
import { mapGetters } from 'vuex';
import Empty from '@/components/Empty';
import ApplyInfo from '@/components/ApplyInfo';

export default {
  components: {
    Empty,
    ApplyInfo,
  },
  data() {
    return {
      loading: false,
      infoDialogVisible: false,
      auditDialogVisible: false,
      appendDialogVisible: false,
      queryForm: {
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        parent_id_lte: '0',
        name: '',
        status: '',
        platform_id: '',
        factory_id: '',
      },
      appendForm: {
        id: '',
        user_name: '',
        platform_name: '',
        hcs_names: '',
        expired_at: '',
        hcs_names_arr: '',
        note: '',
        checkList: ['危化品'],
      },
      rules: {
        expired_at: [
          {
            required: true,
            trigger: 'change',
            message: '请选择有效截止日期',
          },
        ],
        hcs_names_arr: [
          {
            required: true,
            trigger: 'change',
            message: '请输入危化品',
          },
        ],
        checkList: [
          {
            required: true,
            trigger: 'change',
            message: '至少选一项申请项',
          },
        ],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      },
      auditText: '',
      auditForm: {
        id: '',
        status: '',
        expired_at: '',
        reason: '',
      },
      platforms: [],
      verifyArr: [],
      list: [],
      current: {},
      total: 0,
      reason: '',
    };
  },
  computed: {
    ...mapGetters(['member']),
  },
  created() {
    this.queryForm.factory_id = this.currentFactoryId;

    this.getPlatforms();
  },
  methods: {
    showAudit(row) {
      this.current = row;
      this.infoDialogVisible = true;
      this.reason = this.current.reason;
    },
    download(id) {
      window.location = process.env.VUE_APP_BASE_API + '/platform-apply/export?id=' + id;
    },
    getPlatforms() {
      platformList({
        page: 1,
        size: 100,
        is_default: 1,
        is_deleted: 0,
      }).then((res) => {
        if (res.status === 200) {
          this.platforms = res.data.data;
          this.queryForm.platform_id = this.platforms[0].id;
          this.queryList();
        }
      });
    },
    doAudit(status) {
      if (this.current.projects.some((project) => project.status != 1)) {
        this.$message.error('还未通过项目负责人审核，请等待项目负责人审核通过后再操作');
        return;
      }

      auditApplyPlatform({
        id: this.current.id,
        status: status,
        reason: this.reason,
      }).then((res) => {
        this.infoDialogVisible = false;
        this.queryList();
      });
    },
    queryList() {
      this.loading = true;
      applyPlatformList(this.queryForm)
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
    toAppend(row) {
      this.appendForm.id = row.id;
      this.appendForm.user_name = row.user_name;
      this.appendForm.platform_name = row.platform_name;
      this.appendForm.hcs_names = '';
      this.appendForm.hcs_names_arr = [];
      this.appendForm.expired_at = row.expired_at;
      this.appendForm.note = '';
      this.appendDialogVisible = true;
    },
    comfirmAppend(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          var expired_at = this.appendForm.expired_at;
          this.appendForm.hcs_names = '';
          this.appendForm.expired_at = '';
          this.appendForm.checkList.forEach((item) => {
            if (item === '危化品') {
              this.appendForm.hcs_names = this.appendForm.hcs_names_arr.join(',');
            }
            if (item === '修改有效截止日期') {
              this.appendForm.expired_at = expired_at.substring(0, 11) + ' 23:59:59';
            }
          });
          applyPlatformAppend(this.appendForm).then((res) => {
            if (res.status === 1) {
              this.appendDialogVisible = false;
              this.queryList();
            }
          });
        }
      });
    },
    comfirmAudit(form) {
      if (this.auditForm.status == '-1') {
        this.$refs[form].validate((valid) => {
          if (valid) {
            auditApplyPlatform(this.auditForm).then((response) => {
              if (response.status === 1) {
                this.auditDialogVisible = false;
                this.queryList();
              }
            });
          }
        });
      } else {
        auditApplyPlatform(this.auditForm).then((response) => {
          if (response.status === 1) {
            this.auditDialogVisible = false;
            this.queryList();
          }
        });
      }
    },
    resetQuery() {
      this.queryForm.page = 1;
      this.queryList();
    },
    toAdd(id = '') {
      if (id) {
        this.$router.push({
          path: '/platform-apply/edit/' + id,
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
