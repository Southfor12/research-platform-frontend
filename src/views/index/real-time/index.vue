<template>
  <div>
    <el-table class="index-common-table" :data="list" border style="width: 100%">
      <el-table-column type="index" :index="indexDdMethod" label="序号" width="50" />
      <el-table-column prop="apparatus_no" label="设备编号"> </el-table-column>
      <el-table-column label="设备名称" width="160">
        <template slot-scope="scope">
          <a href="#" @click="navOpen('/appointment/detail/' + scope.row.apparatus_id)">{{
            scope.row.apparatus_name
          }}</a>
        </template>
      </el-table-column>
      <el-table-column width="150px" prop="platform_name" label="归属"> </el-table-column>
      <el-table-column prop="user_name" label="使用人"> </el-table-column>
      <el-table-column label="实时状况">
        <template>
          <el-tag type="success">正在进行</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="apparatus_admin_name" label="管理员"> </el-table-column>
      <div slot="empty">
        <empty description="暂无实时实验" />
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
      @current-change="handlePageChange"
    />
  </div>
</template>
<script>
import { bookingList } from '@/api/apparatus';
import Empty from '@/components/Empty';

export default {
  components: {
    Empty,
  },
  data() {
    return {
      list: [],
      total: 0,
      queryForm: {
        page: 1,
        size: 10,
        is_deleted: 0,
        sort: 'created_at',
        from: 'frontend',
        sort_type: 'desc',
        is_working: 1,
      },
    };
  },
  created() {
    this.queryList();
  },
  methods: {
    queryList() {
      bookingList(this.queryForm).then((res) => {
        if (res.status === 200) {
          this.list = res.data.data;
          this.total = res.data.total;
        }
      });
    },
    handlePageChange(val) {
      this.queryForm.page = val;
      this.queryList();
    },
    indexDdMethod(index) {
      return index + (this.queryForm.page - 1) * this.queryForm.size + 1;
    },
  },
};
</script>
<style lang="scss" scoped>
.is-working {
  padding: 5px;
  color: #efefef;
  background: #397919;
}
</style>
