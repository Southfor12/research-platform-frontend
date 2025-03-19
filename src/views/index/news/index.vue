<template>
  <div>
    <el-form :inline="true" class="search-form">
      <el-form-item>
        <el-input
          size="small"
          v-model="queryForm.name"
          :clearable="true"
          placeholder="搜索内容"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="submit">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" border style="width: 100%">
      <el-table-column prop="name" label="标题">
        <template slot-scope="scope">
          <span
            style="
              margin-left: 6px;
              margin-bottom: 0px;
              display: inline-block;
              width: 8px;
              height: 8px;
              background: #d5d2d1;
            "
          ></span>
          <span
            class="common-link"
            @click="navTo('/' + tagName + '/detail/' + scope.row.id)"
            :title="scope.row.name"
            >{{ scope.row.name }}</span
          >
        </template>
      </el-table-column>
      <el-table-column label="类型" v-if="!queryForm.type">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 1">规章制度</el-tag>
          <el-tag v-if="scope.row.type === 2">通知公告</el-tag>
          <el-tag v-if="scope.row.type === 3">新闻动态</el-tag>
          <el-tag v-if="scope.row.type === 4">经验交流</el-tag>
          <el-tag v-if="scope.row.type === 5">文档下载</el-tag>
        </template>
      </el-table-column>
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
import { newsList } from '@/api/news';
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
        type: '',
        name: '',
        sort: 'created_at',
        is_deleted: 0,
        sort_type: 'desc',
      },
      tagName: '',
    };
  },
  created() {
    if (this.$route.query.search) this.queryForm.name = this.$route.query.search;
    this.tagName = this.$route.meta.tagName;
    switch (this.$route.meta.tagName) {
      case 'regulations':
        this.queryForm.type = 1;
        break;
      case 'notes':
        this.queryForm.type = 2;
        break;
      case 'news':
        this.queryForm.type = 3;
        break;
      case 'communication':
        this.queryForm.type = 4;
        break;
      case 'doc-download':
        this.queryForm.type = 5;
        break;
      case 'science':
        this.queryForm.type = 6;
        break;
      case 'education':
        this.queryForm.type = 7;
        break;
      case 'organisms':
        this.queryForm.type = 8;
        break;
      case 'animal':
        this.queryForm.type = 9;
        break;
      case 'sharing':
        this.queryForm.type = 10;
        break;
      case 'gmp':
        this.queryForm.type = 11;
        break;
      case 'publab':
        this.queryForm.type = 12;
        break;
      case 'hcsmng':
        this.queryForm.type = 13;
        break;
      case 'securityedu':
        this.queryForm.type = 14;
        break;
      case 'inrules':
        this.queryForm.type = 15;
        break;
      case 'inprocess':
        this.queryForm.type = 16;
        break;
      case 'apparatustrain':
        this.queryForm.type = 17;
        break;
      case 'techtrain':
        this.queryForm.type = 18;
        break;
      case 'rechargeinfo':
        this.queryForm.type = 19;
        break;
      case 'apparatusrules':
        this.queryForm.type = 20;
        break;
    }
    this.queryList();
  },
  methods: {
    queryList() {
      this.loading = true;
      newsList(this.queryForm)
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
    submit() {
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
<style lang="scss">
.search-form {
  text-align: right;
}
</style>
