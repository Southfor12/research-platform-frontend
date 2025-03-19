<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <el-table-column prop="research_group_account_name" label="账号名称" />
      <!-- <el-table-column label="状态">
            <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.is_deleted === 0">正常</el-tag>
            </template>
        </el-table-column> -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="myConsume(scope.row)"
            >我的消费记录</el-button
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
    <el-dialog title="我的消费记录" :fullscreen="true" :visible.sync="dialogVisible">
      <el-form :inline="true">
        <el-form-item label="账号名称">
          {{ queryBillForm.platform_name }}
        </el-form-item>
      </el-form>
      <el-table :header-cell-style="{ background: '#fafafa' }" :data="billList" style="width: 100%">
        <el-table-column prop="order_no" label="订单号" />
        <el-table-column prop="research_group_account_name" label="课题组账号" />
        <el-table-column prop="research_group_name" label="课题组名称" />
        <el-table-column label="类型">
          <template slot-scope="scope">
            {{ scope.row.type === 1 ? '充值' : '消费' }}
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" />
        <el-table-column prop="order_name" label="描述" />
        <el-table-column prop="created_at" label="操作时间" />
        <div slot="empty">
          <empty />
        </div>
      </el-table>
      <el-pagination
        class="dl-pagination"
        :hide-on-single-page="true"
        background
        layout="total, prev, pager, next, jumper"
        :total="billTotal"
        :current-page="queryBillForm.page"
        :page-size="queryBillForm.size"
        @current-change="handleBillChange"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { researchGroupAccountAuthList, researchGroupAccountCashFlow } from '@/api/research';
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
      dialogVisible: false,
      queryForm: {
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        is_deleted: '0',
        user_id: '',
      },
      queryBillForm: {
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        research_group_account_name: '',
        research_group_account_id: '',
      },
      list: [],
      billList: [],
      billTotal: 0,
      total: 0,
    };
  },
  created() {
    this.queryForm.user_id = this.member.id;
    this.queryBillForm.user_id = this.member.id;
    this.queryList();
  },
  methods: {
    queryList() {
      this.loading = true;
      researchGroupAccountAuthList(this.queryForm)
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
    queryBillList() {
      researchGroupAccountCashFlow(this.queryBillForm).then((res) => {
        if (res.status === 200) {
          this.billList = res.data.data;
          this.billTotal = res.data.total;
        }
      });
    },
    myConsume(row) {
      this.billList = [];
      this.queryBillForm.page = 1;
      this.queryBillForm.research_group_account_name = row.research_group_account_name;
      this.queryBillForm.research_group_account_id = row.research_group_account_id;
      this.queryBillList();
      this.dialogVisible = true;
    },
    resetQuery() {
      this.queryForm.page = 1;
      this.queryList();
    },
    toAdd(id = '') {
      if (!id) {
        this.$router.push({ path: '/research-group-account-auth/add' });
      } else {
        this.$router.push({
          path: '/research-group-account-auth/edit/' + id,
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
    handleBillChange(val) {
      this.queryBillForm.page = val;
      this.queryBillList();
    },
    indexMethod(index) {
      return index + (this.queryForm.page - 1) * this.queryForm.size + 1;
    },
  },
};
</script>
