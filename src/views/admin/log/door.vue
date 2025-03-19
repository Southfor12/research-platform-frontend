<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="卡号">
        <el-input v-model="queryForm.card_no" class="max-width-100" size="small" clearable />
      </el-form-item>
      <el-form-item label="门禁编号">
        <el-input v-model="queryForm.sn" class="max-width-100" size="small" clearable />
      </el-form-item>
      <el-form-item label="门禁号">
        <el-input v-model="queryForm.door_no" class="max-width-100" size="small" clearable />
      </el-form-item>
      <el-form-item label="操作类型">
        <el-select
          v-model="queryForm.type"
          :clearable="true"
          size="small"
          class="max-width-100"
          placeholder="类型"
        >
          <el-option value="0" label="无记录"></el-option>
          <el-option value="1" label="刷卡记录"></el-option>
          <el-option value="2" label="门磁,按钮"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="进/出门">
        <el-select
          v-model="queryForm.open_door_type"
          :clearable="true"
          size="small"
          class="max-width-100"
          placeholder="类型"
        >
          <el-option value="1" label="进门"></el-option>
          <el-option value="0" label="出门"></el-option>
        </el-select>
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
    <el-table :data="list" :header-cell-style="{ background: '#fafafa' }" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <el-table-column prop="sn" label="门禁编号" />
      <el-table-column prop="door_no" label="门禁号" />
      <el-table-column prop="card_no" label="一卡通号" />
      <el-table-column label="操作类型">
        <template slot-scope="scope">
          <div v-if="scope.row.type === 0">无记录</div>
          <div v-if="scope.row.type === 1">刷卡记录</div>
          <div v-if="scope.row.type === 2">门磁,按钮</div>
        </template>
      </el-table-column>
      <el-table-column label="有效性">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.is_open === 0" type="info">无效</el-tag>
          <el-tag v-if="scope.row.is_open === 1" type="success">有效</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="进/出门">
        <template slot-scope="scope">
          {{ scope.row.open_door_type === 1 ? '进门' : '出门' }}
        </template>
      </el-table-column>
      <el-table-column prop="note" label="记录原因" />
      <el-table-column prop="error_no" label="故障号" />
      <el-table-column prop="datetime" label="操作时间" />
      <!-- <el-table-column prop="factory_id" label="单位">
          <template slot-scope="scope">
            {{getFactoryName(scope.row.factory_id)}}
          </template>
      </el-table-column> -->
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
      layout="total, prev, pager, next, jumper"
      :total="total"
      :current-page="queryForm.page"
      :page-size="queryForm.size"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import { doorLogList } from '@/api/log';
import Empty from '@/components/Empty';

export default {
  components: {
    Empty,
  },
  data() {
    return {
      loading: false,
      queryForm: {
        page: 1,
        size: 10,
        sort: 'id',
        sort_type: 'desc',
        type: '',
        open_door_type: '',
        card_no: '',
        sn: '',
        door_no: '',
        factory_id: '',
      },
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
      doorLogList(this.queryForm)
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
