<template>
  <div class="app-container">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="基础设置" name="basic">
        <div class="developing-container">
          <i class="el-icon-time"></i>
          <h3>基础设置模块开发中</h3>
          <p>敬请期待...</p>
        </div>
      </el-tab-pane>
      <el-tab-pane label="工单类型" name="workOrder">
        <div class="work-order-container">
          <div class="operation-bar">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-input
                  v-model.trim="searchForm.name"
                  placeholder="请输入工单类型名称"
                  clearable
                  @keyup.enter.native="handleSearch"
                  @clear="handleSearch">
                  <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
                </el-input>
              </el-col>
              <el-col :span="18" style="text-align: right;">
                <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新建工单类型</el-button>
              </el-col>
            </el-row>
          </div>
          <el-table
            v-loading="loading"
            :data="workOrderList"
            border
            style="width: 100%">
            <el-table-column
              prop="id"
              label="ID"
              width="80"
              align="center">
            </el-table-column>
            <el-table-column
              prop="code"
              label="工单代码"
              width="180"
              align="center">
            </el-table-column>
            <el-table-column
              prop="name"
              label="工单名称"
              align="center">
            </el-table-column>
            <el-table-column
              label="操作"
              width="150"
              align="center">
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  size="mini"
                  @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
            <template slot="empty">
              <div class="empty-block">
                <i class="el-icon-document"></i>
                <span class="empty-text">{{ searchForm.name ? '暂无相关数据' : '暂无数据' }}</span>
              </div>
            </template>
          </el-table>

          <!-- 新建工单类型对话框 -->
          <el-dialog
            title="新建工单类型"
            :visible.sync="dialogVisible"
            width="500px"
            @close="handleDialogClose">
            <el-form
              ref="workOrderForm"
              :model="workOrderForm"
              :rules="rules"
              label-width="100px">
              <el-form-item label="工单代码" prop="code">
                <el-input v-model.trim="workOrderForm.code" placeholder="请输入工单代码"></el-input>
              </el-form-item>
              <el-form-item label="工单名称" prop="name">
                <el-input v-model.trim="workOrderForm.name" placeholder="请输入工单名称"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </el-tab-pane>
      <el-tab-pane label="任务类型" name="task">
        <div class="task-type-container">
          <div class="operation-bar">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-input
                  v-model.trim="taskSearchForm.name"
                  placeholder="请输入任务类型名称"
                  clearable
                  @keyup.enter.native="handleTaskSearch"
                  @clear="handleTaskSearch">
                  <el-button slot="append" icon="el-icon-search" @click="handleTaskSearch"></el-button>
                </el-input>
              </el-col>
              <el-col :span="18" style="text-align: right;">
                <el-button type="primary" icon="el-icon-plus" @click="handleAddTask">新建任务类型</el-button>
              </el-col>
            </el-row>
          </div>
          <el-table
            v-loading="loading"
            :data="taskTypeList"
            border
            style="width: 100%">
            <el-table-column
              prop="id"
              label="ID"
              width="80"
              align="center">
            </el-table-column>
            <el-table-column
              prop="code"
              label="任务代码"
              width="180"
              align="center">
            </el-table-column>
            <el-table-column
              prop="name"
              label="任务名称"
              align="center">
            </el-table-column>
            <el-table-column
              label="操作"
              width="150"
              align="center">
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  size="mini"
                  @click="handleDeleteTask(scope.row)">删除</el-button>
              </template>
            </el-table-column>
            <template slot="empty">
              <div class="empty-block">
                <i class="el-icon-document"></i>
                <span class="empty-text">{{ taskSearchForm.name ? '暂无相关数据' : '暂无数据' }}</span>
              </div>
            </template>
          </el-table>

          <!-- 新建任务类型对话框 -->
          <el-dialog
            title="新建任务类型"
            :visible.sync="taskDialogVisible"
            width="500px"
            @close="handleTaskDialogClose">
            <el-form
              ref="taskTypeForm"
              :model="taskTypeForm"
              :rules="taskRules"
              label-width="100px">
              <el-form-item label="任务代码" prop="code">
                <el-input v-model.trim="taskTypeForm.code" placeholder="请输入任务代码"></el-input>
              </el-form-item>
              <el-form-item label="任务名称" prop="name">
                <el-input v-model.trim="taskTypeForm.name" placeholder="请输入任务名称"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="taskDialogVisible = false">取 消</el-button>
              <el-button type="primary" :loading="submitLoading" @click="handleTaskSubmit">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </el-tab-pane>
      <el-tab-pane label="消毒液类型" name="examFlow">
        <div class="empty-block">
          <i class="el-icon-document"></i>
          <span class="empty-text">暂无数据</span>
        </div>
      </el-tab-pane>
      <el-tab-pane label="消毒液配制" name="examFlowConfig">
        <div class="empty-block">
          <i class="el-icon-document"></i>
          <span class="empty-text">暂无数据</span>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getAllWorkOrder, addWorkOrderType, getWorkOrderByName, deleteWorkOrderType, getAllTaskType, addTaskType, getTaskTypeByName, deleteTaskType } from '@/api/ani_task'

