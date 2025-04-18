<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.product"
        placeholder="搜索任务名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        class="filter-item date-range"
        @change="handleDateChange"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="completedTasks"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="编号" prop="id" align="center" width="80" />
      <el-table-column label="任务名称" prop="product" align="center" />
      <el-table-column label="笼位ID" prop="cage_id" align="center" />
      <el-table-column label="执行次数" prop="count" align="center" />
      <el-table-column label="开始时间" prop="start_time" align="center">
        <template slot-scope="{row}">
          {{ formatTime(row.start_time) }}
        </template>
      </el-table-column>
      <el-table-column label="结束时间" prop="end_time" align="center">
        <template slot-scope="{row}">
          {{ formatTime(row.end_time) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template>
          <el-tag type="success">已完成</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getMyTaskList } from '@/api/task_work'
import Pagination from '@/components/Pagination'

export default {
  name: 'CompletedTask',
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      dateRange: [],
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        product: undefined,
        user_id: undefined,
        start_date: undefined,
        end_date: undefined
      }
    }
  },
  computed: {
    completedTasks() {
      return this.list.filter(task => task.status === 3)
    }
  },
  created() {
    // 从用户信息中获取user_id
    const member = this.$store.state.user.member
    if (member && member.id) {
      this.listQuery.user_id = member.id
      this.getList()
    } else {
      this.$message.error('获取用户信息失败')
    }
  },
  methods: {
    async getList() {
      if (!this.listQuery.user_id) {
        this.$message.error('用户ID不能为空')
        return
      }
      this.listLoading = true
      try {
        const res = await getMyTaskList(this.listQuery)
        if (res.status === 1) {
          this.list = res.data.records
          // 更新总数为已完成任务的数量
          this.total = this.list.filter(task => task.status === 3).length
        } else {
          this.$message.error(res.msg || '获取任务列表失败')
        }
      } catch (error) {
        console.error('获取任务列表失败:', error)
        this.$message.error('获取任务列表失败')
      }
      this.listLoading = false
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    handleDateChange(val) {
      if (val) {
        this.listQuery.start_date = val[0]
        this.listQuery.end_date = val[1]
      } else {
        this.listQuery.start_date = undefined
        this.listQuery.end_date = undefined
      }
      this.handleFilter()
    },
    formatTime(time) {
      if (!time) return '-'
      return time.replace('T', ' ').substring(0, 19)
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
  .date-range {
    width: 360px;
  }
}

.el-table {
  margin-top: 15px;
}

.el-tag {
  padding: 0 10px;
  height: 28px;
  line-height: 26px;
  font-size: 12px;
  border-radius: 4px;
}
</style> 