<template>
  <div class="app-container">
    <el-tabs v-model="activeTab" class="statistics-tabs">
      <el-tab-pane label="基础统计" name="basic">
        <basic-statistics v-if="activeTab === 'basic'" />
      </el-tab-pane>
      <el-tab-pane label="按房间统计" name="room">
        <room-statistics v-if="activeTab === 'room'" />
      </el-tab-pane>
      <el-tab-pane label="按课题组统计" name="research">
        <research-statistics v-if="activeTab === 'research'" />
      </el-tab-pane>
      <el-tab-pane label="按联系人统计" name="contact">
        <contact-statistics v-if="activeTab === 'contact'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BasicStatistics from './components/BasicStatistics'
import RoomStatistics from './components/RoomStatistics'
import ResearchStatistics from './components/ResearchStatistics'
import ContactStatistics from './components/ContactStatistics'

export default {
  name: 'FeedStatistics',
  components: {
    BasicStatistics,
    RoomStatistics,
    ResearchStatistics,
    ContactStatistics
  },
  data() {
    return {
      activeTab: 'basic'
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
  
  .statistics-tabs {
    background: #fff;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    
    ::v-deep .el-tabs__header {
      margin-bottom: 25px;
    }
    
    ::v-deep .el-tabs__nav {
      border-radius: 4px;
    }
    
    ::v-deep .el-tabs__item {
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      
      &.is-active {
        font-weight: bold;
      }
    }
  }
}
</style>
