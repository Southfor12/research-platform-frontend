<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="状态">
        <el-select
          v-model="queryForm.status"
          :clearable="true"
          size="small"
          class="max-width-150"
          placeholder="状态"
        >
          <el-option value="0" label="待审核"></el-option>
          <el-option value="1" label="采购中"></el-option>
          <el-option value="2" label="采购完成"></el-option>
          <el-option value="3" label="审核未通过"></el-option>
          <el-option value="4" label="申请人取消"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订单号">
        <el-input v-model="queryForm.no" class="max-width-150" size="small" clearable />
      </el-form-item>
      <el-form-item>
        <el-button round size="small" @click="resetQuery">查询</el-button>
      </el-form-item>
      <el-form-item class="right">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd(0)"
          >采购申请</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column type="index" :index="indexMethod" label="序号" width="50" />
      <el-table-column prop="no" label="订单号" />
      <el-table-column prop="creator_name" label="申请人" />
      <!-- <el-table-column
            label="申请采购耗材">
            <template slot-scope="scope">
                {{　getReagent(scope.row.data, 1)　}}
            </template>
        </el-table-column> -->
      <el-table-column label="采购明细">
        <template slot-scope="scope">
          {{ getReagent(scope.row.data, 2) }}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1">采购中</el-tag>
          <el-tag v-if="scope.row.status === 2" type="success">采购完成</el-tag>
          <el-tag v-if="scope.row.status === 4" type="info">申请人取消</el-tag>
          <el-tag v-if="scope.row.status === 0" type="warning">待审核</el-tag>
          <el-tag v-if="scope.row.status === 3" type="danger">审核未通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" />
      <el-table-column prop="created_at" label="时间" />
      <el-table-column prop="factory_id" label="单位">
        <template slot-scope="scope">
          {{getFactoryName(scope.row.factory_id)}}
        </template>
      </el-table-column>
      <el-table-column width="180" label="操作">
        <template slot-scope="scope">
          <!-- <el-button
                    v-if="scope.row.status === 0"
                    size="mini"
                    type="primary"
                    @click="toAdd(scope.row.id)"
                >修改</el-button> -->
          <el-button
            v-if="scope.row.status === 0 && scope.row.creator_id === member.id"
            size="mini"
            type="info"
            @click="handleCancle(scope.row.id)"
            >取消申请</el-button
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
import { chemicalOrderList, cancleChemicalOrder } from '@/api/stock';
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
      auditDialogVisible: false,
      chargeDialogVisible: false,
      queryForm: {
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        creator_id: '',
        status: '',
        no: '',
      },
      auditText: '',
      auditForm: { id: '', status: '', reason: '' },
      completeForm: { id: '', total_amount: '' },
      rules: {
        total_amount: [
          {
            required: true,
            message: '请填写金额，类型为正数',
            trigger: 'blur',
          },
        ],
      },
      domain: process.env.VUE_APP_DOMAIN,
      list: [],
      total: 0,
    };
  },
  created() {
    this.queryForm.creator_id = this.member.id;
    this.queryList();
  },
  methods: {
    queryList() {
      this.loading = true;
      chemicalOrderList(this.queryForm)
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
    getReagent(data, type) {
      var text = '';
      data.forEach((item) => {
        if (type === 1 && 'reagent_id' in item) {
          text += item.name + '×' + item.number + '、';
        } else if (type === 2 && 'hcs_id' in item) {
          text += item.name + '×' + item.number + '、';
        }
      });
      return text ? text.substring(0, text.length - 1) : '-';
    },
    resetQuery() {
      this.queryForm.page = 1;
      this.queryList();
    },
    handleCancle(id) {
      this.$confirm('确定要取消该采购申请吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        cancleChemicalOrder({ id }).then((res) => {
          if (res.status === 1) {
            this.queryList();
          }
        });
      });
    },
    handleAudit(row, status) {
      this.auditText = status === 3 ? '确定要拒绝预约吗？' : '提示';
      this.auditForm.id = row.id;
      this.auditForm.status = status;
      this.auditForm.reason = '';
      this.auditDialogVisible = true;
    },
    toAdd(id = '') {
      if (!id) {
        this.$router.push({ path: '/personal/hcs-order/add' });
      } else {
        this.$router.push({ path: '/personal/hcs-order/edit/' + id });
      }
    },
    chargeChange(value) {
      if (!value || isNaN(value) || value <= 0) {
        this.completeForm.total_amount = '';
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
