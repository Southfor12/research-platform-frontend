<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="测量类型">
          <el-select v-model="searchForm.type" placeholder="请选择测量类型">
            <el-option label="体重" value="weight"></el-option>
            <el-option label="体温" value="temperature"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="测量时间">
          <el-date-picker
            v-model="searchForm.timeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格区域 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="id"
        label="ID"
        width="80"
        align="center">
      </el-table-column>
      <el-table-column
        prop="survey_type"
        label="测量类型"
        width="100"
        align="center">
      </el-table-column>
      <el-table-column
        prop="survey_data"
        label="测量值"
        width="120"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.survey_data }}{{ scope.row.survey_type === '体重' ? 'g' : '℃' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="survey_time"
        label="测量时间"
        width="180"
        align="center">
      </el-table-column>
      <el-table-column
        prop="animal_id"
        label="动物编号"
        width="120"
        align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        width="150"
        align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <div class="pagination-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageParams.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getMeasureDataWeight, getMeasureDataTemperature } from '@/api/ani_manage'

export default {
  name: 'MeasureData',
  data() {
    return {
      loading: false,
      searchForm: {
        type: 'weight', // 默认查询体重数据
        timeRange: []
      },
      tableData: [], // 表格数据
      total: 0, // 总数据量
      pageParams: {
        page: 1,
        pageSize: 10
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取列表数据
    async getList() {
      this.loading = true
      try {
        let response = {}
        const params = {
          page: this.pageParams.page,
          pageSize: this.pageParams.pageSize,
          startTime: this.searchForm.timeRange && this.searchForm.timeRange.length > 0 ? this.searchForm.timeRange[0] : '',
          endTime: this.searchForm.timeRange && this.searchForm.timeRange.length > 0 ? this.searchForm.timeRange[1] : ''
        }
        
        // 根据选择的测量类型调用不同的API
        if (this.searchForm.type === 'weight') {
          response = await getMeasureDataWeight(params)
        } else if (this.searchForm.type === 'temperature') {
          response = await getMeasureDataTemperature(params)
        }
        
        if (response.status === 1) {
          this.tableData = response.data
          this.total = response.data.length // 假设后端返回的数据中包含总数，如果没有，则使用数组长度
        } else {
          this.$message.error(response.msg || '获取数据失败')
        }
      } catch (error) {
        console.error('获取测量数据失败:', error)
        this.$message.error('获取数据失败')
      } finally {
        this.loading = false
      }
    },

    // 处理搜索
    handleSearch() {
      this.pageParams.page = 1
      this.getList()
    },

    // 重置搜索
    resetSearch() {
      this.searchForm = {
        type: 'weight',
        timeRange: []
      }
      this.handleSearch()
    },

    // 处理每页显示数量变化
    handleSizeChange(val) {
      this.pageParams.pageSize = val
      this.pageParams.page = 1
      this.getList()
    },

    // 处理页码变化
    handleCurrentChange(val) {
      this.pageParams.page = val
      this.getList()
    },

    // 处理编辑
    handleEdit(row) {
      // TODO: 实现编辑功能
      console.log('编辑:', row)
      this.$message.info('编辑功能待实现')
    },

    // 处理删除
    handleDelete(row) {
      this.$confirm('确认要删除该记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // TODO: 调用删除接口
        this.$message.success('删除成功')
        this.getList()
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    }
  }
}
</script>

<style scoped>
.app-container {
  padding: 20px;
}

.search-container {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}

/* 表格内容垂直居中 */
.el-table >>> .cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 操作按钮间距 */
.el-button + .el-button {
  margin-left: 10px;
}

/* 表格加载样式 */
.el-table {
  position: relative;
  min-height: 200px;
}
</style>

