<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="仪器">
        <el-select
          v-model="queryForm.apparatus_id"
          size="small"
          clearable
          class="max-width-150"
          filterable
          remote
          reserve-keyword
          :remote-method="getApparatus"
          placeholder="输入名称搜索选择"
        >
          <el-option v-for="item in apparatus" :key="item.id" :label="item.name" :value="item.id" />
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
      <el-form-item v-if="checkNode('add_common_apparatus_time')" class="right">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd(0)"
          >添加通用可预约时间</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <el-table-column prop="apparatus_name" label="仪器名称" />
      <el-table-column label="月份">
        <template slot-scope="scope">
          {{ getMonth(scope.row.months) }}
        </template>
      </el-table-column>
      <el-table-column label="周">
        <template slot-scope="scope">
          {{ getWeek(scope.row.weeks) }}
        </template>
      </el-table-column>
      <el-table-column label="时间段">
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.book_time" :key="index">
            {{ getTime(item.start_at) }} -
            {{ getTime(item.end_at) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="factory_id" label="单位">
          <template slot-scope="scope">
            {{getFactoryName(scope.row.factory_id)}}
          </template>
      </el-table-column>
      <el-table-column
        v-if="checkNode('edit_common_apparatus_time') || checkNode('delete_common_apparatus_time')"
        width="180"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            v-if="checkNode('edit_common_apparatus_time')"
            size="mini"
            type="primary"
            @click="toAdd(scope.row.id)"
            >修改</el-button
          >
          <el-button
            v-if="checkNode('delete_common_apparatus_time') && scope.row.is_deleted === 0"
            size="mini"
            type="danger"
            @click="handleDelete(scope.row, 1)"
            >删除</el-button
          >
          <el-button
            v-if="checkNode('delete_common_apparatus_time') && scope.row.is_deleted === 1"
            size="mini"
            type="info"
            @click="handleDelete(scope.row, 0)"
            >恢复</el-button
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
  </div>
</template>
<script>
import { commonApparatusTimeList, deleteCommonApparatusTime } from '@/api/booking';
import { apparatusList } from '@/api/apparatus';
import { checkNode } from '@/utils/validate';
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
        sort: 'created_at',
        sort_type: 'desc',
        apparatus_id: '',
        factory_id: '',
      },
      searchApparatusForm: {
        page: 1,
        size: 30,
        is_deleted: 0,
        name: '',
      },
      domain: process.env.VUE_APP_DOMAIN,
      list: [],
      apparatus: [],
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
      commonApparatusTimeList(this.queryForm)
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
    getApparatus(query = '') {
      this.searchApparatusForm.name = query;
      apparatusList(this.searchApparatusForm).then((res) => {
        if (res.status === 200) {
          this.apparatus = res.data.data;
        }
      });
    },
    handleDelete(row, status) {
      const text = status === 0 ? '恢复' : '删除';
      this.$confirm('确定要' + text + '吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteCommonApparatusTime({
          id: row.id,
          is_deleted: status,
        }).then((response) => {
          if (response.status === 1) {
            this.queryList();
          }
        });
      });
    },
    getMonth(month) {
      return month.replace(new RegExp(/,/g), '月,') + '月';
    },
    getWeek(week) {
      return week
        .replace(/1/, '周一')
        .replace(/2/, '周二')
        .replace(/3/, '周三')
        .replace(/4/, '周四')
        .replace(/5/, '周五')
        .replace(/6/, '周六')
        .replace(/7/, '周日');
    },
    getTime(time) {
      return time.slice(0, 2) + ':' + time.slice(2, 4);
    },
    toAdd(id = '') {
      if (!id) {
        this.$router.push({ path: '/common-apparatus-time/add' });
      } else {
        this.$router.push({ path: '/common-apparatus-time/edit/' + id });
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
    indexMethod(index) {
      return index + (this.queryForm.page - 1) * this.queryForm.size + 1;
    },
    checkNode(node) {
      return checkNode(node);
    },
  },
};
</script>
