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
      <el-select v-model="listQuery.status" placeholder="任务状态" clearable class="filter-item">
        <el-option label="未开始" value="pending" />
        <el-option label="进行中" value="processing" />
        <el-option label="已完成" value="completed" />
        <el-option label="已暂停" value="paused" />
      </el-select>
      <el-select v-model="listQuery.cycle" placeholder="执行周期" clearable class="filter-item">
        <el-option label="每天" value="daily" />
        <el-option label="每周" value="weekly" />
        <el-option label="每月" value="monthly" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" type="success" icon="el-icon-plus" @click="handleCreate">
        新建计划
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
      <el-table-column label="执行周期" prop="cycle" align="center" width="100" />
      <el-table-column label="下次执行时间" prop="nextExecuteTime" align="center" width="160" />
      <el-table-column label="状态" prop="status" align="center" width="100" />
      <el-table-column label="操作" align="center" width="300">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button 
            :type="row.status === 'paused' ? 'success' : 'warning'"
            size="mini" 
            @click="handleToggleStatus(row)"
          >
            {{ row.status === 'paused' ? '启动' : '暂停' }}
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row)">
            删除
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
  name: 'PlannedTask',
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        keyword: undefined,
        status: undefined,
        cycle: undefined
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      // TODO: 调用API获取计划任务列表
      this.listLoading = false
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate() {
      // TODO: 实现创建计划任务功能
    },
    handleEdit(row) {
      // TODO: 实现编辑计划任务功能
    },
    handleToggleStatus(row) {
      // TODO: 实现启动/暂停计划任务功能
    },
    handleDelete(row) {
      this.$confirm('确认删除该计划任务吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // TODO: 调用API删除计划任务
      })
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