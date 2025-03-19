<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="名称">
        <el-input
          v-model="queryForm.name"
          size="small"
          class="width-300"
          clearable
          placeholder="培训名称"
        />
      </el-form-item>
      <el-form-item label="科研组室">
        <el-select
          v-model="queryForm.platform_id"
          :clearable="true"
          size="small"
          class="max-width-150"
          placeholder="实验室"
        >
          <el-option v-for="item in platforms" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="类型">
        <el-select
          v-model="queryForm.type"
          :clearable="true"
          size="small"
          class="max-width-150"
          placeholder="类型"
        >
          <el-option value="1" label="仪器培训">仪器培训</el-option>
          <el-option value="2" label="服务培训">服务培训</el-option>
          <el-option value="3" label="技术培训">技术培训</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          v-model="queryForm.daterange"
          type="daterange"
          size="small"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
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
      <el-form-item v-if="checkNode('add_train_content')" class="right">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd(0)"
          >添加培训内容</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column width="60px" type="index" :index="indexMethod" label="序号" />
      <el-table-column prop="name" label="培训名称">
        <template slot-scope="scope">
          <span
            style="color: #5a9cf8; cursor: pointer"
            @click="jumpToApplyList(scope.row.id, scope.row.name)"
          >
            {{ scope.row.name }}</span><br/>
            <span style="color:#ccc">{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="platform_name" label="科研组室" />
      <el-table-column prop="leader_name" label="负责人" />
      <el-table-column prop="charge" label="费用" />
      <el-table-column prop="charge" label="实际/最大报名人数">
        <template slot-scope="scope">
          <span style="color: green"> {{ scope.row.train_user_number }}</span>
          {{ '/' + scope.row.max_people }}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="max_people" label="最大报名人数" />
      <el-table-column prop="train_user_number" label="实际报名人数" /> -->
      <el-table-column prop="train_passed_user" label="通过人数" />
      <el-table-column label="类型">
        <template slot-scope="scope">
          {{ getTypes(scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column label="可取消报名">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.can_cancel" type="success">是</el-tag>
          <el-tag v-else>否</el-tag><br />
          <span style="color: #bbb">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否发布">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.is_published" type="success">已发布</el-tag>
          <el-tag v-else>未发布</el-tag><br />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="created_at" width="100" />
      <el-table-column prop="factory_id" label="单位">
          <template slot-scope="scope">
            {{getFactoryName(scope.row.factory_id)}}
          </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        v-if="checkNode('edit_train_content') || checkNode('delete_train_content')"
        width="180"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            v-if="checkNode('edit_train_content')"
            size="mini"
            type="primary"
            @click="toAdd(scope.row.id)"
            >修改</el-button
          >
          <el-button
            v-if="checkNode('delete_train_content') && scope.row.is_deleted === 0"
            size="mini"
            type="danger"
            @click="handleDelete(scope.row, 1)"
            >删除</el-button
          >
          <el-button
            v-if="checkNode('delete_train_content') && scope.row.is_deleted === 1"
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
import { platformList } from '@/api/platform';
import { trainList, deleteTrain } from '@/api/train';
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
        name: '',
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        permanent: 0,
        platform_id: '',
        type: '',
        daterange: [],
        factory_id: '',
      },
      platforms: [],
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
    jumpToApplyList(trainId, trainName) {
      localStorage.setItem('train_id', trainId);
      localStorage.setItem('train_name', trainName);

      this.$router.push('/train-enroll/list');
    },
    queryList() {
      this.loading = true;
      trainList(this.queryForm)
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
          return '仪器培训';
        case 2:
          return '服务培训';
        case 3:
          return '技术培训';
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
        deleteTrain({
          id: row.id,
          is_deleted: status,
        }).then((response) => {
          if (response.status === 1) {
            this.queryList();
          }
        });
      });
    },
    getPlatforms() {
      platformList({
        page: 1,
        size: 100,
        is_deleted: 0,
      }).then((res) => {
        if (res.status === 200) {
          this.platforms = res.data.data;
        }
      });
    },
    toAdd(id = '') {
      if (!id) {
        this.$router.push({
          path: '/train/add',
        });
      } else {
        this.$router.push({
          path: '/train/edit/' + id,
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
<style lang="scss"></style>
