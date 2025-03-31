<template>
  <div class="quality-container">
    <!-- 操作工具栏 -->
    <div class="operation-bar">
      <el-button type="primary" icon="el-icon-plus" @click="handleCreate">新增</el-button>
      <el-input v-model="searchKey" placeholder="请输入品系名称" style="width: 200px; margin-left: 20px"
        @keyup.enter="handleSearch">
        <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
      </el-input>
    </div>

    <!-- 数据表格 -->
    <el-table :data="tableData" border v-loading="loading" style="width: 100%" class="quality-table">
      <el-table-column prop="id" label="品系ID" width="120" align="center" />
      <el-table-column prop="strain_name" label="品系全称" width="180" align="center" />
      <el-table-column prop="strain_abbreviation" label="品系简称" width="120" align="center" />
      <el-table-column prop="count" label="活体数量" width="120" align="center" />
      <el-table-column prop="animal_type" label="动物类型" width="150" align="center" />
      <el-table-column prop="sperm_count" label="精子数量" width="120" align="center" />
      <el-table-column prop="create_by" label="创建人" width="120" align="center" />
      <el-table-column label="操作" width="180" fixed="right" align="center">
        <template #default="{ row }">
          <el-button type="primary" size="mini" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination background :current-page="pagination.current" :page-size="pagination.size" :total="pagination.total"
      layout="total, prev, pager, next, jumper" @current-change="handlePageChange"
      style="margin-top: 20px"></el-pagination>

    <!-- 编辑对话框 -->
    <el-dialog :title="dialogType === 'create' ? '新增品系' : '编辑品系'" :visible.sync="dialogVisible" width="600px">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="品系全称" prop="strain_name">
          <el-input v-model="form.strain_name"></el-input>
        </el-form-item>
        <el-form-item label="品系简称" prop="strain_abbreviation">
          <el-input v-model="form.strain_abbreviation"></el-input>
        </el-form-item>
        <el-form-item label="动物类型" prop="animal_type">
          <el-input v-model="form.animal_type"></el-input>
        </el-form-item>
        <el-form-item label="活体数量" prop="count">
          <el-input-number v-model="form.count" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="精子数量" prop="sperm_count">
          <el-input-number v-model="form.sperm_count" :min="0"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitting">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAnimalStrain,
  addAnimalStrain,
  editAnimalStrain,
  delAnimalStrain,
  getAnimalTypeByStrainId
} from '@/api/ani_setting'

export default {
  data() {
    return {
      loading: false,
      dialogVisible: false,
      dialogType: 'create',
      submitting: false,
      searchKey: '',
      tableData: [],
      pagination: {
        current: 1,
        size: 10,
        total: 0
      },
      form: {
        id: null,
        strain_name: '',
        strain_abbreviation: '',
        animal_type: '',
        count: 0,
        sperm_count: 0
      },
      rules: {
        strain_name: [{ required: true, message: '请输入品系全称', trigger: 'blur' }],
        strain_abbreviation: [{ required: true, message: '请输入品系简称', trigger: 'blur' }],
        animal_type: [{ required: true, message: '请输入动物类型', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        this.loading = true
        const params = {
          pageNo: this.pagination.current,
          pageSize: this.pagination.size,
          // strain_name: this.searchKey
        }

        const res = await getAnimalStrain(params)
        if (res.status === 1) {
          // this.tableData = res.data.records
          // this.pagination.total = res.data.total
          // this.pagination.size = res.data.size
          const records = res.data.records
          //为每个品系获取动物类型
          const updateRecords = await Promise.all(
            records.map(async (item) => {
              try {
                const typeRes = await getAnimalTypeByStrainId({ id: item.id });
                return {
                  ...item,
                  animal_type: typeRes.msg,// 使用接口返回的msg作为动物类型
                };
              } catch (error) {
                console.error('获取动物类型失败:', error);
                return {
                  ...item,
                  animal_type: '未知' // 错误时显示默认值
                };
              }
            })
          );
          this.tableData = updateRecords;
          this.pagination.total = res.data.total;
          this.pagination.size = res.data.size;
        }
      } catch (error) {
        console.error('数据加载失败:', error)
        this.$message.error('数据加载失败')
      } finally {
        this.loading = false
      }
    },

    handleCreate() {
      this.dialogType = 'create'
      this.form = {
        id: null,
        strain_name: '',
        strain_abbreviation: '',
        animal_type: '',
        count: 0,
        sperm_count: 0
      }
      this.dialogVisible = true
    },

    handleEdit(row) {
      this.dialogType = 'edit'
      this.form = { ...row }
      this.dialogVisible = true
    },

    async submitForm() {
      try {
        this.submitting = true
        await this.$refs.form.validate()

        const params = { ...this.form }
        if (this.dialogType === 'create') {
          await addAnimalStrain(params)
        } else {
          await editAnimalStrain(params)
        }

        this.$message.success('操作成功')
        this.dialogVisible = false
        this.loadData()
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error(error.message || '操作失败')
        }
      } finally {
        this.submitting = false
      }
    },

    handleDelete(row) {
      this.$confirm('确认删除该品系吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delAnimalStrain({ id: row.id })
        this.$message.success('删除成功')
        this.loadData()
      }).catch(() => { })
    },

    handleSearch() {
      this.pagination.current = 1
      this.loadData()
    },

    handlePageChange(page) {
      this.pagination.current = page
      this.loadData()
    }
  }
}
</script>

<style scoped>
.quality-container {
  padding: 20px;
  background: #fff;
}

.operation-bar {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.quality-table {
  margin-top: 20px;
}

.el-pagination {
  padding: 20px 0;
  justify-content: flex-end;
}
</style>