<template>
  <div v-loading="loading" class="app-container" element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading">
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="名称">
        <el-input v-model="queryForm.name" class="max-width-150" size="small" clearable placeholder="请填写科研组室名称" />
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="queryForm.type" :clearable="true" size="small" class="max-width-150" placeholder="类型">
          <el-option label="子平台" value="1"></el-option>
          <el-option label="实验室" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="单位">
        <el-select v-model="queryForm.factory_id" :clearable="false" size="small" class="max-width-150"
          placeholder="单位">
          <el-option :label="factory.name" :value="factory.id" :key="idx"
            v-for="(factory,idx) in getSelectableFactories()"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button round size="small" @click="resetQuery">查询</el-button>
        <!-- <el-button round size="small" @click="exportData">导出数据</el-button> -->
      </el-form-item>
      <el-form-item v-if="checkNode('add_platform')" class="right">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd(0)">新建科研组室</el-button>
      </el-form-item>
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="admin_name" label="负责人姓名" />
      <el-table-column prop="admin_mobile" label="负责人手机号" />
      <el-table-column prop="parent_name" label="上级" />
      <el-table-column label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 1">子平台</el-tag>
          <el-tag v-if="scope.row.type === 2">实验室</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column label="状态">
            <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.is_deleted === 0">正常</el-tag>
                <el-tag type="danger" v-if="scope.row.is_deleted === 1">已删除</el-tag>
            </template>
        </el-table-column> -->
      <el-table-column prop="factory_id" label="单位">
        <template slot-scope="scope">
          {{getFactoryName(scope.row.factory_id)}}
        </template>
      </el-table-column>
      <el-table-column v-if="checkNode('edit_research_group') || checkNode('delete_research_group')" width="180"
        label="操作">
        <template slot-scope="scope" v-if="scope.row.id !== 0">
          <el-button v-if="checkNode('edit_research_group')" size="mini" type="primary"
            @click="toAdd(scope.row.id)">修改</el-button>
          <el-button v-if="checkNode('delete_research_group') && scope.row.is_deleted === 0" size="mini" type="danger"
            @click="handleDelete(scope.row, 1)">删除</el-button>
          <el-button v-if="checkNode('delete_research_group') && scope.row.is_deleted === 1" size="mini" type="info"
            @click="handleDelete(scope.row, 0)">恢复</el-button>
          <!-- <div v-if="checkNode('platform_grade_list')" style="margin-top: 10px;">
                    <el-button
                        size="mini"
                        type="success"
                        @click="toScoreList(scope.row)"
                    >评分列表</el-button>
                </div> -->
        </template>
      </el-table-column>
      <div slot="empty">
        <empty />
      </div>
    </el-table>
    <el-pagination class="dl-pagination" :hide-on-single-page="true" background :page-sizes="[10, 30, 50]"
      layout="total, prev, pager, next, sizes, jumper" :total="total" :current-page="queryForm.page"
      :page-size="queryForm.size" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    <el-dialog :title="queryScoreForm.platform_name + '的评分'" :modal="false" :visible.sync="dialogScoreVisible"
      :fullscreen="true">
      <grade v-if="dialogScoreVisible" :target_type="2" :target_id="queryScoreForm.platform_id" :source_type="1"
        :source_id="0" :platform_name="queryScoreForm.platform_name" :add_auth="1" :edit_auth="1" :delete_auth="1" />
    </el-dialog>
  </div>
</template>
<script>
  import {
    platformList,
    deletePlatform
  } from '@/api/platform';
  import {
    checkNode
  } from '@/utils/validate';
  import Grade from '@/components/Grade';
  import Empty from '@/components/Empty';

  export default {
    components: {
      Empty,
      Grade,
    },
    data() {
      return {
        loading: false,
        dialogScoreVisible: false,
        queryForm: {
          page: 1,
          size: 10,
          sort: 'created_at',
          sort_type: 'desc',
          idgta: 0,
          name: '',
          admin_id: '',
          parent_id: '',
          type: '',
          is_deleted: '',
          factory_id: '',
        },
        queryScoreForm: {
          user_id: '',
          platform_id: '',
          platform_name: '',
          user_name: '',
        },
        list: [],
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
        platformList(this.queryForm)
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
      //导出数据为excel
      exportData() {
        let vm = this;
        let params = Object.keys(this.queryForm)
          .map(function(key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(vm.queryForm[key]);
          })
          .join('&');
        let url = process.env.VUE_APP_BASE_API + '/platform/export?from=fronted&' + params;
        window.open(url);
      },
      handleDelete(row, status) {
        const text = status === 0 ? '恢复' : '删除';
        this.$confirm('确定要' + text + '"' + row.name + '"吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          deletePlatform({
            platform_id: row.id,
            is_deleted: status,
          }).then((response) => {
            if (response.status === 1) {
              this.queryList();
            }
          });
        });
      },
      toAdd(id = '') {
        if (!id) {
          this.$router.push({
            path: '/platform/add',
          });
        } else {
          this.$router.push({
            path: '/platform/edit/' + id,
          });
        }
      },
      toScoreList(row) {
        this.scoreList = [];
        this.queryScoreForm.platform_id = row.id;
        this.queryScoreForm.platform_name = row.name;
        this.dialogScoreVisible = true;
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
<style lang="scss"></style>
