<template>
  <div class="area-statistics">
    <div class="statistics-header">
      <h3>区域汇总统计</h3>
    </div>
    <div class="statistics-content">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card shadow="hover">
            <div class="chart-container">
              <div class="chart-title">各区域饲料使用量分布</div>
              <div class="chart-placeholder">
                图表区域（待实现）
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover">
            <div class="chart-container">
              <div class="chart-title">各区域使用趋势</div>
              <div class="chart-placeholder">
                图表区域（待实现）
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AreaStatistics',
  data() {
    return {
      // 这里可以添加数据
    }
  }
}
</script>

<style lang="scss" scoped>
.area-statistics {
  .statistics-header {
    margin-bottom: 20px;
    h3 {
      margin: 0;
      font-size: 18px;
      color: #303133;
    }
  }
  
  .statistics-content {
    .chart-container {
      padding: 20px;
      
      .chart-title {
        font-size: 16px;
        color: #303133;
        margin-bottom: 20px;
        text-align: center;
      }
      
      .chart-placeholder {
        height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f5f7fa;
        color: #909399;
        border-radius: 4px;
      }
    }
  }
}
</style>


