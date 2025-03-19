<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="实验室">
        <el-select
          v-model="queryForm.platform_id"
          :clearable="true"
          size="small"
          class="max-width-150"
          placeholder="实验室"
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
      <el-form-item>
        <el-button round size="small" @click="resetQuery">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <el-table-column prop="user_name" label="申请人" />
      <el-table-column prop="platform_name" label="实验室" />
      <el-table-column prop="mentor_name" label="导师姓名" />
      <el-table-column label="状态">
        <template slot-scope="scope">
          <div v-if="scope.row.mentor_audit === 0">
            <el-tag type="primary">待导师审核</el-tag>
          </div>
          <div v-if="scope.row.mentor_audit === 1">
            <div v-if="scope.row.pass_exam === 0">
              <el-tag type="primary">待离室考试</el-tag>
            </div>
            <div v-else>
              <el-tag type="primary" v-if="scope.row.platform_audit === 0">待实验室审核</el-tag>
              <el-tag type="danger" v-if="scope.row.platform_audit === -1">实验室已拒绝</el-tag>
              <div v-if="scope.row.platform_audit === 1">
                <el-tag v-if="scope.row.status === 0" type="primary">待平台审核</el-tag>
                <el-tag v-if="scope.row.status === 1" type="success">已离室</el-tag>
                <el-tag v-if="scope.row.status === -1" type="danger">平台已拒绝</el-tag>
              </div>
            </div>
          </div>
          <div v-if="scope.row.mentor_audit === -1">
            <el-tag type="danger">导师已拒绝</el-tag>
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
          <el-form :inline="true">
            <el-form-item v-if="scope.row.status == '0'" style="margin-bottom: 0">
              <el-select
                size="small"
                class="max-width-80"
                v-model="verifyArr[scope.$index]"
                v-if="scope.row.mentor_audit && scope.row.platform_audit === 0"
                @visible-change="handleAudit($event, scope)"
                placeholder="审核"
              >
                <el-option label="通过" value="1"></el-option>
                <el-option label="拒绝" value="-1"></el-option>
              </el-select>
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
    <!-- <el-dialog
            :title="auditText"
            :visible.sync="auditDialogVisible"
            :close-on-click-modal="false">
            <el-form v-if="auditForm.status == '-1'" ref="auditForm" :rules="rules" :model="auditForm">
                <el-form-item label="拒绝理由">
                    <el-input type="textarea" v-model="auditForm.reason" size="small" :rows="3" class="width-50-percent" clearable />
                </el-form-item>
            </el-form>
            <div v-else>确定要通过离室申请吗?</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="auditDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="comfirmAudit('auditForm')">确 定</el-button>
            </span>
        </el-dialog> -->
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
      <div v-else>
        <div>若同意其离室，请确认其已还清所有欠款，确定要通过离室申请吗?</div>
        <el-form label-width="100px">
          <el-form-item label="欠款明细">
            <div v-for="(item, index) in debtList" :key="index">
              <div style="font-weight: bolder">欠款人：{{ item.user_name }}</div>
              <div
                style="line-height: 1.5; margin-top: 5px"
                v-for="(item1, index1) in item.items"
                :key="index1"
              >
                订单号：{{ item1.no }}<br />欠款金额：{{ item1.debt_amount }}元<br />订单来源：{{
                  item1.name
                }}
              </div>
            </div>
            <div v-if="debtList.length === 0">无任何欠款，可正常离室</div>
          </el-form-item>
          <el-form-item v-if="debtList.length > 0" label="欠款总额"
            >{{ totalPrice }}元</el-form-item
          >
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="auditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="comfirmAudit('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  frontPlatformList,
  frontApplyLeavePlatformList,
  deleteApplyPlatform,
  platformAuditLeave,
  applyPlatformAppend,
} from '@/api/platform';
import { debtDetail } from '@/api/research';
import { checkGtZero, checkInt } from '@/utils/validate';
import { checkNode } from '@/utils/validate';
import { mapGetters } from 'vuex';
import Empty from '@/components/Empty';

export default {
  components: {
    Empty,
  },
  data() {
    return {
      loading: false,
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
      auditForm: { id: '', status: '', expired_at: '', reason: '' },
      platforms: [],
      verifyArr: [],
      list: [],
      debtList: [],
      total: 0,
      totalPrice: 0,
    };
  },
  computed: {
    ...mapGetters(['member']),
  },
  created() {
    this.queryList();
    this.getPlatforms();
  },
  methods: {
    download(id) {
      window.location = process.env.VUE_APP_BASE_API + '/platform-apply/export?id=' + id;
    },
    getPlatforms() {
      frontPlatformList({
        page: 1,
        size: 100,
        type: 2,
        is_deleted: 0,
      }).then((res) => {
        if (res.status === 200) {
          this.platforms = res.data.data;
        }
      });
    },
    queryList() {
      this.loading = true;
      frontApplyLeavePlatformList(this.queryForm)
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
    handleAudit(flag, scope) {
      if (!flag && this.verifyArr[scope.$index]) {
        this.auditText =
          this.verifyArr[scope.$index] == '-1' ? '确定要拒绝申请吗？' : '确定要通过申请吗？';
        this.auditForm.id = scope.row.id;
        this.auditForm.status = this.verifyArr[scope.$index];
        this.auditForm.reason = '';
        // this.auditForm.expired_at = scope.row.expired_at
        if (this.verifyArr[scope.$index] == '-1') {
          this.auditDialogVisible = true;
        } else {
          debtDetail({
            platform_id: scope.row.platform_id,
            user_id: scope.row.user_id,
          }).then((res) => {
            if (res.status === 200) {
              this.debtList = res.data;
              this.totalPrice = 0;
              if (this.debtList.length === 1) {
                var that = this;
                this.debtList[0].items.forEach((item) => {
                  that.totalPrice += item.debt_amount;
                });
              }
              this.auditDialogVisible = true;
            }
          });
        }
      }
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
            // this.auditForm.expired_at = this.auditForm.expired_at.substring(0, 11) + ' 23:59:59'
            platformAuditLeave(this.auditForm).then((response) => {
              if (response.status === 1) {
                this.auditDialogVisible = false;
                this.queryList();
              }
            });
          }
        });
      } else {
        platformAuditLeave(this.auditForm).then((response) => {
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
    handleDelete(row, status) {
      const text = status === 0 ? '恢复' : '删除';
      this.$confirm('确定要' + text + '"' + row.user_name + '"的离室申请吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteApplyPlatform({ id: row.id, is_deleted: status }).then((response) => {
          if (response.status === 1) {
            this.queryList();
          }
        });
      });
    },
    toAdd(id = '') {
      if (id) {
        this.$router.push({
          path: '/personal/platform-apply/edit/' + id,
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
