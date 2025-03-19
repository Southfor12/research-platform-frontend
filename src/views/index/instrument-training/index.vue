<template>
  <div
    v-loading="loading"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryForm" style="width: 100%">
      <el-form-item label="培训名称">
        <el-input v-model="queryForm.name" class="input_width" size="small" clearable />
      </el-form-item>
      <el-form-item label="培训形式">
        <el-select
          v-model="queryForm.permanent"
          :clearable="true"
          size="small"
          class="input_width"
          placeholder="培训形式"
        >
          <el-option :value="1" label="申请培训">申请培训</el-option>
          <el-option :value="0" label="集中培训">集中培训</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="培训类型">
        <el-select
          v-model="queryForm.type"
          :clearable="true"
          size="small"
          class="input_width"
          placeholder="培训类型"
        >
          <el-option :value="1" label="仪器培训">仪器培训</el-option>
          <el-option :value="2" label="服务培训">服务培训</el-option>
          <el-option :value="3" label="技术培训">技术培训</el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button round size="small" @click="resetQuery">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" border style="width: 100%" @row-click="onRowclick">
      <el-table-column type="index" :index="indexDdMethod" label="序号" width="50" align="center" />
      <el-table-column min-width="150" prop="name" label="仪器名称" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.permanent === 0" class="common-link">{{ scope.row.name }}</span>
          <span v-if="scope.row.permanent === 1" class="common-link">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="培训形式" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.permanent === 1">申请培训</span>
          <span v-else>集中培训</span>
        </template>
      </el-table-column>
      <el-table-column label="培训类型" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 1">仪器培训</el-tag>
          <el-tag v-if="scope.row.type === 2">服务培训</el-tag>
          <el-tag v-if="scope.row.type === 3">技术培训</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="platform_name" label="子平台/实验室" align="center" />
      <el-table-column prop="leader_name" label="负责人" align="center" />
      <el-table-column label="发布时间" width="180" align="center">
        <template slot-scope="scope">{{ getDate(scope.row.created_at) }}</template>
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
import { trainList } from '@/api/train';
import Empty from '@/components/Empty';

export default {
  components: {
    Empty,
  },
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      queryForm: {
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        is_published: 1,
        name: '',
        permanent: '',
        type: '',
      },
    };
  },
  created() {
    this.queryList();
  },
  methods: {
    queryList() {
      this.loading = true;
      trainList(this.queryForm).then((res) => {
        this.loading = false;
        if (res.status === 200) {
          this.list = res.data.data;
          this.total = res.data.total;
        }
      });
    },
    onRowclick(row, column, event) {
      if (this.checkAudit('仪器培训')) {
        let url = '';
        if (row.permanent == 0) {
          url = '/instrument-training/detail/' + row.id;
        } else {
          url = '/apply-training/detail/' + row.id;
        }

        this.navTo(url);
      }
    },
    resetQuery() {
      this.queryForm.page = 1;
      this.queryList();
    },
    handleCurrentChange(val) {
      this.queryForm.page = val;
      this.queryList();
    },
    indexDdMethod(index) {
      return index + (this.queryForm.page - 1) * this.queryForm.size + 1;
    },
  },
};
</script>


<style scoped lang="scss">
.input {
}
.input_width {
  // width: 14% !important;
  max-width: 125px !important;
}

.test {
  // ::v-deep .el-input__inner {
  //   height: 40px;
  //   width: 100%;
  //   line-height: 40px;
  // }


}
</style>
