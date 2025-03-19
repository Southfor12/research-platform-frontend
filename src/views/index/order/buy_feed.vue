<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <div style="font-weight: bolder">饲养订购</div>
    <hr />
    <br />
    <br />
    <br />
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="区域">
        <el-select v-model="queryForm.area_type" class="max-width-150" size="small" clearable>
          <el-option label="全部" value="" />
          <el-option label="普通区" value="普通区" />
          <el-option label="屏障区" value="屏障区" />
        </el-select>
      </el-form-item>

      <!-- <el-form-item label="楼层">
        <el-input v-model="queryForm.floor_number" class="max-width-150" size="small" clearable />
      </el-form-item> -->

      <el-form-item label="动物类型">
        <el-input v-model="queryForm.animal_type" class="max-width-150" size="small" clearable />
      </el-form-item>

      <el-form-item>
        <el-button round size="small" @click="resetQuery">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <el-table-column prop="area_type" label="区域" />
      <!-- <el-table-column prop="floor_number" label="楼层" /> -->
      <el-table-column prop="room_name" label="房间" />
      <el-table-column prop="animal_type" label="动物类型" />
      <el-table-column prop="rest" label="总可用笼位" />
      <el-table-column prop="stats_date" label="统计日期" />

      <el-table-column width="180" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="toAdd(scope.row.id)">立即申请 </el-button>
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
      :page-size="queryForm.page_size"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
            <script>
import { getFeed, delFeed } from '@/api/product';
import Empty from '@/components/Empty';

export default {
  components: {
    Empty,
  },
  data() {
    return {
      index: 1,
      loading: false,
      queryForm: {
        page: 1,
        page_size: 10,
        // sort: 'created_at',
        // sort_type: 'desc',
        // platform_id: '',
        id: '',
        number: '',
        area_type: '', //区域
        room_name: '',
        floor_number: '',
        animal_type: '',
        stats_date: '',
        rest: '',
        is_deleted: false,
        no_deleted: true,
      },
      list: [],
      total: 0,
    };
  },
  created() {
    this.queryList();
  },
  methods: {
    queryList() {
      this.loading = true;
      getFeed(this.queryForm)
        .then((res) => {
          this.loading = false;
          this.list = res.data.content;
          this.total = res.data.totalElements;
        })
        .catch((_) => {
          this.loading = false;
        });
    },
    resetQuery() {
      this.queryForm.page = 1;
      this.queryList();
    },

    toAdd(id = '') {
      this.$router.push({ path: '/buy-feed-add/' + id });
    },
    indexMethod(index) {
      return index + (this.queryForm.page - 1) * this.queryForm.page_size + 1;
    },
    handleSizeChange(val) {
      this.queryForm.page_size = val;
      this.queryList();
    },
    handleCurrentChange(val) {
      this.queryForm.page = val;
      this.queryList();
    },
  },
};
</script>
            
            