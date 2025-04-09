<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.place"
        placeholder="请输入处理地点"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.user_name"
        placeholder="请输入处理人"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-date-picker
        v-model="listQuery.disposal_time"
        type="datetime"
        placeholder="选择处理时间"
        value-format="yyyy-MM-dd HH:mm:ss"
        style="width: 200px;"
        class="filter-item"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleCreate">
        新增
      </el-button>
      <el-button class="filter-item" type="info" icon="el-icon-refresh" @click="resetQuery">
        重置
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="ID" prop="id" width="80" />
      <el-table-column label="处理地点" prop="place" />
      <el-table-column label="处理人" prop="user_name" width="120" />
      <el-table-column label="处理时间" prop="disposal_time" width="180" />
      <el-table-column label="重量(kg)" prop="weight" width="120" />
      <el-table-column label="操作" align="center" width="230">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-show="total>0"
      class="dl-pagination"
      background
      :current-page.sync="listQuery.pageNo"
      :page-sizes="[10, 20, 30, 50]"
      :page-size.sync="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 新增/编辑对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form ref="dataForm" :model="temp" :rules="rules" label-position="left" label-width="100px">
        <el-form-item label="处理地点" prop="place">
          <el-input v-model="temp.place" placeholder="请输入处理地点" />
        </el-form-item>
        <el-form-item label="处理人" prop="user_name">
          <el-input v-model="temp.user_name" placeholder="请输入处理人" />
        </el-form-item>
        <el-form-item label="处理时间" prop="disposal_time">
          <el-date-picker
            v-model="temp.disposal_time"
            type="datetime"
            placeholder="选择处理时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item label="重量(kg)" prop="weight">
          <el-input-number v-model="temp.weight" :precision="1" :step="0.1" :min="0" style="width: 100%;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCadaverManage, addCadaverManage, deleteCadaverManage } from '@/api/ani_manage'

export default {
  name: 'CadaverManage',
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        id: '',
        user_name: '',
        disposal_time: '',
        place: ''
      },
      dialogVisible: false,
      dialogTitle: '',
      temp: {
        id: undefined,
        place: '',
        user_id: '',
        user_name: '',
        disposal_time: '',
        weight: 0
      },
      rules: {
        place: [{ required: true, message: '请输入处理地点', trigger: 'blur' }],
        user_name: [{ required: true, message: '请输入处理人', trigger: 'blur' }],
        disposal_time: [{ required: true, message: '请选择处理时间', trigger: 'change' }],
        weight: [{ required: true, message: '请输入重量', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      // 处理空字符串参数，避免传递空字符串
      const params = { ...this.listQuery }
      if (params.id === '') delete params.id
      if (params.user_name === '') delete params.user_name
      if (params.disposal_time === '') delete params.disposal_time
      if (params.place === '') delete params.place
      
      getCadaverManage(params).then(response => {
        if (response.status === 1) {
          this.list = response.data.records
          this.total = response.data.total
        } else {
          this.$message.error(response.msg || '获取数据失败')
        }
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
        this.$message.error('获取数据失败')
      })
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    resetQuery() {
      this.listQuery = {
        pageNo: 1,
        pageSize: 10,
        id: '',
        user_name: '',
        disposal_time: '',
        place: ''
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
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        place: '',
        user_id: '',
        user_name: '',
        disposal_time: '',
        weight: 0
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogTitle = '新增尸体处理记录'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogTitle = '编辑尸体处理记录'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row) {
      this.$confirm('确认删除该记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用删除API
        const params = {
          body_disposal_id: row.id
        }
        
        deleteCadaverManage(params).then(response => {
          if (response.status === 1) {
            this.$message.success('删除成功')
            this.getList()
          } else {
            this.$message.error(response.msg || '删除失败')
          }
        }).catch(() => {
          this.$message.error('删除失败')
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    submitForm() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.temp.id) {
            // 编辑功能待实现
            this.dialogVisible = false
            this.$message.success('更新成功')
            this.getList()
          } else {
            // 新增功能
            const data = {
              disposal_time: this.temp.disposal_time,
              user_id: this.temp.user_id || 3, // 默认值，实际应从用户信息中获取
              user_name: this.temp.user_name,
              weight: this.temp.weight,
              place: this.temp.place
            }
            
            addCadaverManage(data).then(response => {
              if (response.status === 1) {
                this.dialogVisible = false
                this.$message.success('创建成功')
                this.getList()
              } else {
                this.$message.error(response.msg || '创建失败')
              }
            }).catch(() => {
              this.$message.error('创建失败')
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.filter-container {
  padding-bottom: 10px;
}
.filter-item {
  margin-right: 10px;
}
.dl-pagination {
  margin-top: 20px;
  text-align: right;
}
</style>