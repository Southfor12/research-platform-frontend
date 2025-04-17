<template>
  <div class="contact-statistics">
    <div class="statistics-header">
      <h3>联系人使用统计</h3>
    </div>
    <div class="statistics-content">
      <!-- 联系人卡片列表 -->
      <el-row :gutter="20">
        <el-col :span="24" v-for="contact in groupedContacts" :key="contact.user_name" class="mb-20">
          <el-card shadow="hover" class="contact-card">
            <div class="contact-header">
              <div class="contact-title">
                <i class="el-icon-user"></i>
                <span>{{ contact.user_name }}</span>
              </div>
              <div class="contact-group">{{ contact.group_name }}</div>
            </div>
            
            <div class="contact-body">
              <div class="care-list">
                <div v-for="(care, index) in contact.cares" :key="index" class="care-item">
                  <div class="care-header">
                    <div class="care-title">
                      <i :class="getCareIcon(care.care)"></i>
                      <span>{{ care.care }}</span>
                    </div>
                    <div class="care-count">
                      <span class="count-label">笼位数量:</span>
                      <span class="count-value">{{ care.cage_count }}</span>
                    </div>
                  </div>
                  
                  <div class="care-details">
                    <div class="detail-item">
                      <div class="detail-label">来源</div>
                      <div class="detail-value">{{ care.source }}</div>
                    </div>
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
import { getFeedStatisticsByContact } from '@/api/ani_manage'

export default {
  name: 'ContactStatistics',
  data() {
    return {
      contactData: []
    }
  },
  computed: {
    // 按联系人分组数据
    groupedContacts() {
      const grouped = {}
      
      // 遍历原始数据，按联系人分组
      this.contactData.forEach(item => {
        if (!grouped[item.user_name]) {
          // 创建新的联系人组
          grouped[item.user_name] = {
            user_name: item.user_name,
            group_name: item.group_name,
            cares: []
          }
        }
        
        // 添加饲养类型数据
        grouped[item.user_name].cares.push({
          care: item.care,
          cage_count: item.cage_count,
          source: item.source
        })
      })
      
      // 转换为数组
      return Object.values(grouped)
    }
  },
  mounted() {
    this.getContactStatistics()
  },
  methods: {
    // 获取联系人统计数据
    getContactStatistics() {
      getFeedStatisticsByContact().then(res => {
        if (res.status === 1 && res.data) {
          this.contactData = res.data
        }
      })
    },
    // 根据饲养类型获取图标
    getCareIcon(care) {
      const iconMap = {
        '小鼠饲养': 'el-icon-sugar',
        '犬饲养': 'el-icon-pet',
        '猫饲养': 'el-icon-pet',
        '兔饲养': 'el-icon-pet',
        '猪饲养': 'el-icon-pet',
        '猴饲养': 'el-icon-pet',
        '其他饲养': 'el-icon-pet'
      }
      
      return iconMap[care] || 'el-icon-pet'
    }
  }
}
</script>

<style lang="scss" scoped>
.contact-statistics {
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
    
    .contact-card {
      transition: all 0.3s;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      }
      
      .contact-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 1px solid #ebeef5;
        
        .contact-title {
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
        
        .contact-group {
          font-size: 14px;
          color: #909399;
          background-color: #f5f7fa;
          padding: 5px 10px;
          border-radius: 4px;
        }
      }
      
      .contact-body {
        .care-list {
          .care-item {
            background-color: #f5f7fa;
            border-radius: 4px;
            padding: 15px;
            margin-bottom: 15px;
            
            &:last-child {
              margin-bottom: 0;
            }
            
            .care-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 15px;
              
              .care-title {
                font-size: 16px;
                font-weight: bold;
                color: #303133;
                display: flex;
                align-items: center;
                
                i {
                  margin-right: 10px;
                  font-size: 20px;
                  color: #67C23A;
                }
              }
              
              .care-count {
                background-color: #ecf5ff;
                padding: 5px 10px;
                border-radius: 4px;
                
                .count-label {
                  font-size: 14px;
                  color: #606266;
                  margin-right: 5px;
                }
                
                .count-value {
                  font-size: 16px;
                  color: #409EFF;
                  font-weight: bold;
                }
              }
            }
            
            .care-details {
              display: flex;
              flex-wrap: wrap;
              
              .detail-item {
                margin-right: 30px;
                margin-bottom: 10px;
                
                .detail-label {
                  font-size: 14px;
                  color: #606266;
                  margin-bottom: 5px;
                }
                
                .detail-value {
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
}
</style>