export default {
  name: 'Settings',
  data() {
    return {
      activeTab: 'basic',
      workOrderList: [],
      taskTypeList: [],
      loading: false,
      dialogVisible: false,
      taskDialogVisible: false,
      submitLoading: false,
      searchForm: {
        name: '',
        pageNo: 1,
        pageSize: 100
      },
      workOrderForm: {
        code: '',
        name: ''
      },
      taskTypeForm: {
        code: '',
        name: ''
      },
      rules: {
        code: [
          { required: true, message: '请输入工单代码', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入工单名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      },
      taskRules: {
        code: [
          { required: true, message: '请输入任务代码', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入任务名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      },
      taskSearchForm: {
        name: '',
        pageNo: 1,
        pageSize: 100
      }
    }
  },
  created() {
    if (this.activeTab === 'basic') {
      this.getWorkOrderList()
    } else if (this.activeTab === 'task') {
      this.getTaskTypeList()
    }
  },
  watch: {
    activeTab(newVal) {
      if (newVal === 'task') {
        this.getTaskTypeList()
      } else if (newVal === 'workOrder') {
        this.getWorkOrderList()
      }
    }
  },
  methods: {
    async getWorkOrderList() {
      try {
        this.loading = true
        const res = await getAllWorkOrder()
        if (res.status === 1) {
          this.workOrderList = res.data
        } else {
          this.$message.error(res.msg || '获取工单类型列表失败')
        }
      } catch (error) {
        console.error('获取工单类型列表出错：', error)
        this.$message.error('获取工单类型列表失败')
      } finally {
        this.loading = false
      }
    },
    handleAdd() {
      this.dialogVisible = true
    },
    handleDialogClose() {
      if (this.$refs.workOrderForm) {
        this.$refs.workOrderForm.resetFields()
      }
      this.workOrderForm = {
        code: '',
        name: ''
      }
    },
    handleSubmit() {
      this.$refs.workOrderForm.validate(async valid => {
        if (!valid) return
        
        try {
          this.submitLoading = true
          const res = await addWorkOrderType(this.workOrderForm)
          if (res.status === 1) {
            this.$message.success('新建工单类型成功')
            this.dialogVisible = false
            this.getWorkOrderList()
          } else {
            this.$message.error(res.msg || '新建工单类型失败')
          }
        } catch (error) {
          console.error('新建工单类型出错：', error)
          this.$message.error('新建工单类型失败')
        } finally {
          this.submitLoading = false
        }
      })
    },
    async handleSearch() {
      if (!this.searchForm.name) {
        this.getWorkOrderList()
        return
      }
      
      try {
        this.loading = true
        const res = await getWorkOrderByName(this.searchForm)
        if (res.status === 1) {
          this.workOrderList = res.data.records || []
        } else {
          this.$message.error(res.msg || '搜索工单类型失败')
        }
      } catch (error) {
        console.error('搜索工单类型出错：', error)
        this.$message.error('搜索工单类型失败')
      } finally {
        this.loading = false
      }
    },
    handleReset() {
      this.searchForm.name = ''
      this.getWorkOrderList()
    },
    // 删除工单类型
    handleDelete(row) {
      this.$confirm('确认删除该工单类型吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await deleteWorkOrderType(row.id)
          if (res.status === 1) {
            this.$message.success('删除成功')
            // 刷新列表
            if (this.searchForm.name) {
              this.handleSearch()
            } else {
              this.getWorkOrderList()
            }
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          console.error('删除工单类型出错：', error)
          this.$message.error('删除失败')
        }
      }).catch(() => {
        // 取消删除，不做任何操作
      })
    },
    // 获取任务类型列表
    async getTaskTypeList() {
      try {
        this.loading = true
        const res = await getAllTaskType()
        if (res.status === 1) {
          this.taskTypeList = res.data
        } else {
          this.$message.error(res.msg || '获取任务类型列表失败')
        }
      } catch (error) {
        console.error('获取任务类型列表出错：', error)
        this.$message.error('获取任务类型列表失败')
      } finally {
        this.loading = false
      }
    },
    // 打开新增任务类型对话框
    handleAddTask() {
      this.taskDialogVisible = true
    },
    // 关闭任务类型对话框
    handleTaskDialogClose() {
      if (this.$refs.taskTypeForm) {
        this.$refs.taskTypeForm.resetFields()
      }
      this.taskTypeForm = {
        code: '',
        name: ''
      }
    },
    // 提交任务类型表单
    handleTaskSubmit() {
      this.$refs.taskTypeForm.validate(async valid => {
        if (!valid) return
        
        try {
          this.submitLoading = true
          const res = await addTaskType(this.taskTypeForm)
          if (res.status === 1) {
            this.$message.success('新建任务类型成功')
            this.taskDialogVisible = false
            this.getTaskTypeList()
          } else {
            this.$message.error(res.msg || '新建任务类型失败')
          }
        } catch (error) {
          console.error('新建任务类型出错：', error)
          this.$message.error('新建任务类型失败')
        } finally {
          this.submitLoading = false
        }
      })
    },
    // 搜索任务类型
    async handleTaskSearch() {
      if (!this.taskSearchForm.name) {
        this.getTaskTypeList()
        return
      }
      
      try {
        this.loading = true
        const res = await getTaskTypeByName(this.taskSearchForm)
        if (res.status === 1) {
          this.taskTypeList = res.data.records || []
        } else {
          this.$message.error(res.msg || '搜索任务类型失败')
        }
      } catch (error) {
        console.error('搜索任务类型出错：', error)
        this.$message.error('搜索任务类型失败')
      } finally {
        this.loading = false
      }
    },
    // 重置任务类型搜索
    handleTaskReset() {
      this.taskSearchForm.name = ''
      this.getTaskTypeList()
    },
    // 删除任务类型
    handleDeleteTask(row) {
      this.$confirm('确认删除该任务类型吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await deleteTaskType(row.id)
          if (res.status === 1) {
            this.$message.success('删除成功')
            // 刷新列表
            if (this.taskSearchForm.name) {
              this.handleTaskSearch()
            } else {
              this.getTaskTypeList()
            }
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          console.error('删除任务类型出错：', error)
          this.$message.error('删除失败')
        }
      }).catch(() => {
        // 取消删除，不做任何操作
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.developing-container {
  text-align: center;
  padding: 50px 0;
  
  i {
    font-size: 48px;
    color: #909399;
    margin-bottom: 20px;
  }
  
  h3 {
    color: #606266;
    margin-bottom: 10px;
  }
  
  p {
    color: #909399;
  }
}

.el-tabs {
  margin: 20px;
}

.work-order-container {
  padding: 20px 0;

  .operation-bar {
    margin-bottom: 20px;
  }
}

.dialog-footer {
  text-align: right;
}

.empty-block {
  margin: 40px 0;
  text-align: center;
  
  i {
    font-size: 48px;
    color: #909399;
    margin-bottom: 15px;
    display: block;
  }
  
  .empty-text {
    color: #909399;
    font-size: 14px;
  }
}

.task-type-container {
  padding: 20px 0;
}
</style> 