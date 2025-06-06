<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="获奖项目">
        <el-input
          v-model="queryForm.title"
          class="max-width-150"
          size="small"
          clearable
          placeholder="获奖项目"
        />
      </el-form-item>
      <el-form-item label="类型">
        <el-select
          v-model="queryForm.type"
          :clearable="true"
          size="small"
          class="max-width-150"
          placeholder="类型"
        >
          <el-option
            v-for="(item, index) in awardType"
            :key="index"
            :label="item"
            :value="index"
          ></el-option>
        </el-select>
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
            v-for="(item, index) in awardLevel"
            :key="index"
            :label="item"
            :value="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课题组">
        <el-select
          v-model="queryForm.research_group_id"
          :clearable="true"
          size="small"
          class="max-width-150"
          placeholder="课题组"
        >
          <el-option v-for="item in research" :key="item.id" :label="item.name" :value="item.id" />
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
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <el-table-column prop="name" label="奖项名称" />
      <el-table-column prop="title" label="获奖项目" />
      <el-table-column prop="department" label="获奖部门" />
      <el-table-column prop="user_name" label="提交人" />
      <el-table-column prop="rank" label="本人排名/总人数" />
      <el-table-column label="类型">
        <template slot-scope="scope">
          {{ awardType[scope.row.type] }}
        </template>
      </el-table-column>
      <el-table-column label="级别">
        <template slot-scope="scope">
          {{ awardLevel[scope.row.level] }}
        </template>
      </el-table-column>
      <el-table-column label="得分">
        <template slot-scope="scope">
          {{ scope.row.status ? scope.row.score : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="是否加入平台致谢">
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
      <el-table-column prop="time" label="颁奖年月" />
      <el-table-column prop="factory_id" label="单位">
          <template slot-scope="scope">
            {{getFactoryName(scope.row.factory_id)}}
          </template>
      </el-table-column>
      <el-table-column v-if="checkNode('sci_award_audit')" width="220" label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status === 1 || scope.row.status === 0"
            size="mini"
            type="error"
            @click="handleAudit(scope.row, -1)"
            >不通过</el-button
          >
          <el-button
            v-if="scope.row.status === -1 || scope.row.status === 0"
            size="mini"
            type="success"
            @click="handleAudit(scope.row, 1)"
            >通过</el-button
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
import { sciAwardList, deleteSciAward, auditSciAward } from '@/api/scientific';
import { researchGroupList } from '@/api/research';
import { checkNode } from '@/utils/validate';
import scientificMixin from '@/mixins/scientific';
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
        title: '',
        type: '',
        level: '',
        research_group_id: '',
        factory_id: '',
      },
      domain: process.env.VUE_APP_DOMAIN,
      list: [],
      research: [],
      total: 0,
    };
  },
  created() {
    this.queryForm.factory_id = this.currentFactoryId;
    this.queryResearchList();
    this.queryList();
  },
  methods: {
    queryList() {
      this.loading = true;
      sciAwardList(this.queryForm)
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
    queryResearchList() {
      researchGroupList({ page: 1, size: 30, is_deleted: 0 }).then((res) => {
        if (res.status === 200) {
          this.research = res.data.data;
        }
      });
    },
    handleDelete(row, status) {
      const text = status === 0 ? '恢复' : '删除';
      this.$confirm('确定要' + text + '"' + row.title + '"吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteSciAward({ id: row.id, is_deleted: status }).then((response) => {
          if (response.status === 1) {
            this.queryList();
          }
        });
      });
    },
    handleAudit(row, status) {
      const text = status === 1 ? '通过' : '不通过';
      this.$confirm('确定要' + text + '吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        auditSciAward({ id: row.id, status: status }).then((response) => {
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
        this.$router.push({ path: '/info-center/award/add' });
      } else {
        this.$router.push({ path: '/info-center/award/edit/' + id });
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
