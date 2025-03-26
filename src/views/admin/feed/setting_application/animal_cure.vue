<template>
  <div class="container">
    <!-- 操作工具栏 -->
    <div class="operation-bar">
      <el-button type="primary" icon="el-icon-plus" @click="handleCreate">新建</el-button>
      <!-- 新增搜索输入框 -->
      <div style="display: flex; gap: 8px">
        <el-input v-model="searchKeyword" placeholder="输入动物类型名称" clearable @keyup.enter.native="handleSearch"
          style="width: 200px"></el-input>
        <el-button type="info" icon="el-icon-search" @click="handleSearch">查找</el-button>
      </div>
    </div>

    <!-- 数据表格 -->
    <el-table :data="animalData" border style="width: 100%" v-loading="loading" class="custom-table">
      <el-table-column prop="id" label="编号" align="center" />
      <el-table-column prop="name" label="药品名称" align="center" />
      <el-table-column prop="use_method" label="给药途径" align="center" />
      <el-table-column prop="dosage" label="剂量" align="center" />
      <el-table-column prop="description" label="描述" align="center" />
      <el-table-column label="操作" width="150" align="center">
        <template #default="{ row }">
          <div class="action-buttons">
            <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="handleEdit(row)"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="handleDelete(row)"></el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新建/编辑对话框 -->
    <el-dialog :title="dialogType === 'edit' ? '编辑治疗方案' : '新建治疗方案'" :visible.sync="dialogVisible" width="500px">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-form-item label="药品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入药品名称"></el-input>
        </el-form-item>
        <el-form-item label="给药途径" prop="use_method">
          <el-input v-model="form.use_method" placeholder="请输入给药途径"></el-input>
        </el-form-item>
        <el-form-item label="剂量" prop="dosage">
          <el-input v-model="form.dosage" placeholder="请输入剂量"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入描述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitting">{{ dialogType === 'edit' ? '保存修改' : '确 定'
          }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getTreatmentPlan,
  addTreatmentPlan,
  delTreatmentPlan,
  editTreatmentPlan,
  getTreatmentPlanByName
} from '@/api/ani_setting'

export default {
  data() {
    return {
      searchKeyword: '',
      dialogType: 'create',
      dialogVisible: false,
      animalData: [],
      loading: false,
      submitting: false,
      form: {
        id: null,
        name: '',
        use_method: '',
        dosage: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入药品名称', trigger: 'blur' }
        ],
        use_method: [
          { required: true, message: '请输入给药途径', trigger: 'blur' }
        ],
        dosage: [
          { required: true, message: '请输入剂量', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    // 加载数据
    async loadData() {
      try {
        this.loading = true
        const res = await getTreatmentPlan()
        if (res.status === 1) {
          this.animalData = res.data.map(item => ({
            id: item.id,
            name: item.medicine,
            use_method: item.use_method,
            dosage: item.dosage,
            description: item.description
          }))
        }
      } catch (error) {
        console.error('数据加载失败:', error)
        this.$message.error('数据加载失败')
      } finally {
        this.loading = false
      }
    },

    // 新建
    handleCreate() {
      this.dialogType = 'create'
      this.resetForm()
      this.dialogVisible = true
    },

    // 编辑
    handleEdit(row) {
      this.dialogType = 'edit'
      this.form = {
        id: row.id,
        name: row.name,
        code: row.code
      }
      this.dialogVisible = true
    },

    // 提交表单
    async submitForm() {
      try {
        this.submitting = true
        await this.$refs.form.validate()

        const params = {
          medicine: this.form.name,
          use_method: this.form.use_method,
          dosage: this.form.dosage,
          description: this.form.description
        }

        if (this.dialogType === 'edit') {
          params.id = this.form.id
          await editTreatmentPlan(params)
        } else {
          await addTreatmentPlan(params)
        }

        this.$message.success(this.dialogType === 'edit' ? '修改成功' : '新建成功')
        this.dialogVisible = false
        await this.loadData()
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error(error.message || '操作失败')
        }
      } finally {
        this.submitting = false
      }
    },

    // 删除
    async handleDelete(row) {
      try {
        await this.$confirm('确定要删除该疾病类型吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        const res = await delTreatmentPlan({ id: row.id })
        if (res.status === 1) {
          this.$message.success('删除成功')
          await this.loadData()
        }
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除失败')
        }
      }
    },

    // 重置表单
    resetForm() {
      this.form = {
        id: null,
        name: '',
        code: ''
      }
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
      })
    },

    async handleSearch() {
      // 查找按钮逻辑
      try {
        this.loading = true
        const keyword = this.searchKeyword.trim()

        if (keyword) {
          //调用搜索接口
          const res = await getTreatmentPlanByName({
            medicine: keyword
          })
          if (res.status === 1) {
            this.animalData = this.formatData(res.data)
          }
        } else {
          //空关键字时加载全部数据
          await this.getTreatmentPlan()
        }
      }
      catch (error) {
        console.error('搜索失败:', error)
        this.$message.error('搜索失败')
      }
      finally {
        this.loading = false
      }
    },
    formatData(data) {
      return data.map(item => ({
        id: item.id,
        name: item.medicine,
        use_method: item.user_method,
        dosage: item.dosage ,
        description: item.description
      }))
    },
  }
}
</script>

<!-- 样式部分保持不变 -->
<style scoped>
.container {
  padding: 20px;
}

.operation-bar {
  margin-bottom: 20px;
  display: flex;
  gap: 12px;
}

.custom-table {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
}

.el-table /deep/ th {
  background-color: #f5f7fa;
  font-weight: 600;
}

.el-table /deep/ .cell {
  padding: 8px 12px;
}

.action-buttons {
  display: flex;
  gap: 8px;
  /* 按钮间距 */
  justify-content: center;
}

/* 新增对话框样式 */
.el-dialog__body {
  padding: 20px 30px;
}

.el-form-item__content {
  margin-left: 0 !important;
}
</style>