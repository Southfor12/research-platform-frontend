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
      <!-- <el-form-item v-if="checkNode('add_chemical_order')" class="right">
                <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd(0)">采购申请</el-button>
            </el-form-item> -->
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column type="index" :index="indexMethod" label="序号" width="50" />
      <el-table-column prop="no" label="订单号" />
      <el-table-column prop="creator_name" label="申请人" />
      <el-table-column label="采购明细">
        <template slot-scope="scope">
          {{ getReagent(scope.row.data, 1) }}
        </template>
      </el-table-column>
      <!-- <el-table-column
            label="申请采购危化品">
            <template slot-scope="scope">
                {{　getReagent(scope.row.data, 2)　}}
            </template>
        </el-table-column> -->
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
      <el-table-column v-if="checkNode('audit_chemical_order')" width="180" label="操作">
        <template slot-scope="scope">
          <div class="bottom-10">
            <div class="top-10">
              <el-button
                size="mini"
                type="primary"
                @click="
                  currentList = scope.row.data;
                  infoDialogVisible = true;
                "
                >详情</el-button
              >
            </div>
          </div>
          <div class="bottom-10">
            <!-- <el-button
                        v-if="checkNode('edit_chemical_order') && scope.row.status === 0"
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
            <el-button
              v-if="checkNode('audit_chemical_order') && scope.row.status === 1"
              size="mini"
              type="success"
              plain
              @click="handleComplete(scope.row)"
              >采购完成</el-button
            >
          </div>
          <div>
            <el-button
              v-if="checkNode('audit_chemical_order') && scope.row.status === 0"
              size="mini"
              type="danger"
              plain
              @click="handleAudit(scope.row, 3)"
              >拒绝</el-button
            >
            <el-button
              v-if="checkNode('audit_chemical_order') && scope.row.status === 0"
              size="mini"
              type="primary"
              plain
              @click="handleAudit(scope.row, 1)"
              >通过</el-button
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
    <el-dialog :title="auditText" :visible.sync="auditDialogVisible" :close-on-click-modal="false">
      <el-form v-if="auditForm.status === 3" :model="auditForm">
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
      <span v-else>确定要通过该采购申请吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="auditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="comfirmAudit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="采购完成" :visible.sync="chargeDialogVisible" :close-on-click-modal="false">
      <el-form ref="form" :rules="rules" :model="completeForm" label-width="100">
        <el-form-item label="花费金额" prop="total_amount">
          <el-input
            class="max-width-200"
            @change="chargeChange"
            type="number"
            v-model="completeForm.total_amount"
            size="small"
          />
          元
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chargeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="comfirmCharge('form')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="申请详情"
      width="80%"
      :visible.sync="infoDialogVisible"
      :close-on-click-modal="false"
    >
      <chemical-booking-info :list="currentList" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="infoDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  chemicalOrderList,
  auditChemicalOrder,
  completeChemicalOrder,
  cancleChemicalOrder,
} from '@/api/stock';
import { checkNode } from '@/utils/validate';
import { mapGetters } from 'vuex';
import Empty from '@/components/Empty';
import ChemicalBookingInfo from '@/components/ChemicalBookingInfo';

export default {
  components: {
    Empty,
    ChemicalBookingInfo,
  },
  computed: {
    ...mapGetters(['member']),
  },
  data() {
    return {
      loading: false,
      auditDialogVisible: false,
      chargeDialogVisible: false,
      infoDialogVisible: false,
      currentList: [],
      queryForm: {
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        type: 1,
        status: '',
        no: '',
        factory_id: '',
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
    this.queryForm.factory_id = this.currentFactoryId;

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
    handleComplete(row) {
      this.completeForm.id = row.id;
      this.completeForm.total_amount = '';
      this.chargeDialogVisible = true;
    },
    comfirmAudit() {
      auditChemicalOrder(this.auditForm).then((response) => {
        if (response.status === 1) {
          this.auditDialogVisible = false;
          this.queryList();
        }
      });
    },
    comfirmCharge(form) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          completeChemicalOrder(this.completeForm).then((res) => {
            if (res.status === 1) {
              this.queryList();
              this.chargeDialogVisible = false;
            }
          });
        } else {
          return false;
        }
      });
    },
    toAdd(id = '') {
      if (!id) {
        this.$router.push({ path: '/chemical-order/add' });
      } else {
        this.$router.push({ path: '/chemical-order/edit/' + id });
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
