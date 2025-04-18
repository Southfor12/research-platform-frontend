<template>
  <div class="app-container">
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="人员" name="staff">
        <div class="filter-container">
          <el-input
            v-model="listQuery.keyword"
            placeholder="搜索姓名"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
          <el-select v-model="listQuery.staff_type" placeholder="人员类型" clearable class="filter-item">
            <el-option label="组长" value="组长" />
            <el-option label="组员" value="组员" />
          </el-select>
          <el-select v-model="listQuery.work_group_id" placeholder="所属工作组" clearable class="filter-item">
            <el-option 
              v-for="group in workGroups"
              :key="group.id"
              :label="group.name"
              :value="group.id"
            />
          </el-select>
          <div class="button-group">
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
              搜索
            </el-button>
            <el-button class="filter-item" type="success" icon="el-icon-plus" @click="handleCreate">
              添加人员
            </el-button>
          </div>
        </div>

        <el-table
          v-loading="listLoading"
          :data="staffList"
          border
          fit
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column label="ID" prop="id" align="center" width="80" />
          <el-table-column label="姓名" prop="name" align="center" width="120" />
          <el-table-column label="人员类型" prop="staff_type" align="center" width="100" />
          <el-table-column label="所属工作组" prop="work_group_name" align="center" />
          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="{row}">
              <div class="operation-buttons">
                <el-button type="danger" size="mini" @click="handleDelete(row)">
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="getStaffList"
        />
      </el-tab-pane>

      <el-tab-pane label="工作组" name="workGroup">
        <div class="filter-container">
          <el-input
            v-model="workGroupQuery.keyword"
            placeholder="搜索工作组名称"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="handleWorkGroupFilter"
          />
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleWorkGroupFilter">
            搜索
          </el-button>
          <el-button class="filter-item" type="success" icon="el-icon-plus" @click="handleCreateWorkGroup">
            添加工作组
          </el-button>
        </div>

        <el-table
          v-loading="workGroupLoading"
          :data="workGroupList"
          border
          fit
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column label="ID" prop="id" align="center" width="80" />
          <el-table-column label="工作组名称" prop="name" align="center" />
          <el-table-column label="工作区域" prop="work_place" align="center" />
          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="{row}">
              <div class="operation-buttons">
                <el-button type="danger" size="mini" @click="handleDeleteWorkGroup(row)">
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="workGroupTotal>0"
          :total="workGroupTotal"
          :page.sync="workGroupQuery.pageNo"
          :limit.sync="workGroupQuery.pageSize"
          @pagination="getWorkGroupList"
        />
      </el-tab-pane>
    </el-tabs>

    <!-- 新增人员弹窗 -->
    <el-dialog title="新增人员" :visible.sync="dialogVisible" width="500px">
      <el-form ref="staffForm" :model="staffForm" :rules="staffRules" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="staffForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="用户ID" prop="user_id">
          <el-input v-model.number="staffForm.user_id" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="人员类型" prop="staff_type">
          <el-select v-model="staffForm.staff_type" placeholder="请选择人员类型">
            <el-option label="组长" value="组长" />
            <el-option label="组员" value="组员" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属工作组" prop="work_group_id">
          <el-select v-model="staffForm.work_group_id" placeholder="请选择工作组" @change="handleWorkGroupChange">
            <el-option 
              v-for="group in workGroups"
              :key="group.id"
              :label="group.name"
              :value="group.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitStaffForm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 新增工作组弹窗 -->
    <el-dialog title="新增工作组" :visible.sync="workGroupDialogVisible" width="500px">
      <el-form ref="workGroupForm" :model="workGroupForm" :rules="workGroupRules" label-width="100px">
        <el-form-item label="工作组名称" prop="name">
          <el-input v-model="workGroupForm.name" placeholder="请输入工作组名称" />
        </el-form-item>
        <el-form-item label="工作区域" prop="work_place">
          <el-input v-model="workGroupForm.work_place" placeholder="请输入工作区域" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="workGroupDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitWorkGroupForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getStaffList, getWorkGroupList, addStaff, deleteStaff, addWorkGroup, deleteWorkGroup, getWorkGroupByName } from '@/api/task_work'

