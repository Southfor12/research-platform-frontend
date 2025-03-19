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
          <el-option value="1" label="审核已通过"></el-option>
          <el-option value="2" label="审核未通过"></el-option>
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
      <el-table-column label="采购明细">
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.reagents" :key="index">
            {{ item.reagent_name }}×{{ item.price_number_num }}
            <!-- <el-tag v-if="scope.row.status === 3" type="info">申请人取消</el-tag>
                    <span v-else>
                        <el-tag v-if="item.pass === 1" type="success">审核已通过</el-tag>
                        <el-tag v-if="item.pass === 2" type="danger">审核未通过</el-tag>
                        <el-tag v-if="item.pass === 0" type="warning">待审核</el-tag>
                    </span> -->
          </div>
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
          <el-tag v-if="scope.row.status === 3" type="info">申请人取消</el-tag>
          <div v-else>
            <el-tag v-if="scope.row.mentor_audit === 0" type="warning">待导师审核</el-tag>
            <el-tag v-else-if="scope.row.mentor_audit === -1" type="danger">导师未通过</el-tag>
            <span v-else>
              <el-tag v-if="scope.row.status === 1" type="success">审核已通过</el-tag>
              <el-tag v-if="scope.row.status === 2" type="danger">审核未通过</el-tag>
              <el-tag v-if="scope.row.status === 0" type="warning">待审核</el-tag>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="total_charge" label="金额" />
      <el-table-column prop="note" label="备注" />
      <el-table-column prop="created_at" label="时间" />
      <el-table-column prop="factory_id" label="单位">
        <template slot-scope="scope">
          {{getFactoryName(scope.row.factory_id)}}
        </template>
      </el-table-column>
      <el-table-column width="180" label="操作">
        <template slot-scope="scope">
          <div class="bottom-10">
            <div class="top-10">
              <el-button
                size="mini"
                type="primary"
                @click="
                  currentList = scope.row.reagents;
                  infoDialogVisible = true;
                "
                >详情</el-button
              >
            </div>
          </div>
          <div v-if="scope.row.mentor_audit === 0">
            <el-button size="mini" type="primary" plain @click="handleAudit(scope.row, 1)"
              >通过</el-button
            >
            <el-button size="mini" type="danger" plain @click="handleAudit(scope.row, -1)"
              >拒绝</el-button
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
      <el-form v-if="auditForm.status === -1" :model="auditForm">
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
      <span v-else>确定要通过该申请吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="auditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="comfirmAudit">确 定</el-button>
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
import { chemicalBookingList, mentorAuditChemicalBooking } from '@/api/chemical';
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
        booking_type: '2',
        mentor_id: '',
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
    this.queryForm.mentor_id = this.member.id;
    this.queryList();
  },
  methods: {
    queryList() {
      this.loading = true;
      chemicalBookingList(this.queryForm)
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
          text += item.reagent_name + '×' + item.price_number_num + '、';
        } else if (type === 2 && 'hcs_id' in item) {
          text += item.hcs_name + '×' + item.price_number_num + '、';
        }
      });
      return text ? text.substring(0, text.length - 1) : '-';
    },
    resetQuery() {
      this.queryForm.page = 1;
      this.queryList();
    },
    comfirmAudit() {
      mentorAuditChemicalBooking(this.auditForm).then((response) => {
        if (response.status === 1) {
          this.auditDialogVisible = false;
          this.queryList();
        }
      });
    },
    handleAudit(row, status) {
      this.auditText = status === -1 ? '确定要拒绝申请吗？' : '提示';
      this.auditForm.id = row.id;
      this.auditForm.status = status;
      this.auditForm.reason = '';
      this.auditDialogVisible = true;
    },
    toAdd(id = '') {
      if (!id) {
        this.$router.push({ path: '/personal/chemical-apply/add' });
      } else {
        this.$router.push({
          path: '/personal/chemical-apply/edit/' + id,
        });
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
