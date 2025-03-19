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
          <el-option value="1" label="申领中"></el-option>
          <el-option value="2" label="申领完成"></el-option>
          <el-option value="3" label="申请人取消"></el-option>
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
      <el-form-item class="right">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd(0)"
          >危化品申领</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column type="index" :index="indexMethod" label="序号" width="50" />
      <!-- <el-table-column
            prop="no"
            label="订单号"
        /> -->
      <!-- <el-table-column
            prop="creator_name"
            label="申请人"
        /> -->
      <!-- <el-table-column
            label="申请申领耗材">
            <template slot-scope="scope">
                {{　getReagent(scope.row.data, 1)　}}
            </template>
        </el-table-column> -->
      <el-table-column label="申领明细">
        <template slot-scope="scope">
          {{ getReagent(scope.row.hcses, 2) }}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" type="success">审核已通过</el-tag>
          <el-tag v-if="scope.row.status === 2" type="danger">审核未通过</el-tag>
          <el-tag v-if="scope.row.status === 3" type="info">申请人取消</el-tag>
          <div v-if="scope.row.status === 0">
            <el-tag v-if="scope.row.mentor_audit === 0" style="margin-bottom: 5px" type="warning"
              >导师待审核</el-tag
            >
            <el-tag
              v-else-if="scope.row.mentor_audit === -1"
              style="margin-bottom: 5px"
              type="danger"
              >导师未通过</el-tag
            >
            <span v-else>
              <el-tag v-if="scope.row.admin1_status === 0" style="margin-bottom: 5px" type="warning"
                >负责人1（{{ scope.row.admin1_name }}）待审核</el-tag
              >
              <el-tag v-if="scope.row.admin1_status === 1" style="margin-bottom: 5px" type="success"
                >负责人1（{{ scope.row.admin1_name }}）已通过</el-tag
              >
              <el-tag v-if="scope.row.admin1_status === 2" style="margin-bottom: 5px" type="danger"
                >负责人1（{{ scope.row.admin1_name }}）未通过</el-tag
              >
              <el-tag v-if="scope.row.admin2_status === 0" style="margin-bottom: 5px" type="warning"
                >负责人2（{{ scope.row.admin2_name }}）待审核</el-tag
              >
              <el-tag v-if="scope.row.admin2_status === 1" style="margin-bottom: 5px" type="success"
                >负责人2（{{ scope.row.admin2_name }}）已通过</el-tag
              >
              <el-tag v-if="scope.row.admin2_status === 2" style="margin-bottom: 5px" type="danger"
                >负责人2（{{ scope.row.admin2_name }}）未通过</el-tag
              >
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="discount_charge" label="金额" />
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
          <div class="bottom-10">
            <div class="top-10">
              <el-button
                size="mini"
                type="primary"
                @click="
                  currentList = scope.row.hcses;
                  infoDialogVisible = true;
                "
                >详情</el-button
              >
            </div>
          </div>
          <el-button
            v-if="scope.row.status === 0 && scope.row.user_id === member.id"
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
import { frontChemicalBookingList, cancelChemicalBooking } from '@/api/chemical';
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
        creator_id: '',
        booking_type: '3',
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
    this.queryForm.creator_id = this.member.id;
    this.queryList();
  },
  methods: {
    queryList() {
      this.loading = true;
      frontChemicalBookingList(this.queryForm)
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
        text += item.reagent_name + '×' + item.price_number_num + '、';
      });
      return text ? text.substring(0, text.length - 1) : '-';
    },
    resetQuery() {
      this.queryForm.page = 1;
      this.queryList();
    },
    handleCancle(id) {
      this.$confirm('确定要取消该申领申请吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        cancelChemicalBooking({ id }).then((res) => {
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
        this.$router.push({ path: '/personal/hcs-apply/add' });
      } else {
        this.$router.push({ path: '/personal/hcs-apply/edit/' + id });
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
