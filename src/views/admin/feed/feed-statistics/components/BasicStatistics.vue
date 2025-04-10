<template>
  <div class="basic-statistics">
    <div class="statistics-header">
      <h3>基础统计数据</h3>
    </div>
    <div class="statistics-content">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover" class="statistics-card">
            <div class="statistics-item">
              <div class="item-icon">
                <i class="el-icon-sugar"></i>
              </div>
              <div class="item-info">
                <div class="item-title">饲养动物总数</div>
                <div class="item-value">{{ statistics.animal_count || 0 }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="statistics-card">
            <div class="statistics-item">
              <div class="item-icon">
                <i class="el-icon-box"></i>
              </div>
              <div class="item-info">
                <div class="item-title">笼盒总数</div>
                <div class="item-value">{{ statistics.cage_box_count || 0 }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="statistics-card">
            <div class="statistics-item">
              <div class="item-icon">
                <i class="el-icon-house"></i>
              </div>
              <div class="item-info">
                <div class="item-title">笼位总数</div>
                <div class="item-value">{{ statistics.cage_count || 0 }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="statistics-card">
            <div class="statistics-item">
              <div class="item-icon">
                <i class="el-icon-menu"></i>
              </div>
              <div class="item-info">
                <div class="item-title">笼架总数</div>
                <div class="item-value">{{ statistics.cage_rack_count || 0 }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      
      <el-row :gutter="20" class="mt-20">
        <el-col :span="6">
          <el-card shadow="hover" class="statistics-card">
            <div class="statistics-item">
              <div class="item-icon">
                <i class="el-icon-office-building"></i>
              </div>
              <div class="item-info">
                <div class="item-title">饲养房间总数</div>
                <div class="item-value">{{ statistics.room_count || 0 }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="statistics-card">
            <div class="statistics-item">
              <div class="item-icon">
                <i class="el-icon-collection-tag"></i>
              </div>
              <div class="item-info">
                <div class="item-title">活体品系总数</div>
                <div class="item-value">{{ statistics.strain_count || 0 }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover" class="statistics-card">
            <div class="statistics-item">
              <div class="item-title">动物类型分布</div>
              <div class="animal-type-list">
                <el-table
                  :data="statistics.animalTypeCountDTOs"
                  style="width: 100%"
                  :show-header="false"
                  size="small">
                  <el-table-column
                    prop="type"
                    label="类型"
                    width="180">
                    <template slot-scope="scope">
                      <span>{{ scope.row.type }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="count"
                    label="数量">
                    <template slot-scope="scope">
                      <el-progress 
                        :percentage="calculatePercentage(scope.row.count)" 
                        :color="getRandomColor(scope.$index)"
                        :show-text="false">
                      </el-progress>
                      <span class="count-text">{{ scope.row.count }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getFeedStatistics } from '@/api/ani_manage'

export default {
  name: 'BasicStatistics',
  data() {
    return {
      statistics: {
        animal_count: 0,
        cage_box_count: 0,
        cage_count: 0,
        cage_rack_count: 0,
        room_count: 0,
        strain_count: 0,
        animalTypeCountDTOs: []
      },
      colors: [
        '#409EFF', '#67C23A', '#E6A23C', '#F56C6C', 
        '#909399', '#36CE9E', '#FFA2D3', '#9A60B4'
      ]
    }
  },
  mounted() {
    this.getStatistics()
  },
  methods: {
    // 获取统计数据
    getStatistics() {
      getFeedStatistics().then(res => {
        if (res.status === 1 && res.data) {
          this.statistics = res.data
        }
      })
    },
    // 计算百分比
    calculatePercentage(count) {
      if (!this.statistics.animal_count) return 0
      return Math.round((count / this.statistics.animal_count) * 100)
    },
    // 获取随机颜色
    getRandomColor(index) {
      return this.colors[index % this.colors.length]
    }
  }
}
</script>

<style lang="scss" scoped>
.basic-statistics {
  .statistics-header {
    margin-bottom: 20px;
    h3 {
      margin: 0;
      font-size: 18px;
      color: #303133;
      position: relative;
      padding-left: 12px;
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 18px;
        background-color: #409EFF;
        border-radius: 2px;
      }
    }
  }
  
  .statistics-content {
    .mt-20 {
      margin-top: 20px;
    }
    
    .statistics-card {
      transition: all 0.3s;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      }
      
      .statistics-item {
        display: flex;
        align-items: center;
        padding: 20px;
        
        .item-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: rgba(64, 158, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          
          i {
            font-size: 30px;
            color: #409EFF;
          }
        }
        
        .item-info {
          flex: 1;
          
          .item-title {
            font-size: 14px;
            color: #606266;
            margin-bottom: 10px;
          }
          
          .item-value {
            font-size: 24px;
            color: #303133;
            font-weight: bold;
          }
        }
        
        .animal-type-list {
          width: 100%;
          
          .count-text {
            margin-left: 10px;
            font-size: 14px;
            color: #606266;
          }
        }
      }
    }
  }
}
</style>