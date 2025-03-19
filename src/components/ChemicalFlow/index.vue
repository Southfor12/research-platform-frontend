<template>
  <div
    v-loading="loading"
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
      <el-form-item>
        <el-button round size="small" @click="resetQuery">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column type="index" :index="indexMethod" label="序号" width="50" />
      <el-table-column prop="order_no" label="订单号" />
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
import Empty from '@/components/Empty';

export default {
  name: 'ChemicalFlow',
  components: {
    Empty,
  },
  props: {
    id: {
      type: Number,
    },
  },
  data() {
    return {
      loading: false,
      queryForm: {
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        chemical_id: '',
        type: '',
        order_no: '',
      },
      list: [],
      total: 0,
    };
  },
  created() {
    this.queryForm.chemical_id = this.id;
    this.queryList();
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
    indexMethod(index) {
      return index + (this.queryForm.page - 1) * this.queryForm.size + 1;
    },
  },
};
</script>
