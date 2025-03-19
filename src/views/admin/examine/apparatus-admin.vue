<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="姓名">
        <el-input
          v-model="queryForm.name"
          class="max-width-150"
          size="small"
          placeholder="请输入姓名"
          clearable
        />
      </el-form-item>
      <!-- <el-form-item label="日期">
        <el-date-picker
          v-model="queryForm.daterange"
          type="daterange"
          size="small"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item> -->
      <el-form-item label="单位">
        <el-select
          v-model="queryForm.factory_id"
          :clearable="false"
          size="small"
          class="max-width-150"
          placeholder="单位"
        >
          <el-option
            :label="factory.name"
            :value="factory.id"
            :key="idx"
            v-for="(factory, idx) in getSelectableFactories()"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button round size="small" @click="resetQuery">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="total_num" label="负责仪器数量" />
      <el-table-column label="预约总次数">
        <template slot-scope="scope">
          {{ scope.row.own_num + scope.row.sample_num }}
        </template>
      </el-table-column>
      <el-table-column prop="own_num" label="自主检测数" />
      <el-table-column prop="sample_num" label="送样检测数" />
      <el-table-column prop="total_charge" label="总创收/元" />
      <el-table-column prop="breakdown_num" label="损坏次数" />
      <el-table-column prop="factory_id" label="单位">
        <template slot-scope="scope">
          {{ getFactoryName(scope.row.factory_id) }}
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
import { apparatusAdminList } from '@/api/security';
import { checkNode } from '@/utils/validate';
import Grade from '@/components/Grade';
import Empty from '@/components/Empty';

export default {
  components: {
    Empty,
    Grade,
  },
  data() {
    return {
      loading: false,
      dialogScoreVisible: false,
      queryForm: {
        page: 1,
        size: 10,
        name: '',
        is_deleted: '',
        daterange: [],
        factory_id: '',
      },
      queryScoreForm: {
        user_id: '',
        group_id: '',
        group_name: '',
        user_name: '',
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
      apparatusAdminList(this.queryForm)
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
    getType(type) {
      switch (type) {
        case 1:
          return '科研组室';
        case 2:
          return '课题组';
        case 3:
          return '科研个人账户';
      }
    },
    toAdd(id = '') {
      if (!id) {
        this.$router.push({ path: '/research-group/add' });
      } else {
        this.$router.push({ path: '/research-group/edit/' + id });
      }
    },
    toScoreList(row) {
      this.scoreList = [];
      this.queryScoreForm.group_id = row.id;
      this.queryScoreForm.group_name = row.name;
      this.dialogScoreVisible = true;
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
    checkNode(node) {
      return checkNode(node);
    },
  },
};
</script>
<style lang="scss"></style>
