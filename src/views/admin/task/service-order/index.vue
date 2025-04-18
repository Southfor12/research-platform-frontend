<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <div slot="header" class="card-header">
        <span class="header-title">搜索条件</span>
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
          <el-select 
            v-model="listQuery.status" 
            placeholder="请选择状态" 
            clearable
            style="width: 120px"
          >
            <el-option label="待处理" :value="2" />
            <el-option label="已完成" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="table-card">
      <div slot="header" class="card-header">
        <span class="header-title">服务工单列表</span>
        <div class="header-extra">
          <el-button type="text" icon="el-icon-refresh" @click="getList">刷新</el-button>
        </div>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        style="width: 100%"
        :header-cell-style="{
          background: '#f8f9fa',
          color: '#333',
          fontWeight: 'bold',
          fontSize: '14px'
        }"
        :cell-style="{padding: '8px 0'}"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="cage_id" label="笼位ID" width="100" align="center" />
        <el-table-column prop="count" label="数量" width="80" align="center" />
        <el-table-column prop="product" label="产品" align="center" min-width="120" />
        <el-table-column prop="research_group_name" label="课题组" align="center" min-width="150" />
        <el-table-column prop="user_name" label="用户名" align="center" min-width="100" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template slot-scope="{row}">
            <el-tag 
              :type="getStatusType(row.status)" 
              effect="dark"
              size="small"
            >
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="160" align="center" />
        <el-table-column prop="start_time" label="开始时间" width="160" align="center" />
        <el-table-column prop="end_time" label="结束时间" width="160" align="center" />
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template slot-scope="{row}">
            <el-button 
              v-if="row.status === 0" 
              type="text" 
              size="small" 
              @click="handleAudit(row)"
            >
              审核
            </el-button>
            <el-button 
              v-if="row.status === 1" 
              type="text" 
              size="small" 
              @click="handleAssign(row)"
            >
              分配
            </el-button>
            <el-button 
              v-if="row.status === 2" 
              type="text" 
              size="small" 
              @click="handleComplete(row)"
            >
              完成
            </el-button>
            <el-button 
              type="text" 
              size="small" 
              @click="handleView(row)"
            >
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.pageNo"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="listQuery.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        />
      </div>
    </el-card>

    <!-- 审核弹窗 -->
    <el-dialog
      title="审核工单"
      :visible.sync="auditDialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form :model="auditForm" label-width="80px">
        <el-form-item label="审核结果">
          <el-radio-group v-model="auditForm.result">
            <el-radio :label="true">通过</el-radio>
            <el-radio :label="false">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核意见">
          <el-input
            type="textarea"
            v-model="auditForm.remark"
            :rows="3"
            placeholder="请输入审核意见"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="auditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAudit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配弹窗 -->
    <el-dialog
      title="分配工单"
      :visible.sync="assignDialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form :model="assignForm" label-width="100px">
        <el-form-item label="选择工作人员">
          <el-select 
            v-model="assignForm.work_staff_id" 
            placeholder="请选择工作人员"
            style="width: 100%"
          >
            <el-option
              v-for="item in staffList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAssign">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getServiceOrderList, auditServiceOrder, getStaffList, assignTask } from '@/api/task_work'

