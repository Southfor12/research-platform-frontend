<template>
  <div class="app-container">
    <el-card class="box-card" shadow="hover">
      <div slot="header" class="card-header">
        <span class="title">任务列表</span>
        <div class="header-extra">
          <el-button-group>
            <el-button type="primary" icon="el-icon-refresh" @click="resetQuery">刷新</el-button>
          </el-button-group>
        </div>
      </div>
      
      <el-form :inline="true" :model="listQuery" class="search-form">
        <el-form-item label="产品">
          <el-input
            v-model="listQuery.product"
            placeholder="请输入产品名称"
            clearable
            prefix-icon="el-icon-search"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="listQuery.status" placeholder="请选择状态" clearable>
            <el-option label="待处理" value="1" />
            <el-option label="进行中" value="2" />
            <el-option label="已完成" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <div class="table-container">
        <el-table
          v-loading="listLoading"
          :data="list"
          border
          style="width: 100%"
          :header-cell-style="{
            background: '#f8f9fa',
            color: '#606266',
            fontWeight: 'bold',
            fontSize: '14px',
            padding: '12px 0'
          }"
          :cell-style="{padding: '12px 0'}"
          stripe
          height="calc(100vh - 300px)"
        >
          <el-table-column type="index" label="序号" width="60" align="center" fixed />
          <el-table-column prop="id" label="ID" width="80" align="center" />
          <el-table-column prop="cage_id" label="笼位ID" width="100" align="center" />
          <el-table-column prop="count" label="数量" width="80" align="center" />
          <el-table-column prop="product" label="产品" min-width="150" align="center">
            <template slot-scope="{row}">
              <el-tooltip :content="row.product" placement="top" :disabled="!row.product || row.product.length <= 10">
                <span>{{ row.product && row.product.length > 10 ? row.product.substring(0, 10) + '...' : row.product }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="research_group_name" label="课题组" min-width="180" align="center">
            <template slot-scope="{row}">
              <el-tooltip :content="row.research_group_name" placement="top" :disabled="!row.research_group_name || row.research_group_name.length <= 10">
                <span>{{ row.research_group_name && row.research_group_name.length > 10 ? row.research_group_name.substring(0, 10) + '...' : row.research_group_name }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="staff_name" label="工作人员" width="120" align="center">
            <template slot-scope="{row}">
              <el-tooltip :content="row.staff_name" placement="top" :disabled="!row.staff_name || row.staff_name.length <= 6">
                <span>{{ row.staff_name && row.staff_name.length > 6 ? row.staff_name.substring(0, 6) + '...' : row.staff_name }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="user_name" label="用户" width="120" align="center">
            <template slot-scope="{row}">
              <el-tooltip :content="row.user_name" placement="top" :disabled="!row.user_name || row.user_name.length <= 6">
                <span>{{ row.user_name && row.user_name.length > 6 ? row.user_name.substring(0, 6) + '...' : row.user_name }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="创建时间" width="160" align="center" />
          <el-table-column prop="start_time" label="开始时间" width="160" align="center" />
          <el-table-column prop="end_time" label="结束时间" width="160" align="center" />
          <el-table-column label="状态" width="100" align="center" fixed="right">
            <template slot-scope="{row}">
              <el-tag 
                :type="getStatusType(row.status)" 
                effect="light"
                :class="'status-tag status-' + row.status"
              >
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pagination-container">
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.pageNo"
          :limit.sync="listQuery.pageSize"
          @pagination="getList"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { getTaskList } from '@/api/task_work'
import Pagination from '@/components/Pagination'

export default {
  name: 'AllTask',
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 100,
        product: undefined,
        status: undefined,
        user_id: undefined
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      const params = Object.keys(this.listQuery).reduce((acc, key) => {
        if (this.listQuery[key] !== undefined) {
          acc[key] = this.listQuery[key]
        }
        return acc
      }, {})
      
      getTaskList(params).then(response => {
        if (response.status === 1) {
          this.list = response.data.records
          this.total = response.data.total
        }
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    resetQuery() {
      this.listQuery = {
        pageNo: 1,
        pageSize: 100,
        product: undefined,
        status: undefined,
        user_id: undefined
      }
      this.getList()
    },
    getStatusType(status) {
      const statusMap = {
        1: 'info',
        2: 'warning',
        3: 'success'
      }
      return statusMap[status] || 'info'
    },
    getStatusText(status) {
      const statusMap = {
        1: '待处理',
        2: '进行中',
        3: '已完成'
      }
      return statusMap[status] || '未知'
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 84px);
  
  .box-card {
    border-radius: 4px;
    border: none;
    transition: all 0.3s;
    height: 100%;
    display: flex;
    flex-direction: column;
    
    &:hover {
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0;
      
      .title {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
      }
      
      .header-extra {
        display: flex;
        align-items: center;
      }
    }
  }
  
  .search-form {
    padding: 20px 0;
    background-color: #fff;
    border-radius: 4px;
    margin-bottom: 20px;
    
    .el-form-item {
      margin-bottom: 0;
      margin-right: 20px;
      
      &:last-child {
        margin-right: 0;
      }
    }
    
    .el-input {
      width: 220px;
    }
    
    .el-select {
      width: 180px;
    }
  }
  
  .table-container {
    flex: 1;
    overflow: hidden;
    
    .el-table {
      margin-top: 0;
      border-radius: 4px;
      overflow: hidden;
      
      &::before {
        display: none;
      }
      
      .status-tag {
        padding: 4px 8px;
        border-radius: 4px;
        font-weight: 500;
        
        &.status-1 {
          background-color: #f4f4f5;
          color: #909399;
        }
        
        &.status-2 {
          background-color: #fdf6ec;
          color: #e6a23c;
        }
        
        &.status-3 {
          background-color: #f0f9eb;
          color: #67c23a;
        }
      }
    }
  }
  
  .pagination-container {
    margin-top: 20px;
    text-align: right;
    padding: 10px 0;
  }
}
</style> 