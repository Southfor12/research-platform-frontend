<template>
  <div v-loading="loading" class="app-container" element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading">
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="单位">
        <el-select v-model="queryForm.factory_id" :clearable="false" size="small" class="max-width-150"
          placeholder="单位">
          <el-option :label="factory.name" :value="factory.id" :key="idx"
            v-for="(factory,idx) in getSelectableFactories()"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button round size="small" @click="resetQuery">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <el-table-column prop="exam_name" label="考试名称" />
      <el-table-column prop="exam_total_score" label="满分" />
      <el-table-column prop="exam_pass_score" label="合格分数线" />
      <el-table-column prop="user_score" label="我的得分" />
      <el-table-column label="考试结果">
        <template slot-scope="scope">
          <el-tag v-if="
              scope.row.user_score >= scope.row.exam_pass_score &&
              scope.row.user_score < scope.row.exam_total_score
            ">合格</el-tag>
          <el-tag v-else-if="scope.row.user_score === scope.row.exam_total_score" type="success">满分</el-tag>
          <el-tag v-else type="danger">不合格</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="考试时间" />
      <el-table-column prop="factory_id" label="单位">
        <template slot-scope="scope">
          {{getFactoryName(scope.row.factory_id)}}
        </template>
      </el-table-column>
      <div slot="empty">
        <empty />
      </div>
    </el-table>
    <el-pagination class="dl-pagination" :hide-on-single-page="true" background :page-sizes="[10, 30, 50]"
      layout="total, prev, pager, next, sizes, jumper" :total="total" :current-page="queryForm.page"
      :page-size="queryForm.size" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>
</template>
<script>
  import {
    examRecordList
  } from '@/api/security';
  import {
    mapGetters
  } from 'vuex';
  import {
    checkNode
  } from '@/utils/validate';
  import Empty from '@/components/Empty';

  export default {
    components: {
      Empty,
    },
    computed: {
      ...mapGetters(['member']),
    },
    data() {
      return {
        loading: false,
        queryForm: {
          page: 1,
          size: 10,
          sort: 'created_at',
          sort_type: 'desc',
          is_deleted: 0,
          user_id: '',
          factory_id: '',
        },
        domain: process.env.VUE_APP_DOMAIN,
        list: [],
        total: 0,
      };
    },
    created() {
      this.queryForm.factory_id = this.currentFactoryId;
      this.queryForm.user_id = this.member.id;
      this.queryList();
    },
    methods: {
      queryList() {
        this.loading = true;
        examRecordList(this.queryForm)
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
      handleSizeChange(val) {
        this.queryForm.size = val;
        this.queryList();
      },
      handleCurrentChange(val) {
        this.queryForm.page = val;
        this.queryList();
      },
      checkNode(node) {
        return checkNode(node);
      },
      indexMethod(index) {
        return index + (this.queryForm.page - 1) * this.queryForm.size + 1;
      },
    },
  };
</script>
