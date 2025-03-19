<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="评分月">
        <el-date-picker
          v-model="queryForm.month"
          type="month"
          size="small"
          value-format="yyyy-MM"
          placeholder="选择评分月"
        />
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
      <el-table-column width="100px" type="index" label="排名" />
      <el-table-column prop="platform_name" label="实验室名称" />
      <el-table-column prop="score" label="得分" />
      <el-table-column prop="factory_id" label="单位">
        <template slot-scope="scope">
          {{getFactoryName(scope.row.factory_id)}}
        </template>
      </el-table-column>
      <div slot="empty">
        <empty />
      </div>
    </el-table>
  </div>
</template>
<script>
import { platformScoreRecordRanking } from '@/api/platform';
import Empty from '@/components/Empty';

export default {
  components: {
    Empty,
  },
  data() {
    return {
      loading: false,
      dialogScoreVisible: false,
      queryForm: {
        month: '',
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
      platformScoreRecordRanking(this.queryForm)
        .then((res) => {
          this.loading = false;
          if (res.status === 200) {
            this.queryForm.month = res.data.month;
            this.list = res.data.data;
          }
        })
        .catch((_) => {
          this.loading = false;
        });
    },
    resetQuery() {
      this.queryList();
    },
  },
};
</script>