export default {
  name: 'ServiceOrder',
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        product: undefined,
        status: undefined,
        user_id: undefined
      },
      auditDialogVisible: false,
      auditForm: {
        result: true,
        remark: '',
        currentRow: null
      },
      assignDialogVisible: false,
      assignForm: {
        work_staff_id: undefined,
        currentRow: null
      },
      staffList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getStatusType(status) {
      const statusMap = {
        0: 'info',      // 灰色 - 已下订单
        1: 'primary',   // 蓝色 - 审核通过
        2: 'warning',   // 黄色 - 分配完成
        3: 'success',   // 绿色 - 已完成
        '-1': 'danger', // 红色 - 审核不通过
        '-2': 'danger', // 红色 - 分配不通过
        '-3': 'danger'  // 红色 - 完成不通过
      }
      return statusMap[status] || 'info'
    },
    getStatusText(status) {
      const statusMap = {
        0: '已下订单',
        1: '审核通过',
        2: '分配完成',
        3: '已完成',
        '-1': '审核不通过',
        '-2': '分配不通过',
        '-3': '完成不通过'
      }
      return statusMap[status] || '未知状态'
    },
    handleAudit(row) {
      this.auditForm = {
        result: true,
        remark: '',
        currentRow: row
      }
      this.auditDialogVisible = true
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    async submitAudit() {
      if (!this.auditForm.currentRow) return
      
      try {
        const currentStatus = this.auditForm.currentRow.status
        const newStatus = this.auditForm.result ? currentStatus + 1 : -(currentStatus + 1)
        
        const res = await auditServiceOrder({
          id: this.auditForm.currentRow.id,
          status: newStatus
        })

        if (res.status === 1) {
          this.$message.success(res.msg || '审核操作成功')
          this.auditDialogVisible = false
          
          // 刷新列表数据
          this.getList()
        } else {
          this.$message.error(res.msg || '审核操作失败')
        }
      } catch (error) {
        console.error('审核操作失败:', error)
        this.$message.error('审核操作失败: ' + (error.message || '未知错误'))
      }
    },
    handleAssign(row) {
      this.assignForm = {
        work_staff_id: undefined,
        currentRow: row
      }
      this.assignDialogVisible = true
      this.getStaffList()
    },
    async getStaffList() {
      try {
        const res = await getStaffList()
        if (res.status === 1) {
          this.staffList = res.data
        } else {
          this.$message.error(res.msg || '获取员工列表失败')
        }
      } catch (error) {
        console.error('获取员工列表失败:', error)
        this.$message.error('获取员工列表失败: ' + (error.message || '未知错误'))
      }
    },
    async submitAssign() {
      if (!this.assignForm.currentRow || !this.assignForm.work_staff_id) {
        this.$message.warning('请选择工作人员')
        return
      }
      
      try {
        const res = await assignTask({
          id: this.assignForm.currentRow.id,
          work_staff_id: this.assignForm.work_staff_id
        })

        if (res.status === 1) {
          this.$message.success(res.msg || '分配成功')
          this.assignDialogVisible = false
          this.getList()
        } else {
          this.$message.error(res.msg || '分配失败')
        }
      } catch (error) {
        console.error('分配失败:', error)
        this.$message.error('分配失败: ' + (error.message || '未知错误'))
      }
    },
    handleComplete(row) {
      this.$message.info('完成操作')
      // TODO: 实现完成逻辑
    },
    handleView(row) {
      this.$message.info('查看详情')
      // TODO: 实现查看详情逻辑
    },
    async getList() {
      this.listLoading = true
      try {
        console.log('请求参数:', this.listQuery)
        const res = await getServiceOrderList(this.listQuery)
        console.log('API返回数据:', res)
        if (res.status === 1) {
          this.list = res.data.records
          this.total = res.data.total
        } else {
          this.$message.error(res.msg || '获取数据失败')
        }
      } catch (error) {
        console.error('获取服务工单列表失败:', error)
        this.$message.error('获取数据失败: ' + (error.message || '未知错误'))
      }
      this.listLoading = false
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    resetQuery() {
      this.listQuery = {
        pageNo: 1,
        pageSize: 20,
        product: undefined,
        status: undefined,
        user_id: undefined
      }
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 84px);
}

.search-card {
  margin-bottom: 20px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    border-bottom: 1px solid #ebeef5;
    
    .header-title {
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }
  }
}

.table-card {
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    border-bottom: 1px solid #ebeef5;
    
    .header-title {
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }
    
    .header-extra {
      .el-button {
        padding: 0;
        font-size: 14px;
      }
    }
  }
}

.search-form {
  padding: 20px;
  
  .el-form-item {
    margin-bottom: 0;
    margin-right: 20px;
    
    &:last-child {
      margin-right: 0;
    }
  }
  
  .el-input {
    width: 200px;
  }
}

.pagination-container {
  margin-top: 20px;
  padding: 10px 0;
  text-align: right;
  background-color: #fff;
}

::v-deep .el-table {
  margin-top: 10px;
  
  th {
    background-color: #f8f9fa !important;
  }
  
  td {
    padding: 8px 0;
  }
}

.el-tag {
  padding: 0 8px;
  height: 24px;
  line-height: 22px;
  font-size: 12px;
  border-radius: 4px;
  
  &.el-tag--info {
    background-color: #f4f4f5;
    border-color: #e9e9eb;
    color: #909399;
  }
  
  &.el-tag--primary {
    background-color: #ecf5ff;
    border-color: #d9ecff;
    color: #409eff;
  }
  
  &.el-tag--warning {
    background-color: #fdf6ec;
    border-color: #faecd8;
    color: #e6a23c;
  }
  
  &.el-tag--success {
    background-color: #f0f9eb;
    border-color: #e1f3d8;
    color: #67c23a;
  }
  
  &.el-tag--danger {
    background-color: #fef0f0;
    border-color: #fde2e2;
    color: #f56c6c;
  }
}

.el-button--text {
  padding: 0 8px;
  font-size: 13px;
  
  & + .el-button--text {
    margin-left: 8px;
  }
}
</style> 