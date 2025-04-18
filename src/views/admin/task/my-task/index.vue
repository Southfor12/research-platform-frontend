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
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="{row}">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="280">
        <template slot-scope="{row}">
          <el-button 
            v-if="row.status === 2" 
            type="success" 
            size="small" 
            icon="el-icon-check"
            @click="handleComplete(row)">
            完成
          </el-button>
          <el-button 
            type="primary" 
            size="small" 
            icon="el-icon-upload"
            @click="handleSubmit(row)">
            提交
          </el-button>
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

    <el-dialog
      title="提交数据"
      :visible.sync="dialogVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form ref="dataForm" :model="dataForm" :rules="dataRules" label-width="80px">
        <el-form-item label="数量" prop="count">
          <el-input v-model.number="dataForm.count" type="number" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="耗材费" prop="materialCost">
          <el-input v-model.number="dataForm.materialCost" type="number" placeholder="请输入耗材费" />
        </el-form-item>
        <el-form-item label="其他" prop="otherCost">
          <el-input v-model.number="dataForm.otherCost" type="number" placeholder="请输入其他费用" />
        </el-form-item>
        <el-form-item label="评论" prop="comment">
          <el-input
            v-model="dataForm.comment"
            type="textarea"
            :rows="4"
            placeholder="请输入评论"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitData">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMyTaskList, auditServiceOrder } from '@/api/task_work'
import Pagination from '@/components/Pagination'

export default {
  name: 'MyTask',
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        product: undefined,
        user_id: undefined
      },
      statusMap: {
        1: { text: '待执行', type: 'warning' },
        2: { text: '执行中', type: 'primary' },
        3: { text: '已完成', type: 'success' },
        4: { text: '已取消', type: 'info' }
      },
      dialogVisible: false,
      dataForm: {
        count: undefined,
        materialCost: 0,
        otherCost: 0,
        comment: '',
        taskId: undefined
      },
      dataRules: {
        count: [
          { required: true, message: '请输入数量', trigger: 'blur' },
          { type: 'number', message: '数量必须为数字' }
        ],
        materialCost: [
          { type: 'number', message: '耗材费必须为数字' }
        ],
        otherCost: [
          { type: 'number', message: '其他费用必须为数字' }
        ]
      }
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
          this.total = res.data.total
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
    handleView(row) {
      // TODO: 实现查看任务详情功能
      console.log('查看任务详情:', row)
    },
    formatTime(time) {
      if (!time) return '-'
      return time.replace('T', ' ').substring(0, 19)
    },
    getStatusText(status) {
      return (this.statusMap[status] && this.statusMap[status].text) || '未知状态'
    },
    getStatusType(status) {
      return (this.statusMap[status] && this.statusMap[status].type) || 'info'
    },
    async handleComplete(row) {
      try {
        await this.$confirm('确认将该任务标记为已完成吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        const res = await auditServiceOrder({
          id: row.id,
          status: 3
        })
        
        if (res.status === 1) {
          this.$message.success('操作成功')
          this.getList() // 刷新列表
        } else {
          this.$message.error(res.msg || '操作失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('更新状态失败:', error)
          this.$message.error('操作失败')
        }
      }
    },
    handleSubmit(row) {
      this.dataForm.taskId = row.id
      this.dataForm.count = row.count
      this.dialogVisible = true
    },
    submitData() {
      this.$refs.dataForm.validate(async (valid) => {
        if (valid) {
          try {
            // TODO: 调用提交数据的API
            console.log('提交的数据:', this.dataForm)
            this.$message.success('提交成功')
            this.dialogVisible = false
            this.resetForm()
          } catch (error) {
            console.error('提交数据失败:', error)
            this.$message.error('提交失败')
          }
        }
      })
    },
    resetForm() {
      this.dataForm = {
        count: undefined,
        materialCost: 0,
        otherCost: 0,
        comment: '',
        taskId: undefined
      }
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

.el-table {
  margin-top: 15px;
  .el-button {
    padding: 8px 15px;
    margin: 0 5px;
    border-radius: 4px;
    font-size: 13px;
    &.el-button--success {
      background-color: #67C23A;
      border-color: #67C23A;
      &:hover {
        background-color: #85ce61;
        border-color: #85ce61;
      }
    }
    &.el-button--primary {
      background-color: #409EFF;
      border-color: #409EFF;
      &:hover {
        background-color: #66b1ff;
        border-color: #66b1ff;
      }
    }
  }
}

.el-tag {
  padding: 0 10px;
  height: 28px;
  line-height: 26px;
  font-size: 12px;
  border-radius: 4px;
}

.dialog-footer {
  text-align: right;
}

.el-dialog {
  .el-form {
    padding: 0 20px;
  }
  
  .el-input {
    width: 100%;
  }
}
</style> 