<template>
  <div class="container">
    <!-- 操作工具栏 -->
    <div class="operation-bar">
      <el-button type="primary" icon="el-icon-plus" @click="handleCreate">新建</el-button>
      <!-- <el-button type="info" icon="el-icon-search" @click="handleSearch">查找</el-button> -->
      <!-- 新增搜索输入框 -->
      <div style="display: flex; gap: 8px">
        <el-input v-model="searchKeyword" placeholder="输入动物类型名称" clearable @keyup.enter.native="handleSearch"
          style="width: 200px"></el-input>
        <el-button type="info" icon="el-icon-search" @click="handleSearch">查找</el-button>
      </div>
    </div>

    <!-- 数据表格 -->
    <el-table :data="animalData" border style="width: 100%" v-loading="loading" class="custom-table">
      <el-table-column prop="id" label="编号id" align="center" />
      <el-table-column prop="name" label="动物类型" align="center" />
      <el-table-column prop="code" label="类型编码" align="center" />
      <el-table-column prop="default_capacity" label="默认笼盒容量" align="center" />
      <el-table-column label="操作" width="150" align="center">
        <template #default="{ row }">
          <div class="action-buttons">
            <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="handleEdit(row)"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="handleDelete(row)"></el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新建对话框 -->
    <el-dialog :title="dialogType === 'edit' ? '编辑动物类型' : '新建动物类型'" :visible.sync="dialogVisible" width="500px">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-form-item label="动物类型" prop="name">
          <el-input v-model="form.name" placeholder="请输入动物类型名称"></el-input>
        </el-form-item>
        <el-form-item label="类型编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入类型编码"></el-input>
        </el-form-item>
        <el-form-item label="默认笼盒容量" prop="default_capacity">
          <el-input-number v-model="form.default_capacity" :min="1" :max="100"
            controls-position="right"></el-input-number>
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
import { getAnimalType, addAnimalType, delAnimalType, editAnimalType, getAnimalTypeByName } from '@/api/ani_setting'

export default {
  data() {
    return {
      searchKeyword: '',  // 新增搜索关键词状态
      dialogType: 'create', // 新增对话框类型状态
      dialogVisible: false,
      animalData: [],
      loading: false,
      submitting: false,
      form: {
        name: '',
        code: '',
        default_capacity: 1
      },
      rules: {
        name: [
          { required: true, message: '请输入动物类型名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入类型编码', trigger: 'blur' }
        ],
        default_capacity: [
          { required: true, message: '请输入默认笼盒容量', trigger: 'blur' }
        ]
      }

    }
  },
  created() {
    this.getAnimalType()
  },
  methods: {
    async getAnimalType() {
      try {
        this.loading = true
        const res = await getAnimalType()
        // if (res.status === 1) {
        //   this.animalData = res.data.map(item => ({
        //     id: item.id,
        //     name: item.name,
        //     code: item.code,
        //     default_capacity: item.default_capacity + ' 个', // 添加单位
        //   }))
        // }
        if (res.status === 1) {
          this.animalData = this.formatData(res.data) // 使用统一格式化方法
        }
      } catch (error) {
        console.error('获取数据失败:', error)
        this.$message.error('数据加载失败')
      } finally {
        this.loading = false
      }
    },
    handleCreate() {
      // 新建按钮逻辑
      this.dialogVisible = true,
        this.resetForm()
    },
    // 新增方法
    resetForm() {
      this.form = {
        name: '',
        code: '',
        default_capacity: 1
      }
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
      })
    },
    // 修改后的提交方法
    async submitForm() {
      try {
        this.submitting = true
        await this.$refs.form.validate()

        const params = {
          name: this.form.name,
          code: this.form.code.toLowerCase(),
          default_capacity: this.form.default_capacity
        }

        // 根据类型调用不同接口
        if (this.dialogType === 'edit') {
          params.id = this.form.id  // 添加ID参数
          await editAnimalType(params)
        } else {
          await addAnimalType(params)
        }

        this.$message.success(this.dialogType === 'edit' ? '修改成功' : '新建成功')
        this.dialogVisible = false
        await this.getAnimalType()  // 刷新数据
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error(error.message || '操作失败')
        }
      } finally {
        this.submitting = false
      }
    },
    async handleSearch() {
      // 查找按钮逻辑
      try {
        this.loading = true
        const keyword = this.searchKeyword.trim()

        if (keyword) {
          //调用搜索接口
          const res = await getAnimalTypeByName({
            name: keyword
          })
          if (res.status === 1) {
            this.animalData = this.formatData(res.data)
          }
        } else {
          //空关键字时加载全部数据
          await this.getAnimalType()
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
        name: item.name,
        code: item.code,
        default_capacity: item.default_capacity + ' 个', // 添加单位
      }))
    },
    async handleDelete(row) {
      this.$confirm('确定要删除该条目吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delAnimalType({
          id: row.id
        }).then((res) => {
          if (res.status == 1) {
            this.$message.success('删除成功');
            this.loadAnimalData();
          }
        });
        this.getAnimalType()
      }).catch(() => { })
    },
    // 修改后的编辑方法
    handleEdit(row) {
      this.dialogType = 'edit'
      this.form = {
        id: row.id,
        name: row.name,
        code: row.code.replace(' 个', ''), // 移除显示单位
        default_capacity: parseInt(row.default_capacity)
      }
      this.dialogVisible = true
    },

  }
}
</script>

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