<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="项目名称">
        <el-input
          v-model="queryForm.title"
          class="max-width-150"
          size="small"
          clearable
          placeholder="项目名称"
        />
      </el-form-item>
      <el-form-item label="级别">
        <el-select
          v-model="queryForm.level"
          :clearable="true"
          size="small"
          class="max-width-150"
          placeholder="级别"
        >
          <el-option
            v-for="(item, index) in level"
            :key="index"
            :label="item"
            :value="index"
          ></el-option>
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
      <el-form-item class="right">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd(0)"
          >添加科研项目</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <el-table-column prop="title" label="项目名称" />
      <el-table-column prop="source" label="项目来源" />
      <el-table-column prop="rank" label="本人排名/总人数" />
      <el-table-column label="级别">
        <template slot-scope="scope">
          {{ level[scope.row.level] }}
        </template>
      </el-table-column>
      <el-table-column label="得分">
        <template slot-scope="scope">
          {{ scope.row.status ? scope.row.score : '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="金额/万元" />
      <el-table-column label="是否结题">
        <template slot-scope="scope">
          {{ scope.row.is_final ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column label="是否致谢平台">
        <template slot-scope="scope">
          {{ scope.row.is_thank ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" type="success">已通过</el-tag>
          <el-tag v-if="scope.row.status === 0" type="info">审核中</el-tag>
          <el-tag v-if="scope.row.status === -1" type="danger">未通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="立项年月" />
      <el-table-column prop="factory_id" label="单位">
        <template slot-scope="scope">
          {{getFactoryName(scope.row.factory_id)}}
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="180" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="toAdd(scope.row.id)">修改</el-button>
          <el-button
            v-if="scope.row.is_deleted === 0"
            size="mini"
            type="danger"
            @click="handleDelete(scope.row, 1)"
            >删除</el-button
          >
          <el-button
            v-if="scope.row.is_deleted === 1"
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
import { sciProjectList, deletePersonalSciProject } from '@/api/scientific';
import { checkNode } from '@/utils/validate';
import scientificMixin from '@/mixins/scientific';
import { mapGetters } from 'vuex';
import Empty from '@/components/Empty';

export default {
  components: {
    Empty,
  },
  mixins: [scientificMixin],
  data() {
    return {
      loading: false,
      queryForm: {
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        user_id: '',
        title: '',
        type: '',
        level: '',
        factory_id: '',
      },
      domain: process.env.VUE_APP_DOMAIN,
      list: [],
      total: 0,
    };
  },
  computed: {
    ...mapGetters(['member']),
  },
  created() {
    this.queryForm.factory_id = this.currentFactoryId;
    this.queryForm.user_id = this.member.id;
    this.queryList();
  },
  methods: {
    queryList() {
      this.loading = true;
      sciProjectList(this.queryForm)
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
    handleDelete(row, status) {
      const text = status === 0 ? '恢复' : '删除';
      this.$confirm('确定要' + text + '"' + row.title + '"吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deletePersonalSciProject({
          id: row.id,
          is_deleted: status,
        }).then((response) => {
          if (response.status === 1) {
            this.queryList();
          }
        });
      });
    },
    getImportance(importance) {
      switch (importance) {
        case 1:
          return '一般';
        case 2:
          return '特殊';
        case 3:
          return '贵重';
      }
    },
    toAdd(id = '') {
      if (!id) {
        this.$router.push({
          path: '/info-center/project/add',
        });
      } else {
        this.$router.push({
          path: '/info-center/project/edit/' + id,
        });
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
