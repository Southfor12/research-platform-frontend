<template>
  <div class="room-statistics">
    <div class="statistics-header">
      <h3>房间使用统计</h3>
    </div>
    <div class="statistics-content">
      <el-row :gutter="20">
        <el-col :span="24" v-for="room in roomData" :key="room.room_id" class="mb-20">
          <el-card shadow="hover" class="room-card">
            <div class="room-header">
              <div class="room-title">
                <i class="el-icon-office-building"></i>
                <span>{{ room.room_name }}</span>
              </div>
              <div class="room-id">ID: {{ room.room_id }}</div>
            </div>
            
            <div class="room-body">
              <el-row :gutter="20">
                <el-col :span="8">
                  <div class="stat-item">
                    <div class="stat-title">笼位总数</div>
                    <div class="stat-value">{{ room.cage_count }}</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="stat-item">
                    <div class="stat-title">已使用笼位</div>
                    <div class="stat-value">{{ room.used_cage_count }}</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="stat-item">
                    <div class="stat-title">空闲笼位</div>
                    <div class="stat-value">{{ room.free_cage_count }}</div>
                  </div>
                </el-col>
              </el-row>
              
              <div class="cage-status">
                <div class="status-title">笼位使用情况</div>
                <div class="status-bars">
                  <div class="status-bar-item">
                    <div class="bar-label">已使用</div>
                    <el-progress 
                      :percentage="calculatePercentage(room.used_cage_count, room.cage_count)" 
                      :color="'#409EFF'"
                      :show-text="false">
                    </el-progress>
                    <div class="bar-value">{{ room.used_cage_count }}</div>
                  </div>
                  <div class="status-bar-item">
                    <div class="bar-label">已锁定</div>
                    <el-progress 
                      :percentage="calculatePercentage(room.locked_cage_count, room.cage_count)" 
                      :color="'#F56C6C'"
                      :show-text="false">
                    </el-progress>
                    <div class="bar-value">{{ room.locked_cage_count }}</div>
                  </div>
                  <div class="status-bar-item">
                    <div class="bar-label">已预约</div>
                    <el-progress 
                      :percentage="calculatePercentage(room.reseved_cage_count, room.cage_count)" 
                      :color="'#E6A23C'"
                      :show-text="false">
                    </el-progress>
                    <div class="bar-value">{{ room.reseved_cage_count }}</div>
                  </div>
                  <div class="status-bar-item">
                    <div class="bar-label">空闲</div>
                    <el-progress 
                      :percentage="calculatePercentage(room.free_cage_count, room.cage_count)" 
                      :color="'#67C23A'"
                      :show-text="false">
                    </el-progress>
                    <div class="bar-value">{{ room.free_cage_count }}</div>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getFeedStatisticsByRoom } from '@/api/ani_manage'

export default {
  name: 'RoomStatistics',
  data() {
    return {
      roomData: []
    }
  },
  mounted() {
    this.getRoomStatistics()
  },
  methods: {
    // 获取房间统计数据
    getRoomStatistics() {
      getFeedStatisticsByRoom().then(res => {
        if (res.status === 1 && res.data) {
          this.roomData = res.data
        }
      })
    },
    // 计算百分比
    calculatePercentage(value, total) {
      if (!total) return 0
      return Math.round((value / total) * 100)
    }
  }
}
</script>

<style lang="scss" scoped>
.room-statistics {
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
    .mb-20 {
      margin-bottom: 20px;
    }
    
    .room-card {
      transition: all 0.3s;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      }
      
      .room-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 1px solid #ebeef5;
        
        .room-title {
          font-size: 18px;
          font-weight: bold;
          color: #303133;
          display: flex;
          align-items: center;
          
          i {
            margin-right: 10px;
            font-size: 24px;
            color: #409EFF;
          }
        }
        
        .room-id {
          font-size: 14px;
          color: #909399;
        }
      }
      
      .room-body {
        .stat-item {
          text-align: center;
          padding: 15px;
          background-color: #f5f7fa;
          border-radius: 4px;
          margin-bottom: 20px;
          
          .stat-title {
            font-size: 14px;
            color: #606266;
            margin-bottom: 10px;
          }
          
          .stat-value {
            font-size: 24px;
            color: #303133;
            font-weight: bold;
          }
        }
        
        .cage-status {
          margin-top: 20px;
          
          .status-title {
            font-size: 16px;
            color: #303133;
            margin-bottom: 15px;
            font-weight: bold;
          }
          
          .status-bars {
            .status-bar-item {
              display: flex;
              align-items: center;
              margin-bottom: 10px;
              
              .bar-label {
                width: 80px;
                font-size: 14px;
                color: #606266;
              }
              
              .el-progress {
                flex: 1;
                margin: 0 15px;
              }
              
              .bar-value {
                width: 50px;
                text-align: right;
                font-size: 14px;
                color: #303133;
                font-weight: bold;
              }
            }
          }
        }
      }
    }
  }
}
</style>
