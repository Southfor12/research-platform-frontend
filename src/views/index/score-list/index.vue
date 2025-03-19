<template>
  <div>
    <el-table :data="list" border style="width: 100%">
      <el-table-column type="index" :index="indexDdMethod" label="序号" width="50" />
      <el-table-column prop="user_name" label="姓名" />
      <el-table-column prop="score" label="扣分分值" />
      <el-table-column prop="note" label="描述" />
      <el-table-column prop="created_at" label="时间" />
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
import { userScoreList } from '@/api/user';
import Empty from '@/components/Empty';

export default {
  components: {
    Empty,
  },
  data() {
    return {
      queryForm: {
        page: 1,
        size: 5,
        sort: 'created_at',
        sort_type: 'desc',
        type: -1,
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
      userScoreList(this.queryForm).then((res) => {
        if (res.status === 200) {
          this.list = res.data.data;
          this.total = res.data.total;
        }
      });
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
