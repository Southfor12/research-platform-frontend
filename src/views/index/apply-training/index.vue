<template>
  <div>
    <el-table :data="list" border style="width: 100%">
      <el-table-column type="index" :index="indexDdMethod" label="序号" width="50" />
      <el-table-column prop="name" label="标题">
        <template slot-scope="scope">
          <span class="common-link" @click="navTo('/apply-training/detail/' + scope.row.id)">{{
            scope.row.name
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 1">仪器培训</el-tag>
          <el-tag v-if="scope.row.type === 2">服务培训</el-tag>
          <el-tag v-if="scope.row.type === 3">技术培训</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="platform_name" label="子平台/实验室" />
      <el-table-column prop="leader_name" label="负责人" />
      <el-table-column label="发布时间" width="180">
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
      list: [],
      total: 0,
      queryForm: {
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        permanent: 1,
        is_published: 1,
      },
    };
  },
  created() {
    this.queryList();
  },
  methods: {
    queryList() {
      trainList(this.queryForm).then((res) => {
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
