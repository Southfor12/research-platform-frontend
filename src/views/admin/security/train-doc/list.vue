<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="名称">
        <el-input v-model="queryForm.name" class="max-width-150 max-width-120" size="small" clearable />
      </el-form-item>
      <el-form-item label="子平台/实验室">
        <el-select
          v-model="queryForm.platform_id"
          size="small"
          clearable
          class="max-width-300 max-width-170"
          filterable
          reserve-keyword
          placeholder="请选择子平台/实验室"
        >
          <el-option
            v-for="(item, index) in platforms"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="单位">
        <el-select
          v-model="queryForm.factory_id"
          :clearable="false"
          size="small"
          class="max-width-150 max-width-100"
          placeholder="单位"
        >
          <el-option
            v-for="(factory, idx) in getSelectableFactories()"
            :label="factory.name"
            :value="factory.id"
            :key="idx"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button round size="small" @click="resetQuery">查询</el-button>
      </el-form-item>
      <el-form-item v-if="checkNode('add_train_doc')" class="right">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd(0)"
          >添加学习资料</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <el-table-column prop="name" label="名称" />
      <el-table-column label="类型">
        <template slot-scope="scope">
          {{ getTypes(scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column prop="platform_name" label="归属" />
      <el-table-column label="开放学习">
        <template slot-scope="scope">
          {{ scope.row.is_published ? '是' : '否' }}
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
          {{ getFactoryName(scope.row.factory_id) }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkNode('edit_train_doc') || checkNode('delete_train_doc')"
        width="180"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            v-if="checkNode('edit_train_doc')"
            size="mini"
            type="primary"
            @click="toAdd(scope.row.id)"
            >修改</el-button
          >
          <el-button
            v-if="checkNode('delete_train_doc') && scope.row.is_deleted === 0"
            size="mini"
            type="danger"
            @click="handleDelete(scope.row, 1)"
            >删除</el-button
          >
          <el-button
            v-if="checkNode('delete_train_doc') && scope.row.is_deleted === 1"
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
import { trainDocList, deleteTrainDoc } from '@/api/security';
import { platformList } from '@/api/platform';
import { checkNode } from '@/utils/validate';
import Empty from '@/components/Empty';

export default {
  components: {
    Empty,
  },
  data() {
    return {
      loading: false,
      queryForm: {
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        platform_id: '',
        name: '',
        factory_id: '',
      },
      platforms: [{ id: 0, name: '总平台' }],
      list: [],
      total: 0,
    };
  },
  created() {
    this.queryForm.factory_id = this.currentFactoryId;
    this.queryList();
    this.getPlatforms();
  },
  methods: {
    queryList() {
      this.loading = true;
      trainDocList(this.queryForm)
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
    handleDelete(row, status) {
      const text = status === 0 ? '恢复' : '删除';
      this.$confirm('确定要' + text + '"' + row.name + '"吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteTrainDoc({ id: row.id, is_deleted: status }).then((response) => {
          if (response.status === 1) {
            this.queryList();
          }
        });
      });
    },
    toAdd(id = '') {
      if (!id) {
        this.$router.push({ path: '/train-doc/add' });
      } else {
        this.$router.push({ path: '/train-doc/edit/' + id });
      }
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
<style lang="scss">
.max-width-120{
  width: 130px !important;
}
.max-width-170{
  width: 170px !important;
}

.max-width-100{
  width: 100px !important;
}
</style>
