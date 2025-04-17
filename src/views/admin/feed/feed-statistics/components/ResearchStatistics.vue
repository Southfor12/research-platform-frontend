<template>
  <div class="research-statistics">
    <div class="statistics-header">
      <h3>课题组使用统计</h3>
      <div class="header-actions">
        <el-button type="primary" size="small" @click="refreshData">
          <i class="el-icon-refresh"></i> 刷新数据
        </el-button>
      </div>
    </div>
    <div class="statistics-content">
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        v-loading="loading"
        :empty-text="emptyText">
        <el-table-column
          prop="group_name"
          label="课题组名称"
          min-width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.group_name || '未分配课题组' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="care"
          label="饲养类型"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="cage_count"
          label="笼盒数量"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="source"
          label="来源"
          min-width="150">
        </el-table-column>
        <el-table-column
          prop="user_name"
          label="负责人"
          min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.user_name || '无' }}</span>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 数据可视化部分 -->
      <div class="visualization-section" v-if="tableData.length > 0">
        <div class="section-title">
          <h4>课题组分布</h4>
        </div>
        <div class="charts-container">
          <!-- 课题组分布卡片 -->
          <el-card class="chart-card" shadow="hover">
            <div slot="header" class="card-header">
              <span>课题组分布</span>
            </div>
            <div class="chart-content">
              <div v-for="(item, index) in groupData" :key="index" class="data-item">
                <div class="item-label">
                  <span class="color-block" :style="{ backgroundColor: getColor(index) }"></span>
                  <span>{{ item.name }}</span>
                </div>
                <div class="item-value">
                  <span>{{ item.value }}</span>
                  <span class="percentage">({{ calculatePercentage(item.value, totalCages) }}%)</span>
                </div>
                <div class="progress-bar">
                  <div class="progress" :style="{ width: calculatePercentage(item.value, totalCages) + '%', backgroundColor: getColor(index) }"></div>
                </div>
              </div>
            </div>
          </el-card>
          
          <!-- 饲养类型分布卡片 -->
          <el-card class="chart-card" shadow="hover">
            <div slot="header" class="card-header">
              <span>饲养类型分布</span>
            </div>
            <div class="chart-content">
              <div v-for="(item, index) in careData" :key="index" class="data-item">
                <div class="item-label">
                  <span class="color-block" :style="{ backgroundColor: getColor(index) }"></span>
                  <span>{{ item.name }}</span>
                </div>
                <div class="item-value">
                  <span>{{ item.value }}</span>
                  <span class="percentage">({{ calculatePercentage(item.value, totalCages) }}%)</span>
                </div>
                <div class="progress-bar">
                  <div class="progress" :style="{ width: calculatePercentage(item.value, totalCages) + '%', backgroundColor: getColor(index) }"></div>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getFeedStatisticsByResearchGroup } from '@/api/ani_manage'

export default {
  name: 'ResearchStatistics',
  data() {
    return {
      loading: false,
      tableData: [],
      emptyText: '暂无数据',
      groupData: [],
      careData: [],
      totalCages: 0,
      colorList: ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399', '#36CFC9', '#FF85C0', '#B37FEB', '#FFA940', '#73D13D']
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    // 获取数据
    async fetchData() {
      this.loading = true
      try {
        const res = await getFeedStatisticsByResearchGroup()
        if (res.status === 1 && res.data) {
          this.tableData = res.data
          this.processData()
        } else {
          this.$message.error('获取数据失败')
        }
      } catch (error) {
        console.error('获取课题组统计数据失败:', error)
        this.$message.error('获取数据失败')
      } finally {
        this.loading = false
      }
    },
    
    // 刷新数据
    refreshData() {
      this.fetchData()
    },
    
    // 处理数据
    processData() {
      // 处理课题组数据
      this.processGroupData()
      // 处理饲养类型数据
      this.processCareData()
      // 计算总笼盒数
      this.calculateTotalCages()
    },
    
    // 处理课题组数据
    processGroupData() {
      const groupMap = new Map()
      
      // 统计每个课题组的笼盒数量
      this.tableData.forEach(item => {
        const groupName = item.group_name || '未分配课题组'
        if (groupMap.has(groupName)) {
          groupMap.set(groupName, groupMap.get(groupName) + item.cage_count)
        } else {
          groupMap.set(groupName, item.cage_count)
        }
      })
      
      // 转换为数组格式
      this.groupData = Array.from(groupMap.entries()).map(([name, value]) => {
        return { name, value }
      })
    },
    
    // 处理饲养类型数据
    processCareData() {
      const careMap = new Map()
      
      // 统计每种饲养类型的笼盒数量
      this.tableData.forEach(item => {
        if (careMap.has(item.care)) {
          careMap.set(item.care, careMap.get(item.care) + item.cage_count)
        } else {
          careMap.set(item.care, item.cage_count)
        }
      })
      
      // 转换为数组格式
      this.careData = Array.from(careMap.entries()).map(([name, value]) => {
        return { name, value }
      })
    },
    
    // 计算总笼盒数
    calculateTotalCages() {
      this.totalCages = this.tableData.reduce((total, item) => total + item.cage_count, 0)
    },
    
    // 计算百分比
    calculatePercentage(value, total) {
      if (total === 0) return 0
      return Math.round((value / total) * 100)
    },
    
    // 获取颜色
    getColor(index) {
      return this.colorList[index % this.colorList.length]
    }
  }
}
</script>

<style lang="scss" scoped>
.research-statistics {
  .statistics-header {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h3 {
      margin: 0;
      font-size: 18px;
      color: #303133;
    }
    
    .header-actions {
      display: flex;
      gap: 10px;
    }
  }
  
  .statistics-content {
    background: #fff;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  
  .visualization-section {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #ebeef5;
    
    .section-title {
      margin-bottom: 20px;
      
      h4 {
        margin: 0;
        font-size: 16px;
        color: #303133;
        position: relative;
        padding-left: 10px;
        
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 16px;
          background-color: #409EFF;
          border-radius: 2px;
        }
      }
    }
    
    .charts-container {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      
      .chart-card {
        flex: 1;
        min-width: 300px;
        
        .card-header {
          font-weight: bold;
          color: #303133;
        }
        
        .chart-content {
          padding: 10px 0;
          
          .data-item {
            margin-bottom: 15px;
            
            &:last-child {
              margin-bottom: 0;
            }
            
            .item-label {
              display: flex;
              align-items: center;
              margin-bottom: 5px;
              
              .color-block {
                width: 16px;
                height: 16px;
                border-radius: 3px;
                margin-right: 8px;
              }
            }
            
            .item-value {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
              font-size: 14px;
              
              .percentage {
                color: #909399;
              }
            }
            
            .progress-bar {
              height: 8px;
              background-color: #f5f7fa;
              border-radius: 4px;
              overflow: hidden;
              
              .progress {
                height: 100%;
                border-radius: 4px;
                transition: width 0.3s ease;
              }
            }
          }
        }
      }
    }
  }
}
</style>
