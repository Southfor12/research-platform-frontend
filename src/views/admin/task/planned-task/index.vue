<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="搜索任务名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.task_type"
        placeholder="搜索任务类型"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
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
      <el-table-column label="ID" prop="id" align="center" width="80" />
      <el-table-column label="任务名称" prop="name" align="center" />
      <el-table-column label="任务类型" prop="task_type" align="center" width="100" />
      <el-table-column label="执行周期" align="center" width="120">
        <template slot-scope="{row}">
          {{ row.schedule_cycle }}{{ row.schedule_cycle_unit }}
        </template>
      </el-table-column>
      <el-table-column label="首次执行时间" prop="first_task_time" align="center" width="160" />
      <el-table-column label="备注" prop="remark" align="center" />
      <el-table-column label="操作" align="center" width="120">
        <template slot-scope="{row}">
          <el-button type="danger" size="mini" @click="handleDelete(row)">
            删除
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

    <!-- 新增/编辑弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="600px">
      <el-form ref="taskForm" :model="taskForm" :rules="rules" label-width="120px">
        <el-form-item label="计划名称" prop="name">
          <el-input v-model="taskForm.name" placeholder="请输入计划名称"></el-input>
        </el-form-item>
        <el-form-item label="任务类型" prop="task_type">
          <el-input v-model="taskForm.task_type" placeholder="请输入任务类型">
            <template slot="append">
              <el-button icon="el-icon-edit"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="计划备注" prop="remark">
          <el-input v-model="taskForm.remark" type="textarea" rows="3" placeholder="请输入计划备注"></el-input>
        </el-form-item>
        <el-form-item label="计划周期(数字)" prop="schedule_cycle">
          <el-input-number v-model="taskForm.schedule_cycle" :min="1" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="计划周期单位" prop="schedule_cycle_unit">
          <el-select v-model="taskForm.schedule_cycle_unit" placeholder="请选择周期单位">
            <el-option label="天" value="天"></el-option>
            <el-option label="周" value="周"></el-option>
            <el-option label="月" value="月"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="自动更新开始时间">
          <el-select v-model="taskForm.auto_update" placeholder="请选择">
            <el-option label="是" value="是"></el-option>
            <el-option label="否" value="否"></el-option>
          </el-select>
          <div class="tip-text">是否根据前一任务实际完成时间自动更新后续任务的开始时间</div>
        </el-form-item>
        <el-form-item label="第一次任务时间" prop="first_task_time">
          <el-date-picker
            v-model="taskForm.first_task_time"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getTasks, addTask, deleteTask, getTasksByPage } from '@/api/ani_task'

export default {
  name: 'PlannedTask',
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        name: '',
        task_type: ''
      },
      dialogVisible: false,
      dialogTitle: '新建',
      taskForm: {
        name: '',
        task_type: '',
        remark: '',
        schedule_cycle: 1,
        schedule_cycle_unit: '天',
        auto_update: '是',
        first_task_time: ''
      },
      rules: {
        name: [{ required: true, message: '请输入计划名称', trigger: 'blur' }],
        task_type: [{ required: true, message: '请输入任务类型', trigger: 'blur' }],
        schedule_cycle: [{ required: true, message: '请输入计划周期', trigger: 'blur' }],
        schedule_cycle_unit: [{ required: true, message: '请选择周期单位', trigger: 'blur' }],
        first_task_time: [{ required: true, message: '请选择第一次任务时间', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getTasksByPage(this.listQuery).then(response => {
        if (response.status === 1) {
          this.list = response.data.records || []
          this.total = response.data.total || 0
        } else {
          this.$message.error(response.msg || '获取任务列表失败')
        }
        this.listLoading = false
      }).catch(error => {
        console.error('获取任务列表失败:', error)
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    handleCreate() {
      this.dialogTitle = '新建'
      this.taskForm = {
        name: '',
        task_type: '',
        remark: '',
        schedule_cycle: 1,
        schedule_cycle_unit: '天',
        auto_update: '是',
        first_task_time: ''
      }
      this.dialogVisible = true
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
        this.listLoading = true
        deleteTask(row.id).then(response => {
          if (response.status === 1) {
            this.$message.success('删除计划任务成功')
            this.getList()
          } else {
            this.$message.error(response.msg || '删除计划任务失败')
          }
          this.listLoading = false
        }).catch(error => {
          console.error('删除计划任务失败:', error)
          this.$message.error('删除计划任务失败')
          this.listLoading = false
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    submitForm() {
      this.$refs.taskForm.validate(valid => {
        if (valid) {
          const formData = { ...this.taskForm }
          
          this.listLoading = true
          addTask(formData).then(response => {
            if (response.status === 1) {
              this.$message.success('添加计划任务成功')
              this.dialogVisible = false
              this.getList()
            } else {
              this.$message.error(response.msg || '添加计划任务失败')
            }
            this.listLoading = false
          }).catch(error => {
            console.error('添加计划任务失败:', error)
            this.$message.error('添加计划任务失败')
            this.listLoading = false
          })
        }
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

.tip-text {
  font-size: 12px;
  color: #909399;
  line-height: 1.2;
  padding-top: 4px;
}
</style> 