export default {
  name: 'StaffManagement',
  components: { Pagination },
  data() {
    return {
      activeTab: 'staff',
      // 人员列表相关
      staffList: [],
      total: 0,
      listLoading: true,
      workGroups: [],
      listQuery: {
        page: 1,
        limit: 20,
        keyword: undefined,
        staff_type: undefined,
        work_group_id: undefined
      },
      // 工作组列表相关
      workGroupList: [],
      workGroupLoading: true,
      workGroupTotal: 0,
      workGroupQuery: {
        keyword: undefined,
        pageNo: 1,
        pageSize: 100
      },
      // 新增人员相关
      dialogVisible: false,
      staffForm: {
        name: '',
        user_id: undefined,
        staff_type: '',
        work_group_id: undefined,
        work_group_name: ''
      },
      staffRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        user_id: [
          { required: true, message: '请输入用户ID', trigger: 'blur' },
          { type: 'number', message: '用户ID必须为数字', trigger: 'blur' }
        ],
        staff_type: [
          { required: true, message: '请选择人员类型', trigger: 'change' }
        ],
        work_group_id: [
          { required: true, message: '请选择所属工作组', trigger: 'change' }
        ]
      },
      // 新增工作组相关
      workGroupDialogVisible: false,
      workGroupForm: {
        name: '',
        work_place: ''
      },
      workGroupRules: {
        name: [
          { required: true, message: '请输入工作组名称', trigger: 'blur' }
        ],
        work_place: [
          { required: true, message: '请输入工作区域', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getStaffList()
  },
  methods: {
    handleTabClick(tab) {
      if (tab.name === 'staff') {
        this.getStaffList()
      } else if (tab.name === 'workGroup') {
        this.getWorkGroupList()
      }
    },
    // 人员列表相关方法
    async getStaffList() {
      this.listLoading = true
      try {
        const response = await getStaffList()
        if (response.status === 1) {
          this.staffList = response.data
          // 提取工作组信息用于筛选
          this.workGroups = [...new Set(this.staffList.map(item => ({
            id: item.work_group_id,
            name: item.work_group_name
          })))]
        }
      } catch (error) {
        console.error('获取人员列表失败:', error)
        this.$message.error('获取人员列表失败')
      }
      this.listLoading = false
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getStaffList()
    },
    handleCreate() {
      this.dialogVisible = true
      this.staffForm = {
        name: '',
        user_id: undefined,
        staff_type: '',
        work_group_id: undefined,
        work_group_name: ''
      }
    },
    handleDelete(row) {
      this.$confirm('确认删除该人员吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const response = await deleteStaff({ id: row.id })
          if (response.status === 1) {
            this.$message.success('删除成功')
            this.getStaffList()
          } else {
            this.$message.error(response.message || '删除失败')
          }
        } catch (error) {
          console.error('删除失败:', error)
          this.$message.error('删除失败')
        }
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 工作组列表相关方法
    async getWorkGroupList() {
      this.workGroupLoading = true
      try {
        let response
        if (this.workGroupQuery.keyword) {
          response = await getWorkGroupByName({
            name: this.workGroupQuery.keyword,
            pageNo: this.workGroupQuery.pageNo,
            pageSize: this.workGroupQuery.pageSize
          })
          if (response.status === 1) {
            this.workGroupList = response.data || []
            this.workGroupTotal = response.total || 0
          } else {
            this.$message.error(response.message || '搜索工作组失败')
            this.workGroupList = []
            this.workGroupTotal = 0
          }
        } else {
          response = await getWorkGroupList()
          if (response.status === 1) {
            this.workGroupList = response.data || []
            this.workGroupTotal = response.data.length || 0
          } else {
            this.$message.error(response.message || '获取工作组列表失败')
            this.workGroupList = []
            this.workGroupTotal = 0
          }
        }
      } catch (error) {
        console.error('获取工作组列表失败:', error)
        this.$message.error('获取工作组列表失败')
        this.workGroupList = []
        this.workGroupTotal = 0
      }
      this.workGroupLoading = false
    },
    handleWorkGroupFilter() {
      this.workGroupQuery.pageNo = 1
      this.getWorkGroupList()
    },
    handleCreateWorkGroup() {
      this.workGroupDialogVisible = true
      this.workGroupForm = {
        name: '',
        work_place: ''
      }
    },
    handleDeleteWorkGroup(row) {
      this.$confirm('确认删除该工作组吗？删除后该工作组下的所有人员将无法正常工作，请谨慎操作！', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const response = await deleteWorkGroup({ id: row.id })
          if (response.status === 1) {
            this.$message.success('删除工作组成功')
            this.getWorkGroupList()
          } else {
            this.$message.error(response.message || '删除工作组失败')
          }
        } catch (error) {
          console.error('删除工作组失败:', error)
          this.$message.error('删除工作组失败')
        }
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    handleWorkGroupChange(value) {
      const selectedGroup = this.workGroups.find(group => group.id === value)
      if (selectedGroup) {
        this.staffForm.work_group_name = selectedGroup.name
      }
    },
    submitStaffForm() {
      this.$refs.staffForm.validate(async valid => {
        if (valid) {
          try {
            const response = await addStaff(this.staffForm)
            if (response.status === 1) {
              this.$message.success('新增人员成功')
              this.dialogVisible = false
              this.getStaffList()
            } else {
              this.$message.error(response.message || '新增人员失败')
            }
          } catch (error) {
            console.error('新增人员失败:', error)
            this.$message.error('新增人员失败')
          }
        }
      })
    },
    submitWorkGroupForm() {
      this.$refs.workGroupForm.validate(async valid => {
        if (valid) {
          try {
            const response = await addWorkGroup(this.workGroupForm)
            if (response.status === 1) {
              this.$message.success('新增工作组成功')
              this.workGroupDialogVisible = false
              this.getWorkGroupList()
            } else {
              this.$message.error(response.message || '新增工作组失败')
            }
          } catch (error) {
            console.error('新增工作组失败:', error)
            this.$message.error('新增工作组失败')
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.filter-container {
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  
  .filter-item {
    margin: 0;
    flex-shrink: 0;
    
    &.el-input {
      width: 200px;
    }
    
    &.el-select {
      width: 200px;
    }
  }
  
  .button-group {
    display: flex;
    gap: 10px;
    margin-left: auto;
  }
}

.el-table {
  margin-top: 20px;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  
  th {
    background-color: #f5f7fa;
    color: #606266;
    font-weight: 500;
  }
}

.el-dialog {
  border-radius: 8px;
  overflow: hidden;
  
  .el-dialog__header {
    padding: 20px;
    background-color: #f5f7fa;
    border-bottom: 1px solid #ebeef5;
    
    .el-dialog__title {
      font-size: 18px;
      font-weight: 500;
      color: #303133;
    }
  }
  
  .el-dialog__body {
    padding: 30px 20px;
  }
  
  .el-dialog__footer {
    padding: 20px;
    background-color: #f5f7fa;
    border-top: 1px solid #ebeef5;
  }
}

.el-form {
  .el-form-item {
    margin-bottom: 22px;
    
    .el-form-item__label {
      font-weight: 500;
      color: #606266;
    }
    
    .el-input__inner {
      border-radius: 4px;
    }
  }
}

.el-button {
  border-radius: 4px;
  padding: 10px 20px;
  
  &.el-button--primary {
    background-color: #409EFF;
    border-color: #409EFF;
    
    &:hover {
      background-color: #66b1ff;
      border-color: #66b1ff;
    }
  }
  
  &.el-button--success {
    background-color: #67C23A;
    border-color: #67C23A;
    
    &:hover {
      background-color: #85ce61;
      border-color: #85ce61;
    }
  }
  
  &.el-button--warning {
    background-color: #E6A23C;
    border-color: #E6A23C;
    
    &:hover {
      background-color: #ebb563;
      border-color: #ebb563;
    }
  }
  
  &.el-button--danger {
    background-color: #F56C6C;
    border-color: #F56C6C;
    
    &:hover {
      background-color: #f78989;
      border-color: #f78989;
    }
  }
}

.el-tabs {
  .el-tabs__header {
    margin-bottom: 20px;
  }
  
  .el-tabs__item {
    font-size: 16px;
    font-weight: 500;
    
    &.is-active {
      color: #409EFF;
    }
  }
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}

.operation-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
  
  .el-button {
    margin: 0;
    padding: 6px 12px;
    
    &--mini {
      font-size: 12px;
    }
  }
}
</style> 