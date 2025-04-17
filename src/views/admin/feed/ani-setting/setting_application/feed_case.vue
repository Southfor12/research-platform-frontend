<template>
  <div class="container">
    <!-- 操作工具栏 -->
    <div class="operation-bar">
      <div style="display: flex; gap: 8px">
        <el-input v-model="searchForm.name" placeholder="输入笼盒名称" clearable @keyup.enter.native="handleSearch"
          style="width: 200px"></el-input>
        <el-select v-model="searchForm.box_type" placeholder="笼盒类型" clearable style="width: 150px">
          <el-option v-for="item in boxTypeOptions" :key="item.id" :label="item.box_type" :value="item.box_type"></el-option>
        </el-select>
        <el-button type="info" icon="el-icon-search" @click="handleSearch">查找</el-button>
      </div>
    </div>

    <!-- 数据表格 -->
    <el-table :data="feedCaseData" border style="width: 100%" v-loading="loading" class="custom-table">
      <el-table-column prop="id" label="编号" align="center" width="80" />
      <el-table-column prop="name" label="笼盒名称" align="center" />
      <el-table-column prop="box_type" label="笼盒类型" align="center" />
      <el-table-column prop="animal_type" label="动物类型" align="center" />
      <el-table-column prop="cage_number" label="笼位号" align="center" />
      <el-table-column prop="cage_rack_id" label="笼架编号" align="center" />
      <el-table-column prop="animal_count" label="动物数量" align="center">
        <template #default="{ row }">
          <el-tag :type="row.animal_count >= 0 ? 'success' : 'danger'">
            {{ row.animal_count }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="user_name" label="负责人" align="center" />
      <el-table-column prop="update_time" label="更新时间" align="center" width="160" />
      <el-table-column label="操作" width="80" align="center" fixed="right">
        <template #default="{ row }">
          <div class="action-buttons">
            <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="handleDelete(row)"></el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNo"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getFeedCasePage, deleteFeedCase, getFeedCaseType } from '@/api/ani_setting'

export default {
  data() {
    return {
      searchForm: {
        name: '',
        box_type: ''
      },
      feedCaseData: [],
      boxTypeOptions: [], // 笼盒类型选项
      loading: false,
      pageNo: 1,
      pageSize: 100,
      total: 0
    }
  },
  created() {
    this.getBoxTypeOptions()
    this.getFeedCaseList()
  },
  methods: {
    // 获取笼盒类型选项
    async getBoxTypeOptions() {
      try {
        const res = await getFeedCaseType()
        if (res.status === 1) {
          this.boxTypeOptions = res.data
        } else {
          this.$message.error(res.msg || '获取笼盒类型失败')
        }
      } catch (error) {
        console.error('获取笼盒类型失败:', error)
        this.$message.error('获取笼盒类型失败')
      }
    },
    
    // 获取笼盒列表
    async getFeedCaseList() {
      try {
        this.loading = true
        const params = {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          name: this.searchForm.name || undefined,
          box_type: this.searchForm.box_type || undefined
        }
        const res = await getFeedCasePage(params)
        if (res.status === 1) {
          this.feedCaseData = res.data.records
          this.total = res.data.total
        } else {
          this.$message.error(res.msg || '获取数据失败')
        }
      } catch (error) {
        console.error('获取笼盒列表失败:', error)
        this.$message.error('获取笼盒列表失败')
      } finally {
        this.loading = false
      }
    },

    // 搜索
    handleSearch() {
      this.pageNo = 1
      this.getFeedCaseList()
    },

    // 删除
    async handleDelete(row) {
      try {
        await this.$confirm('确认删除该笼盒吗？', '提示', {
          type: 'warning'
        })
        const res = await deleteFeedCase({ cage_box_id: row.id })
        if (res.status === 1) {
          this.$message.success('删除成功')
          this.getFeedCaseList()
        } else {
          this.$message.error(res.msg || '删除失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除失败:', error)
          this.$message.error('删除失败')
        }
      }
    },

    // 处理每页显示数量变化
    handleSizeChange(val) {
      this.pageSize = val
      this.getFeedCaseList()
    },

    // 处理页码变化
    handleCurrentChange(val) {
      this.pageNo = val
      this.getFeedCaseList()
    }
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
  justify-content: flex-end;
  align-items: center;
}

.custom-table {
  margin-top: 20px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 