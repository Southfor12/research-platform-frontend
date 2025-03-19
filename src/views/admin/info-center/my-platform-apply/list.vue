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
      <el-table-column prop="fund_description" label="经费情况" />
      <el-table-column prop="hcs_names" label="危化品" />
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
            <el-form-item v-if="scope.row.status == '1'" style="margin-bottom: 0">
              <el-button size="mini" type="success" @click="toAppend(scope.row)"
                >补充申请</el-button
              >
            </el-form-item>
            <el-form-item v-if="scope.row.status == '0'" style="margin-bottom: 0">
              <el-button size="mini" type="primary" @click="toAdd(scope.row.id)">修改</el-button>
            </el-form-item>
          </el-form>
          <div v-if="scope.row.user_id === member.id">
            <el-button type="primary" size="small" @click="download(scope.row.id)"
              >下载入室申请表</el-button
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
            v-model="appendForm.note"
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
  </div>
</template>
<script>
import {
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

export default {
  components: {
    Empty,
  },
  data() {
    return {
      loading: false,
      appendDialogVisible: false,
      queryForm: {
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        parent_id_lte: '0',
        name: '',
        status: '',
        user_id: '',
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
    this.queryForm.user_id = this.member.id;
    this.queryList();
    this.getPlatforms();
  },
  methods: {
    download(id) {
      window.location = process.env.VUE_APP_BASE_API + '/platform-apply/export?id=' + id;
    },
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
    resetQuery() {
      this.queryForm.page = 1;
      this.queryList();
    },
    handleDelete(row, status) {
      const text = status === 0 ? '恢复' : '删除';
      this.$confirm('确定要' + text + '"' + row.user_name + '"的入室申请吗？', '提示', {
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
        this.$router.push({ path: '/platform-apply/edit/' + id });
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
    indexMethod(index) {
      return index + (this.queryForm.page - 1) * this.queryForm.size + 1;
    },
  },
};
</script>
