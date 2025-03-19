<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="类型">
        <el-select
          v-model="queryForm.type"
          :clearable="true"
          size="small"
          class="max-width-150"
          placeholder="类型"
        >
          <el-option value="1" label="入库"></el-option>
          <el-option value="0" label="出库"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="试剂类型">
                <el-select v-model="queryForm.chemical_type" :clearable="true" size="small" class="max-width-150" placeholder="试剂类型">
                    <el-option value="1" label="试剂耗材"></el-option>
                    <el-option value="2" label="危化品"></el-option>
                </el-select>
            </el-form-item> -->
      <el-form-item label="订单号">
        <el-input v-model="queryForm.order_no" class="max-width-150" size="small" clearable />
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
      <el-table-column prop="order_no" label="订单号" />
      <el-table-column prop="chemical_name" label="耗材/危化品名称" />
      <el-table-column prop="number" label="数量" />
      <el-table-column label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 1" effect="dark" type="success">入库</el-tag>
          <el-tag v-else effect="dark" type="danger">出库</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="user_name" label="操作人" />
      <!-- <el-table-column
            label="试剂类型">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.chemical_type === 1">试剂耗材</el-tag>
                <el-tag v-else type="danger">危化品</el-tag>
            </template>
        </el-table-column> -->
      <el-table-column prop="created_at" label="时间" />
      <el-table-column prop="factory_id" label="单位">
          <template slot-scope="scope">
            {{getFactoryName(scope.row.factory_id)}}
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
import { chemicalFlow } from '@/api/stock';
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
        chemical_type: '1',
        type: '',
        order_no: '',
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
    if (this.$route.name === 'chemicalFlow') {
      this.queryForm.chemical_type = '1';
    } else {
      this.queryForm.chemical_type = '2';
    }
  },
  methods: {
    queryList() {
      this.loading = true;
      chemicalFlow(this.queryForm)
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
