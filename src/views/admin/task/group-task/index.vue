<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
        placeholder="搜索任务名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.groupId" placeholder="选择小组" clearable class="filter-item">
        <el-option v-for="item in groupOptions" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="任务名称" prop="name" align="center" />
      <el-table-column label="所属小组" prop="groupName" align="center" />
      <el-table-column label="创建时间" prop="createTime" align="center" />
      <el-table-column label="状态" prop="status" align="center" />
      <el-table-column label="操作" align="center" width="230">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleView(row)">
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'

export default {
  name: 'GroupTask',
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      groupOptions: [], // 小组选项
      listQuery: {
        page: 1,
        limit: 20,
        keyword: undefined,
        groupId: undefined
      }
    }
  },
  created() {
    this.getList()
    this.getGroupOptions()
  },
  methods: {
    getList() {
      this.listLoading = true
      // TODO: 调用API获取小组任务列表
      this.listLoading = false
    },
    getGroupOptions() {
      // TODO: 获取小组选项列表
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleView(row) {
      // TODO: 实现查看任务详情功能
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-container {
  padding-bottom: 10px;
  .filter-item {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 10px;
    margin-right: 10px;
  }
}
</style> 