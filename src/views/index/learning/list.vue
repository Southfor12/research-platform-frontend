<template>
  <div>
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="子平台/实验室">
        <el-select
          v-model="queryForm.platform_id"
          size="small"
          clearable
          class="max-width-300"
          filterable
          reserve-keyword
          placeholder="请选择子平台/实验室"
        >
          <el-option v-for="item in platforms" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button round size="small" @click="resetQuery">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" border style="width: 100%">
      <el-table-column type="index" :index="indexDdMethod" label="序号" width="50" />
      <el-table-column prop="name" label="标题">
        <template slot-scope="scope">
          <a href="#" @click="navOpen('/learning/detail/' + scope.row.id)">{{ scope.row.name }}</a>
        </template>
      </el-table-column>
      <el-table-column label="类型">
        <template slot-scope="scope">
          {{ getTypes(scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column prop="platform_name" label="归属" />
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
import { trainDocList } from '@/api/security';
import { platformList } from '@/api/platform';
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
        is_published: 1,
        platform_id: '',
        sort: 'created_at',
        is_deleted: 0,
        sort_type: 'desc',
      },
      platforms: [{ id: 0, name: '总平台' }],
      tagName: '',
    };
  },
  created() {
    this.queryList();
    this.getPlatforms();
  },
  methods: {
    queryList() {
      trainDocList(this.queryForm).then((res) => {
        if (res.status === 200) {
          this.list = res.data.data;
          this.total = res.data.total;
        }
      });
    },
    getTypes(type) {
      switch (type) {
        case 1:
          return '在线文档资料';
        case 2:
          return '视频资料';
        case 3:
          return '下载资料';
      }
    },
    resetQuery() {
      this.queryForm.page = 1;
      this.queryList();
    },
    getPlatforms() {
      platformList({ page: 1, size: 100, is_deleted: 0 }).then((res) => {
        if (res.status === 200) {
          res.data.data.forEach((item) => {
            this.platforms.push(item);
          });
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
