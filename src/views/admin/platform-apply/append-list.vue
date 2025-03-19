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
      <el-table-column label="补充危化品">
        <template slot-scope="scope">
          {{ scope.row.hcs_names !== '' ? scope.row.hcs_names : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="修改有效期至(含)">
        <template slot-scope="scope">
          {{
            scope.row.expired_at !== '0000-00-00 00:00:00' ? dateFormat(scope.row.expired_at) : '-'
          }}
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" />
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag type="primary" v-if="scope.row.status === 0">待审核</el-tag>
          <el-tag type="success" v-if="scope.row.status === 1">已通过</el-tag>
          <el-tag type="danger" v-if="scope.row.status === -1">已拒绝</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="180" label="操作">
        <template slot-scope="scope">
          <el-form :inline="true">
            <!-- <el-form-item v-if="checkNode('edit_platform_apply') && scope.row.status == '0'" style="margin-bottom: 0;">
                        <el-button size="mini" type="primary" @click="toAdd(scope.row.id)">修改</el-button>
                    </el-form-item>
                    <el-form-item v-if="checkNode('delete_platform_apply')" style="margin-bottom: 0;">
                        <el-button size="mini" type="danger" @click="handleDelete(scope.row, 1)">删除</el-button>
                    </el-form-item> -->
            <el-form-item
              v-if="checkNode('platform_apply_audit') && scope.row.status == '0'"
              style="margin-bottom: 0"
            >
              <el-select
                size="small"
                class="max-width-80"
                v-model="verifyArr[scope.$index]"
                @change="handleAudit(scope)"
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
    <el-dialog :title="auditText" :visible.sync="auditDialogVisible" :close-on-click-modal="false">
      <el-form ref="form" :rules="rules" :model="auditForm" label-width="100px">
        <el-form-item
          label="有效截止日期"
          v-if="auditForm.status == '1' && auditForm.expired_at !== ''"
        >
          <el-date-picker
            size="small"
            v-model="auditForm.expired_at"
            type="date"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            placeholder="选择有效截止日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="危化品" v-if="auditForm.status == '1' && auditForm.hcs !== ''">
          {{ auditForm.hcs }}
        </el-form-item>
        <el-form-item label="理由" v-if="auditForm.status == '-1'">
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="auditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="comfirmAudit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  platformList,
  applyPlatformList,
  deleteApplyPlatform,
  auditApplyPlatform,
} from '@/api/platform';
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
      queryForm: {
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        parent_id_gt: '0',
        name: '',
        status: '',
        platform_id: '',
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      },
      rules: {
        expired_at: [
          {
            required: true,
            trigger: 'change',
            message: '请选择有效截止日期',
          },
        ],
      },
      auditText: '',
      auditForm: {
        id: '',
        status: '',
        hcs: '',
        expired_at: '',
        reason: '',
      },
      platforms: [],
      verifyArr: [],
      list: [],
      total: 0,
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
    getPlatforms() {
      platformList({ page: 1, size: 100, type: 2, is_deleted: 0 }).then((res) => {
        if (res.status === 200) {
          this.platforms = res.data.data;
        }
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
    handleAudit(scope) {
      this.auditText =
        this.verifyArr[scope.$index] == '-1' ? '确定要拒绝申请吗？' : '确定要通过申请吗？';
      this.auditForm.id = scope.row.id;
      this.auditForm.status = this.verifyArr[scope.$index];
      this.auditForm.hcs = scope.row.hcs_names;
      this.auditForm.reason = '';
      this.auditForm.expired_at =
        scope.row.expired_at !== '0000-00-00 00:00:00' ? scope.row.expired_at : '';
      this.auditDialogVisible = true;
    },
    comfirmAudit() {
      if (this.auditForm.expired_at) {
        this.auditForm.expired_at = this.auditForm.expired_at.substring(0, 11);
        this.auditForm.expired_at += ' 23:59:59';
      }
      auditApplyPlatform(this.auditForm).then((response) => {
        if (response.status === 1) {
          this.auditDialogVisible = false;
          this.queryList();
        }
      });
    },
    resetQuery() {
      this.queryForm.page = 1;
      this.queryList();
    },
    handleDelete(row, status) {
      const text = status === 0 ? '恢复' : '删除';
      this.$confirm('确定要' + text + '"' + row.user_name + '"的危化品补充申请吗？', '提示', {
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
    dateFormat(time) {
      return time.substring(0, 10);
    },
    toAdd(id = '') {
      if (id) {
        this.$router.push({ path: '/platform-append-apply/edit/' + id });
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
