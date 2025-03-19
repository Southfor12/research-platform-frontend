<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="仪器">
        <el-select
          v-model="queryForm.apparatus_id"
          size="small"
          clearable
          class="max-width-150"
          filterable
          remote
          reserve-keyword
          @change="apparatusChange"
          :remote-method="getApparatus"
          placeholder="输入名称搜索选择"
        >
          <el-option v-for="item in apparatus" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="queryForm.name" class="max-width-150" size="small" clearable />
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="checked" @change="platformChange">平台题组</el-checkbox>
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
      <el-form-item v-if="checkNode('add_exam')" class="right">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd(0)"
          >添加考试题组</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <el-table-column prop="name" label="名称" />
      <el-table-column label="总分">
        <template slot-scope="scope"> {{ scope.row.total_score }}分 </template>
      </el-table-column>
      <el-table-column label="合格分数">
        <template slot-scope="scope"> {{ scope.row.pass_score }}分 </template>
      </el-table-column>
      <el-table-column label="类型">
        <template slot-scope="scope">
          {{ scope.row.platform_id ? '子平台/实验室' : scope.row.apparatus_id ? '仪器' : '平台' }}
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
      <el-table-column
        v-if="checkNode('edit_exam') || checkNode('delete_exam')"
        width="180"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            v-if="checkNode('edit_exam')"
            size="mini"
            type="primary"
            @click="toAdd(scope.row.id)"
            >修改</el-button
          >
          <el-button
            v-if="checkNode('delete_exam') && scope.row.is_deleted === 0"
            size="mini"
            type="danger"
            @click="handleDelete(scope.row, 1)"
            >删除</el-button
          >
          <el-button
            v-if="checkNode('delete_exam') && scope.row.is_deleted === 1"
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
import { examList, deleteExam } from '@/api/security';
import { apparatusList } from '@/api/apparatus';
import { checkNode } from '@/utils/validate';
import Empty from '@/components/Empty';

export default {
  components: {
    Empty,
  },
  data() {
    return {
      loading: false,
      checked: false,
      queryForm: {
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        platform_id: '',
        apparatus_id: '',
        name: '',
        factory_id: '',
      },
      searchApparatusForm: {
        page: 1,
        size: 30,
        is_deleted: 0,
        name: '',
      },
      list: [],
      apparatus: [],
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
      examList(this.queryForm)
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
    platformChange(value) {
      if (value) {
        this.queryForm.platform_id = 0;
        this.queryForm.apparatus_id = '';
      }
    },
    apparatusChange(value) {
      if (value) {
        this.queryForm.platform_id = '';
        this.checked = false;
      }
    },
    getApparatus(query = '') {
      this.searchApparatusForm.name = query;
      apparatusList(this.searchApparatusForm).then((res) => {
        if (res.status === 200) {
          this.apparatus = res.data.data;
        }
      });
    },
    handleDelete(row, status) {
      const text = status === 0 ? '恢复' : '删除';
      this.$confirm('确定要' + text + '"' + row.name + '"吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteExam({ id: row.id, is_deleted: status }).then((response) => {
          if (response.status === 1) {
            this.queryList();
          }
        });
      });
    },
    toAdd(id = '') {
      if (!id) {
        this.$router.push({ path: '/exam/add' });
      } else {
        this.$router.push({ path: '/exam/edit/' + id });
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
