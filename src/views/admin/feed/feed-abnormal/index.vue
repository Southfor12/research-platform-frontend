<template>
  <div class="app-container">
    <!-- 表格区域 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="id"
        label="异常编号"
        width="100"
        align="center">
      </el-table-column>
      <el-table-column
        prop="abnormality"
        label="异常类型"
        width="120"
        align="center">
      </el-table-column>
      <el-table-column
        prop="cage_id"
        label="笼位编号"
        width="120"
        align="center">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建时间"
        width="180"
        align="center">
      </el-table-column>
      <el-table-column
        prop="description"
        label="描述"
        align="center">
      </el-table-column>
      <el-table-column
        prop="user_name"
        label="用户名"
        width="120"
        align="center">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="100"
        align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === false ? 'danger' : 'success'">
            {{ scope.row.status === false ? '未处理' : '已处理' }}
          </el-tag>
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
import { getFeedAbnormal } from '@/api/ani_manage'

export default {
  name: 'FeedAbnormal',
  data() {
    return {
      loading: false,
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
      try {
        this.loading = true
        const response = await getFeedAbnormal({
          page: this.pageParams.page,
          pageSize: this.pageParams.pageSize
        })
        if (response.status === 1) {
          this.tableData = response.data
          // 如果后端返回了总数，则设置总数
          // this.total = response.total 
          // 如果后端没有返回总数，则使用当前数据长度
          this.total = response.data.length
        } else {
          this.$message.error(response.msg || '获取数据失败')
        }
      } catch (error) {
        console.error('获取饲养异常列表失败:', error)
        this.$message.error('获取数据失败')
      } finally {
        this.loading = false
      }
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

    // 处理异常
    handleProcess(row) {
      this.$confirm('确认要处理该异常吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // TODO: 调用处理异常的接口
        this.$message.success('处理成功')
        this.getList()
      }).catch(() => {
        this.$message.info('已取消处理')
      })
    },

    // 查看详情
    handleDetail(row) {
      // TODO: 实现查看详情功能
      console.log('查看详情:', row)
    }
  }
}
</script>

<style scoped>
.app-container {
  padding: 20px;
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

/* 状态标签样式 */
.el-tag {
  min-width: 60px;
  text-align: center;
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
